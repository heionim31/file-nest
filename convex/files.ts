import { ConvexError, v } from "convex/values"
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users";

// Function to check if user has access to the organization
async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await getUser(ctx, tokenIdentifier)

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

    return hasAccess;
}

// Insert data in the convex database.
export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        console.log(identity);

        // Check if the identity exists
        if(!identity) {
            throw new ConvexError("you must be logged in to upload a file");
        }

        // Check if the user has access to the organization
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if (!hasAccess) {
            throw new ConvexError("you do not have access to this org");
        }

        // Insert the file into the database
        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
        })
    }
})

// Fetch data in the convex database
export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        // Check if the identity exists
        if(!identity) {
           return [];
        }

        // Check if the user has access to the organization
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if(!hasAccess) {
            return [];
         }

        // Fetch files from the database for the specified organization
        return ctx.db.query("files").withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect();
    }
})