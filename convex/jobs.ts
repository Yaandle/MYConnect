import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: {
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
        filter: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        const title = args.search as string;

        let jobs = [];

        if (title) {
            jobs = await ctx.db
                .query("jobs")
                .withSearchIndex("search_title", (q) =>
                    q
                        .search("title", title)
                )
                .collect();
        } else {
            jobs = await ctx.db
                .query("jobs")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .collect();
        }

        // check if there is filter
        if (args.filter !== undefined) {
            const filter = args.filter as string;
            // get subcategory by name
            const subcategory = await ctx.db
                .query("subcategories")
                .withIndex("by_name", (q) => q.eq("name", filter))
                .unique();

            const filteredJobs = jobs.filter((job) => job.subcategoryId === subcategory?._id);
            jobs = filteredJobs;
        }

        let jobsWithFavoriteRelation = jobs;

        if (identity !== null) {
            jobsWithFavoriteRelation = await Promise.all(jobs.map((job) => {
                return ctx.db
                    .query("userFavorites")
                    .withIndex("by_user_job", (q) =>
                        q
                            .eq("userId", job.sellerId)
                            .eq("jobId", job._id)
                    )
                    .unique()
                    .then((favorite) => {
                        console.log("favorite: ", favorite);
                        return {
                            ...job,
                            favorited: !!favorite,
                        };
                    });
            }));
        }

        //const jobsWithFavorite = await Promise.all(jobsWithFavoriteRelation);


        const jobsWithImages = await Promise.all(jobsWithFavoriteRelation.map(async (job) => {
            const image = await ctx.db
                .query("jobMedia")
                .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                .first();

            const seller = await ctx.db.query("users")
                .filter((q) => q.eq(q.field("_id"), job.sellerId))
                .unique();

            if (!seller) {
                throw new Error("Seller not found");
            }

            const reviews = await ctx.db.query("reviews")
                .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                .collect();

            const offer = await ctx.db.query("offers")
                .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                .first();

            return {
                ...job,
                storageId: image?.storageId,
                seller,
                reviews,
                offer
            };
        }));

        return jobsWithImages;
    },
});


export const getBySellerName = query({
    args: {
        sellerName: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.sellerName))
            .unique();

        if (!user) {
            return null;
        }

        const jobs = await ctx.db
            .query("jobs")
            .withIndex("by_sellerId", (q) => q.eq("sellerId", user._id))
            .collect();

        return jobs;
    },
});


export const getJobsWithImages = query({
    args: { sellerUsername: v.string() },
    handler: async (ctx, args) => {

        const seller = await ctx.db.query("users")
            .withIndex("by_username", (q) => q.eq("username", args.sellerUsername))
            .unique();

        if (seller === null) {
            throw new Error("Seller not found");
        }

        const jobs = await ctx.db.query("jobs")
            .withIndex("by_sellerId", (q) => q.eq("sellerId", seller._id))
            .collect();

        if (jobs === null) {
            throw new Error("Jobs not found");
        }

        const jobsWithImages = await Promise.all(jobs.map(async (job) => {

            // get images
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

            const jobWithImages = {
                ...job,
                images: imagesWithUrls,
            };

            return jobWithImages;
        }));

        return jobsWithImages;
    },
});



export const getJobsWithOrderAmountAndRevenue = query({
    handler: async (ctx) => {
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

        if (!user) {
            throw new Error("Couldn't authenticate user");
        }

        const jobs = await ctx.db
            .query("jobs")
            .withIndex("by_sellerId", (q) => q.eq("sellerId", user._id))
            .order("desc")
            .collect();

        const jobsWithOrderAmount = await Promise.all(
            jobs.map(async (job) => {
                const orders = await ctx.db
                    .query("orders")
                    .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                    .collect();

                const orderAmount = orders.length;

                return {
                    ...job,
                    orderAmount,
                };
            })
        );

        const jobsWithOrderAmountAndRevenue = await Promise.all(
            jobsWithOrderAmount.map(async (job) => {
                const offers = await ctx.db
                    .query("offers")
                    .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                    .collect();

                const totalRevenue = offers.reduce((acc, offer) => acc + offer.price, 0);

                return {
                    ...job,
                    totalRevenue,
                };
            })
        );

        // get images
        const jobsFull = await Promise.all(jobsWithOrderAmountAndRevenue.map(async (job) => {
            const image = await ctx.db
                .query("jobMedia")
                .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
                .first();

            if (image) {
                const url = await ctx.storage.getUrl(image.storageId);
                return {
                    ...job,
                    ImageUrl: url
                };
            }
            return {
                ...job,
                ImageUrl: null
            };
        }));




        return jobsFull
    },
});