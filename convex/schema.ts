import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    username: v.string(),
    title: v.string(),
    about: v.string(),
    bio: v.optional(v.string()),
    portfolioUrls: v.optional(v.array(v.string())),
    profileImageUrl: v.optional(v.string()),
    favoritedSellerIds: v.optional(v.array(v.string())),
    tokenIdentifier: v.string(),
    customTag: v.optional(v.string()),
    stripeAccountId: v.optional(v.string()),
    stripeAccountSetupComplete: v.optional(v.boolean()),
    userType: v.optional(v.union(v.literal("contractor"), v.literal("business"))), // Add this line
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_username", ["username"]),
    reviews: defineTable({
        authorId: v.id("users"),
        sellerId: v.id("users"),
        jobId: v.id("jobs"),
        comment: v.string(),
        communication_level: v.number(),
        recommend_to_a_friend: v.number(),
        service_as_described: v.number(),
    })
        .index("by_sellerId", ["sellerId"])
        .index("by_jobId", ["jobId"]),
    skills: defineTable({
        skill: v.string(),
        userId: v.id("users"),
    })
        .index("by_userId", ["userId"]),
    languages: defineTable({
        language: v.string(),
        userId: v.id("users"),
    })
        .index("by_userId", ["userId"]),
    userFlags: defineTable({
        userId: v.id("users"),
        markingType: v.string(),
        description: v.string(),
    }),
    countries: defineTable({
        countryName: v.string(),
        userId: v.id("users"),
    })
        .index("by_userId", ["userId"]),
    jobs: defineTable({
        title: v.string(),
        description: v.string(),
        sellerId: v.id("users"),
        subcategoryId: v.id("subcategories"),
        published: v.optional(v.boolean()),
        clicks: v.number(),
    })
        .index("by_sellerId", ["sellerId"])
        .index("by_subcategoryId", ["subcategoryId"])
        .index("by_published", ["published"])
        .searchIndex("search_title", {
            searchField: "title",
        }),
    offers: defineTable({
        jobId: v.id("jobs"),
        title: v.string(),
        description: v.string(),
        tier: v.union(
            v.literal("Basic"),
            v.literal("Standard"),
            v.literal("Premium")
        ),
        price: v.number(),
        delivery_days: v.number(),
        revisions: v.number(),
        stripePriceId: v.string(),
    })
        .index("by_jobId", ["jobId"])
        .index("by_tier", ["tier"])
        .index("by_jobId_tier", ["jobId", "tier"]),
    orders: defineTable({
        offerId: v.id("offers"),
        jobId: v.id("jobs"),
        buyerId: v.id("users"),
        fulfillmentStatus: v.string(),
        fulfilmentTime: v.optional(v.number()),
    })
        .index("by_buyerId", ["buyerId"])
        .index("by_jobId", ["jobId"]),
    jobMedia: defineTable({
        storageId: v.id("_storage"),
        format: v.string(),
        jobId: v.id("jobs"),
    })
        .index("by_jobId", ["jobId"])
        .index("by_storageId", ["storageId"]),
    categories: defineTable({
        name: v.string(),
    }),
    subcategories: defineTable({
        categoryId: v.id("categories"),
        name: v.string(),
    })
        .index("by_category", ["categoryId"])
        .index("by_name", ["name"]),
    faq: defineTable({
        question: v.string(),
        answer: v.string(),
        jobId: v.id("jobs"),
    }),
    messages: defineTable({
        userId: v.id("users"),
        text: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        seen: v.boolean(),
        conversationId: v.id("conversations"),
    })
        .index('by_conversationId', ['conversationId']),
    conversations: defineTable({
        participantOneId: v.id("users"),
        participantTwoId: v.id("users"),
    })
        .index('by_participantOneId', ['participantOneId', 'participantTwoId'])
        .index('by_participantTwoId', ['participantTwoId', 'participantOneId']),
    userFavorites: defineTable({
        userId: v.id("users"),
        jobId: v.id("jobs"),
    })
        .index("by_job", ["jobId"])
        .index("by_user_job", ["userId", "jobId"])
        .index("by_user", ["userId"]),
});
