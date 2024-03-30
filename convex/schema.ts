import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define table for storing files
  files: defineTable({ 
    name: v.string(), 
    orgId: v.string(), 
    fileId: v.id("_storage") 
  }).index(
    "by_orgId", 
    ["orgId"]
  ),
  // Define table for storing user information
  users: defineTable({
    tokenIdentifier: v.string(), // User token identifier
    orgIds: v.array(v.string()), // Array of organization IDs associated with the user
  }).index(
    "by_tokenIdentifier", 
    ["tokenIdentifier"]
  ),
});