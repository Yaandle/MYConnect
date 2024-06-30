import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        subcategoryId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user === null) {
            return;
        }

        const jobId = await ctx.db.insert("jobs", {
            title: args.title,
            description: args.description,
            subcategoryId: args.subcategoryId as Id<"subcategories">,
            sellerId: user._id!,
            published: false,
            clicks: 0,
        })

        return jobId;
    },
});

export const get = query({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);
        if (job === null) {
            throw new Error("Job not found");
        }
        const seller = await ctx.db.get(job.sellerId as Id<"users">);

        if (!seller) {
            throw new Error("Seller not found");
        }

        const country = await ctx.db.query("countries")
            .withIndex("by_userId", (q) => q.eq("userId", seller._id))
            .unique();

        if (country === null) {
            throw new Error("Country not found");
        }

        const languages = await ctx.db.query("languages")
            .withIndex("by_userId", (q) => q.eq("userId", seller._id))
            .collect();

        const sellerWithCountryAndLanguages = {
            ...seller,
            country: country,
            languages: languages,
        };

        const jobWithSeller = {
            ...job,
            seller: sellerWithCountryAndLanguages
        };

        const lastFulfilment = await ctx.db.query("orders")
            .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
            .order("desc")
            .first();

        const jobWithSellerAndLastFulfilment = {
            ...jobWithSeller,
            lastFulfilment: lastFulfilment,
        };

        const images = await ctx.db.query("jobMedia")
            .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
            .collect();

        const imagesWithUrls = await Promise.all(images.map(async (image) => {
            const imageUrl = await ctx.storage.getUrl(image.storageId);
            if (!imageUrl) {
                throw new Error("Image not found");
            }
            return { ...image, url: imageUrl };
        }));

        const jobWithSellerAndLastFulfilmentAndImages = {
            ...jobWithSellerAndLastFulfilment,
            images: imagesWithUrls,
        };

        return jobWithSellerAndLastFulfilmentAndImages;
    },
});

export const isPublished = query({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);
        return job?.published || false;
    }
});

export const publish = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);
        if (!job) {
            throw new Error("Job not found");
        }

        const media = await ctx.db.query("jobMedia")
            .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
            .collect();

        const offers = await ctx.db.query("offers")
            .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
            .collect();

        if (media.length === 0 || job.description === "" || offers.length !== 3) {
            throw new Error("Job needs at least one image to be published");
        }

        await ctx.db.patch(args.id, {
            published: true,
        });

        return job;
    },
});

export const unpublish = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);

        if (!job) {
            throw new Error("Job not found");
        }

        await ctx.db.patch(args.id, {
            published: false,
        });

        return job;
    },
});

export const remove = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user === null) {
            return;
        }

        const userId = user._id;
        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_job", (q) =>
                q
                    .eq("userId", userId)
                    .eq("jobId", args.id)
            )
            .unique();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id);
        }

        await ctx.db.delete(args.id);
    },
});

export const updateDescription = mutation({
    args: { id: v.id("jobs"), description: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const description = args.description.trim();

        if (!description) {
            throw new Error("Description is required");
        }

        if (description.length > 20000) {
            throw new Error("Description is too long!")
        }

        const job = await ctx.db.patch(args.id, {
            description: args.description,
        });

        return job;
    },
});

export const update = mutation({
    args: { id: v.id("jobs"), title: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const title = args.title.trim();

        if (!title) {
            throw new Error("Title is required");
        }

        if (title.length > 60) {
            throw new Error("Title cannot be longer than 60 characters")
        }

        const job = await ctx.db.patch(args.id, {
            title: args.title,
        });

        return job;
    },
});

export const favorite = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const job = await ctx.db.get(args.id);

        if (!job) {
            throw new Error("Board not found");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user === null) {
            return;
        }

        const userId = user._id;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_job", (q) =>
                q
                    .eq("userId", userId)
                    .eq("jobId", job._id)
            )
            .unique();

        if (existingFavorite) {
            throw new Error("Board already favorited");
        }

        await ctx.db.insert("userFavorites", {
            userId,
            jobId: job._id,
        });

        return job;
    },
});

export const unfavorite = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const job = await ctx.db.get(args.id);

        if (!job) {
            throw new Error("Board not found");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user === null) {
            return;
        }

        const userId = user._id;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_job", (q) =>
                q
                    .eq("userId", userId)
                    .eq("jobId", job._id)
            )
            .unique();

        if (!existingFavorite) {
            throw new Error("Favorited job not found");
        }

        await ctx.db.delete(existingFavorite._id);

        return job;
    },
});

export const getSeller = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const seller = ctx.db.get(args.id);
        return seller;
    },
});

export const getCategoryAndSubcategory = query({
    args: {
        jobId: v.id("jobs"),
    },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.jobId);

        if (!job) {
            throw new Error("Job not found");
        }

        const subcategory = await ctx.db.get(job.subcategoryId);

        if (!subcategory) {
            throw new Error("Subcategory not found");
        }

        const category = await ctx.db.get(subcategory.categoryId);
        if (!category) {
            throw new Error("Category not found");
        }

        return {
            category: category.name,
            subcategory: subcategory.name,
        };
    }
});