"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";

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

  return (
    <main className="container mx-auto pt-12">
      {files && files.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="A girl with a folder icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl">You have no files, upload one now</div>
          <UploadButton />
        </div>
      )}

      {files && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>

            <UploadButton />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Display uploaded files */}
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
