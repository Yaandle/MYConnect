import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// internal mutations - https://github.com/get-convex/convex-stripe-demo/blob/main/convex/payments.ts

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
            businessId: user._id!,
            published: false,
            clicks: 0,
        });

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
        const business = await ctx.db.get(job.businessId as Id<"users">);

        if (!business) {
            throw new Error("Business not found");
        }

    



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

    
        const offers = await ctx.db.query("offers")
            .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
            .collect();

        

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
            throw new Error("Job not found");
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
            throw new Error("Job already favorited");
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
            throw new Error("Job not found");
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
            throw new Error("Job not favorited");
        }

        await ctx.db.delete(existingFavorite._id);

        return job;
    },
});
