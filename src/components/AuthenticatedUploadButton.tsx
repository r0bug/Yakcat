'use client'

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const BaseUploadButton = generateUploadButton<OurFileRouter>();

export function AuthenticatedUploadButton(props: any) {
  // Get token from localStorage and pass it in headers
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return (
    <BaseUploadButton
      {...props}
      headers={token ? { Authorization: `Bearer ${token}` } : undefined}
    />
  );
}