import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Insert data in the convex database.
export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        await ctx.db.insert("files", {
            name: args.name,
        })
    }
})

// Fetch all data in the convex database
export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        return ctx.db.query("files").collect();
    }
})