"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  // Hooks for fetching organization and user data
  const organization = useOrganization();
  const user = useUser();

  // Logic for determining orgId based on loaded organization and user data
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // hooks for fetching files
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  // Determine if files are still loading
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">
      {/* Display loading indicator while files are loading */}
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading your images...</div>
        </div>
      )}

      {/* Display message and upload button when no files are available */}
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="A girl with a folder icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl">No files found. Upload one now!</div>
          <UploadButton />
        </div>
      )}

      {/* Display files if not loading and files exist */}
      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Render uploaded files */}
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
