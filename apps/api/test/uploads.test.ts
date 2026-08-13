import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { MediaService } from "../src/media-service.js";
import type { CreateUpload } from "@media/contracts";
const headers = {
  "content-type": "application/json",
  "x-tenant-id": "tenant-a",
  "x-actor-id": "user-1",
  "x-api-key": "1234567890abcdef",
  "x-role": "EDITOR",
  "x-correlation-id": "corr-1",
  "idempotency-key": "upload-1",
};
const input: CreateUpload = {
  fileName: "clip.mp4",
  mediaType: "video/mp4",
  bytes: 1024,
  checksum: "a".repeat(64),
  parts: 2,
  visibility: "PRIVATE",
};
test("creates idempotent multipart upload and queues quarantine scan", async () => {
  const service = new MediaService(),
    app = createApp(service);
  const response = await app.request("/v1/uploads", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  assert.equal(response.status, 201);
  const created = (await response.json()) as {
    asset: { id: string };
    upload: { parts: unknown[] };
  };
  assert.equal(created.upload.parts.length, 2);
  const duplicate = (await (
    await app.request("/v1/uploads", {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    })
  ).json()) as typeof created;
  assert.equal(duplicate.asset.id, created.asset.id);
  for (const part of [1, 2])
    assert.equal(
      (
        await app.request(`/v1/uploads/${created.asset.id}/parts/${part}`, {
          method: "PUT",
          headers: { ...headers, "x-part-checksum": "b".repeat(64) },
        })
      ).status,
      200,
    );
  const complete = await app.request(
    `/v1/uploads/${created.asset.id}/complete`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ checksum: input.checksum }),
    },
  );
  assert.equal(
    ((await complete.json()) as { status: string }).status,
    "QUARANTINED",
  );
  assert.equal(service.events[0]?.correlationId, "corr-1");
});
test("enforces tenant isolation, RBAC, and checksum", async () => {
  const service = new MediaService(),
    app = createApp(service);
  const created = service.create(
    "tenant-a",
    "user",
    input,
    "one",
    "corr",
  ).asset;
  assert.throws(() => service.get("tenant-b", created.id));
  assert.equal(
    (
      await app.request("/v1/uploads", {
        method: "POST",
        headers: { ...headers, "x-role": "VIEWER" },
        body: JSON.stringify(input),
      })
    ).status,
    403,
  );
  service.recordPart("tenant-a", created.id, 1, "b".repeat(64));
  service.recordPart("tenant-a", created.id, 2, "b".repeat(64));
  assert.throws(() =>
    service.complete("tenant-a", "user", created.id, "c".repeat(64), "corr"),
  );
});
