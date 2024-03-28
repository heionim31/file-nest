import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Insert data in the convex database.
export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        // Check if the identity exists
        if(!identity) {
            throw new ConvexError("you must be logged in to upload a file");
        }

        await ctx.db.insert("files", {
            name: args.name,
        })
    }
})

// Fetch all data in the convex database
export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        // Check if the identity exists
        if(!identity) {
           return [];
        }

        return ctx.db.query("files").collect();
    }
})