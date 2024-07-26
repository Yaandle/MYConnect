import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByUser = query({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const identity = await ctx.auth.getUserIdentity();

            console.log('User Identity:', identity);

            const user = await ctx.db
                .query("users")
                .withIndex("by_username", (q) => q.eq("username", args.username))
                .first();

            if (!user) {
                console.log(`User not found for username: ${args.username}`);
                return [];
            }

            const skills = await ctx.db
                .query("skills")
                .withIndex("by_userId", (q) => q.eq("userId", user._id))
                .collect();

            return skills;
        } catch (error) {
            console.error('Error in getByUser handler:', error);
            return [];
        }
    },
});

export const updateUserSkills = mutation({
    args: {
        username: v.string(),
        skills: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Delete existing skills
        const existingSkills = await ctx.db
            .query("skills")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        for (const skill of existingSkills) {
            await ctx.db.delete(skill._id);
        }

        // Add new skills
        for (const skillName of args.skills) {
            await ctx.db.insert("skills", {
                userId: user._id,
                skill: skillName,
            });
        }

        return args.skills;
    },
});