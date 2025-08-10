import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/jwt-config';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Image uploader for items
  itemImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async ({ req }) => {
      // Get the authorization header
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader) {
        // For uploadthing, we might need to check cookies as well
        const cookieHeader = req.headers.get('cookie');
        if (cookieHeader) {
          const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(c => c.split('='))
          );
          const token = cookies.token;
          
          if (token) {
            try {
              const decoded = jwt.verify(token, JWT_SECRET) as any;
              return { userId: decoded.userId };
            } catch (error) {
              console.error('Cookie token verification failed:', error);
            }
          }
        }
        
        // If no auth, allow upload but with anonymous user
        // This is needed because Uploadthing client might not send auth headers
        console.log("No auth header, allowing anonymous upload");
        return { userId: "anonymous" };
      }
      
      const token = authHeader.replace('Bearer ', '');
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return { userId: decoded.userId };
      } catch (error) {
        console.error('Token verification failed:', error);
        throw new UploadThingError("Invalid token");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Return file data to be used on the client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;