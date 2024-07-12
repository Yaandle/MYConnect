import { mutation, query } from './_generated/server'
import { v } from "convex/values";

export const createListing = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const listingId = await ctx.db.insert('listings', args)
    return listingId
  },
})

export const getListings = query({
  handler: async (ctx) => {
    return await ctx.db.query('listings').collect()
  },
})