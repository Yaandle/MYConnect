import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Define a mutation for storing user information
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the user identity from the context
    const identity = await ctx.auth.getUserIdentity();
    
    // Check if identity is available
    if (!identity) {
      throw new Error("Authentication required to store user.");
    }

    // Query the database to check if the user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    // If user exists, update username if changed
    if (existingUser) {
      if (existingUser.username !== identity.nickname) {
        await ctx.db.patch(existingUser._id, { username: identity.nickname });
      }
      return existingUser._id;
    }

    // If user does not exist, create a new user entry
    const newUserId = await ctx.db.insert("users", {
      fullName: identity.name ?? "",
      username: identity.nickname ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      title: "", // default value
      about: "", // default value
      bio: "", // optional field
      portfolioUrls: [], // optional field
      profileImageUrl: identity.profileUrl ?? "",
      favoritedSellerIds: [], // optional field
      customTag: "", // optional field
      userType: "Business", // default value
    });

    return newUserId;
  },
});
