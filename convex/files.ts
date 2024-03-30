import { ConvexError, v } from "convex/values"
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users";

// Mutation to generate an upload URL for files
export const generateUploadUrl = mutation(async (ctx) => {
    // Retrieve user identity
    const identity = await ctx.auth.getUserIdentity();

    // Check if the user is authenticated
    if(!identity) {
        throw new ConvexError("you must be logged in to upload a file");
    }

    // Generate and return the upload URL
    return await ctx.storage.generateUploadUrl();
  });

// Function to check if user has access to the organization
async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    // Retrieve user information
    const user = await getUser(ctx, tokenIdentifier)

     // Check if the user has access to the organization
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

    return hasAccess;
}

// Mutation to create a new file entry in the database
export const createFile = mutation({
    args: {
        name: v.string(), // File name
        fileId: v.id("_storage"), // File ID
        orgId: v.string(), // Organization ID
    },
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        // Check if the user is authenticated
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
            fileId: args.fileId
        })
    }
})

// Query to retrieve files for a specified organization from the database
export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // Retrieve user identity
        const identity = await ctx.auth.getUserIdentity();

        // Check if the user is authenticated
        if(!identity) {
           return []; // Return empty array if user is not authenticated
        }

        // Check if the user has access to the organization
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if(!hasAccess) {
            return []; // Return empty array if user does not have access to the organization
         }

        // Fetch files from the database for the specified organization
        return ctx.db.query("files").withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect();
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        
        const identity = await ctx.auth.getUserIdentity();

       
        if(!identity) {
            throw new ConvexError("You do not have access to this org");
        }

        const file = await ctx.db.get(args.fileId)

        if (!file) {
            throw new ConvexError("This file does not exist");

        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            file.orgId
        )

        if (!hasAccess) {
            throw new ConvexError("You do not have access to delete this file");
        }

        await ctx.db.delete(args.fileId);
    }
})