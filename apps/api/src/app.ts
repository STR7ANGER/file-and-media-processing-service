import { randomUUID } from "node:crypto";
import { authSchema, createUploadSchema } from "@media/contracts";
import { Hono } from "hono";
import type { Context, Next } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { MediaError, MediaService } from "./media-service.js";
type Vars = {
  tenantId: string;
  actorId: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  correlationId: string;
};
export function createApp(service = new MediaService()) {
  const app = new Hono<{ Variables: Vars }>();
  app.onError((error, c) => {
    const status = (
      error instanceof MediaError ? error.status : 500
    ) as ContentfulStatusCode;
    return c.json(
      {
        code: error instanceof MediaError ? error.code : "INTERNAL_ERROR",
        correlationId: c.get("correlationId") ?? "unknown",
      },
      status,
    );
  });
  app.get("/health", (c) => c.json({ status: "ok", service: "media-api" }));
  app.use("/v1/*", auth);
  app.get("/v1/assets", (c) =>
    c.json({ items: service.list(c.get("tenantId")) }),
  );
  app.post("/v1/uploads", writer, async (c) => {
    const key = c.req.header("idempotency-key");
    if (!key) return c.json({ code: "IDEMPOTENCY_KEY_REQUIRED" }, 422);
    const parsed = createUploadSchema.safeParse(
      await c.req.json().catch(() => null),
    );
    if (!parsed.success)
      return c.json(
        { code: "VALIDATION_ERROR", details: parsed.error.flatten() },
        422,
      );
    return c.json(
      service.create(
        c.get("tenantId"),
        c.get("actorId"),
        parsed.data,
        key,
        c.get("correlationId"),
      ),
      201,
    );
  });
  app.put("/v1/uploads/:id/parts/:part", writer, async (c) =>
    c.json(
      service.recordPart(
        c.get("tenantId"),
        c.req.param("id")!,
        Number(c.req.param("part")),
        c.req.header("x-part-checksum") ?? "",
      ),
    ),
  );
  app.post("/v1/uploads/:id/complete", writer, async (c) =>
    c.json(
      service.complete(
        c.get("tenantId"),
        c.get("actorId"),
        c.req.param("id")!,
        ((await c.req.json()) as { checksum: string }).checksum,
        c.get("correlationId"),
      ),
    ),
  );
  return app;
}
async function auth(c: Context<{ Variables: Vars }>, next: Next) {
  const correlationId = c.req.header("x-correlation-id") ?? randomUUID();
  const parsed = authSchema.safeParse({
    tenantId: c.req.header("x-tenant-id"),
    actorId: c.req.header("x-actor-id"),
    apiKey: c.req.header("x-api-key"),
    role: c.req.header("x-role"),
  });
  if (!parsed.success)
    return c.json({ code: "UNAUTHENTICATED", correlationId }, 401);
  c.set("tenantId", parsed.data.tenantId);
  c.set("actorId", parsed.data.actorId);
  c.set("role", parsed.data.role);
  c.set("correlationId", correlationId);
  c.header("x-correlation-id", correlationId);
  await next();
}
async function writer(c: Context<{ Variables: Vars }>, next: Next) {
  if (c.get("role") === "VIEWER") return c.json({ code: "FORBIDDEN" }, 403);
  await next();
}
