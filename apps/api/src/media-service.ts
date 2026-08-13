import { createHash, createHmac, randomUUID } from "node:crypto";
import type {
  AssetStatus,
  CreateUpload,
  ScanRequested,
} from "@media/contracts";
export interface Asset extends CreateUpload {
  id: string;
  tenantId: string;
  status: AssetStatus;
  objectKey: string;
  uploadedParts: number[];
  createdAt: string;
}
export interface Audit {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  assetId: string;
  at: string;
}
export class MediaError extends Error {
  constructor(
    readonly code: string,
    readonly status = 422,
  ) {
    super(code);
  }
}
export class MediaService {
  readonly assets = new Map<string, Asset>();
  readonly idempotency = new Map<string, string>();
  readonly audits: Audit[] = [];
  readonly events: ScanRequested[] = [];
  readonly usedBytes = new Map<string, number>();
  constructor(
    private readonly signingSecret = "local-development-signing-secret-32-bytes",
  ) {}
  create(
    tenantId: string,
    actorId: string,
    input: CreateUpload,
    key: string,
    correlationId: string,
    now = new Date(),
  ) {
    const prior = this.idempotency.get(`${tenantId}:${key}`);
    if (prior) return this.response(this.get(tenantId, prior));
    const used = this.usedBytes.get(tenantId) ?? 0;
    if (used + input.bytes > 5_000_000_000)
      throw new MediaError("TENANT_STORAGE_QUOTA_EXCEEDED", 429);
    const id = randomUUID(),
      objectKey = `quarantine/${tenantId}/${id}/v1/source`;
    const asset: Asset = {
      ...input,
      id,
      tenantId,
      status: "PENDING_UPLOAD",
      objectKey,
      uploadedParts: [],
      createdAt: now.toISOString(),
    };
    this.assets.set(id, asset);
    this.idempotency.set(`${tenantId}:${key}`, id);
    this.usedBytes.set(tenantId, used + input.bytes);
    this.audit(tenantId, actorId, "asset.created", id, now);
    return this.response(asset);
  }
  recordPart(tenantId: string, id: string, part: number, checksum: string) {
    const asset = this.get(tenantId, id);
    if (part < 1 || part > asset.parts)
      throw new MediaError("INVALID_PART_NUMBER");
    if (checksum.length !== 64) throw new MediaError("INVALID_PART_CHECKSUM");
    if (!asset.uploadedParts.includes(part)) asset.uploadedParts.push(part);
    asset.status = "UPLOADING";
    return { part, received: true };
  }
  complete(
    tenantId: string,
    actorId: string,
    id: string,
    checksum: string,
    correlationId: string,
    now = new Date(),
  ) {
    const asset = this.get(tenantId, id);
    if (asset.uploadedParts.length !== asset.parts)
      throw new MediaError("UPLOAD_INCOMPLETE", 409);
    if (checksum !== asset.checksum) throw new MediaError("CHECKSUM_MISMATCH");
    asset.status = "QUARANTINED";
    this.events.push({
      type: "asset.scan.requested",
      tenantId,
      assetId: id,
      versionId: `${id}:v1`,
      objectKey: asset.objectKey,
      checksum,
      correlationId,
    });
    this.audit(tenantId, actorId, "upload.completed", id, now);
    return asset;
  }
  list(tenantId: string) {
    return [...this.assets.values()].filter((x) => x.tenantId === tenantId);
  }
  get(tenantId: string, id: string) {
    const asset = this.assets.get(id);
    if (!asset || asset.tenantId !== tenantId)
      throw new MediaError("ASSET_NOT_FOUND", 404);
    return asset;
  }
  private response(asset: Asset) {
    return {
      asset,
      upload: {
        uploadId: `upload_${asset.id}`,
        expiresInSeconds: 900,
        parts: Array.from({ length: asset.parts }, (_, i) => {
          const part = i + 1;
          const signature = createHmac("sha256", this.signingSecret)
            .update(`${asset.objectKey}:${part}`)
            .digest("hex");
          return {
            part,
            url: `http://localhost:9010/media-quarantine/${asset.objectKey}?partNumber=${part}&signature=${signature}`,
          };
        }),
        requiredHeaders: {
          "content-type": asset.mediaType,
          "x-amz-checksum-sha256": asset.checksum,
        },
      },
    };
  }
  private audit(
    tenantId: string,
    actorId: string,
    action: string,
    assetId: string,
    at: Date,
  ) {
    this.audits.push({
      id: randomUUID(),
      tenantId,
      actorId,
      action,
      assetId,
      at: at.toISOString(),
    });
  }
}
