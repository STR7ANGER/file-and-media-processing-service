import { z } from "zod";
export const assetStatus = z.enum([
  "PENDING_UPLOAD",
  "UPLOADING",
  "QUARANTINED",
  "SCANNING",
  "READY",
  "REJECTED",
  "DELETED",
]);
export const createUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(240),
  mediaType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "application/pdf",
    "text/plain",
  ]),
  bytes: z.number().int().positive().max(500_000_000),
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
  parts: z.number().int().min(1).max(10_000).default(1),
  visibility: z.enum(["PRIVATE", "TENANT", "PUBLIC"]).default("PRIVATE"),
});
export const authSchema = z.object({
  tenantId: z.string().min(1),
  actorId: z.string().min(1),
  apiKey: z.string().min(16),
  role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
});
export type CreateUpload = z.infer<typeof createUploadSchema>;
export type AssetStatus = z.infer<typeof assetStatus>;
export interface ScanRequested {
  type: "asset.scan.requested";
  tenantId: string;
  assetId: string;
  versionId: string;
  objectKey: string;
  checksum: string;
  correlationId: string;
}
