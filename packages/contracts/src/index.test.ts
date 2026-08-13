import assert from "node:assert/strict";
import test from "node:test";
import { createUploadSchema } from "./index.js";
test("accepts bounded supported media", () =>
  assert.equal(
    createUploadSchema.safeParse({
      fileName: "hero.webp",
      mediaType: "image/webp",
      bytes: 1024,
      checksum: "a".repeat(64),
    }).success,
    true,
  ));
test("rejects executables, excessive size, and invalid checksums", () =>
  assert.equal(
    createUploadSchema.safeParse({
      fileName: "bad.exe",
      mediaType: "application/octet-stream",
      bytes: 600_000_000,
      checksum: "bad",
    }).success,
    false,
  ));
