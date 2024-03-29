import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

// Function to retrieve user information based on token identifier
export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string ) {
   
    // Query the database for user with the given token identifier
    const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => 
            q.eq("tokenIdentifier", tokenIdentifier)
        ).first();

    if (!user) {
        throw new ConvexError("expected user to be defined")
    }

    return user;
}

// Mutation to create a new user with the given token identifier
export const createUser = internalMutation({
    args: { tokenIdentifier: v.string() },
    async handler(ctx, args) {
        // Insert a new user into the database with the provided token identifier
        await ctx.db.insert("users", {
            tokenIdentifier:args.tokenIdentifier,
            orgIds: [],
        })
    },
})

// Mutation to associate an organization ID with a user based on token identifier
export const addOrgIdToUser = internalMutation({
    args: { tokenIdentifier: v.string(), orgId: v.string() },

    async handler(ctx, args) {
        // Retrieve the user based on the token identifier
        const user = await getUser(ctx, args.tokenIdentifier)

        // Patch the user document to add the organization ID to its list of orgIds
        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, args.orgId],
        })
    },
})