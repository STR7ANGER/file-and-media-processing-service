# ADR 0001: Upload, storage, and tenant boundaries

The Next.js catalog talks only to the Hono control API. PostgreSQL owns asset lifecycle, quota, policy, versions, and audit envelopes. MongoDB stores bounded probe/scan metadata, Redis carries expendable jobs, and S3-compatible storage holds source and derivative bytes. Every object key begins with its tenant and stays under `quarantine/` until promotion.

The smallest slice authenticates a tenant API key, validates media type and declared size, creates an idempotent asset, returns checksum-bound 15-minute multipart URLs, records parts, verifies the final checksum, and emits one versioned scan event. Viewers cannot mutate; cross-tenant IDs look missing. Default quota is 5 GB and source uploads are capped at 500 MB.

Signed URLs and API keys never appear in logs. Audit records include tenant, actor, action, asset, correlation ID, and time. PostgreSQL is authoritative if object storage or queues disagree.
