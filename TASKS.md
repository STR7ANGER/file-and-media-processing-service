# File and Media Processing Service — 30-Task Execution Plan

Complete tasks in order unless a dependency is explicitly removed. Each day has 10 active tasks; unfinished work rolls forward before later tasks begin. Keep at most 10 task checkboxes marked `[~]` (in progress) at once; use `[x]` only after verification.

## Day 1 — Foundation and first vertical slice (Tasks 1–10)

- [ ] 1. Design workspace, object storage, Docker, CI, media policy, and job contracts; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 2. Implement workspace, object storage, Docker, CI, media policy, and job contracts; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 3. Verify workspace, object storage, Docker, CI, media policy, and job contracts with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 4. Design tenants, API keys, assets, access policies, quotas, and audit events; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 5. Implement tenants, API keys, assets, access policies, quotas, and audit events; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 6. Verify tenants, API keys, assets, access policies, quotas, and audit events with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 7. Design presigned/resumable upload flow, checksum verification, and size/type limits; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 8. Implement presigned/resumable upload flow, checksum verification, and size/type limits; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 9. Verify presigned/resumable upload flow, checksum verification, and size/type limits with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 10. Design scan adapter, quarantine states, metadata extraction, and safe promotion; write acceptance criteria, contracts, risks, and the smallest vertical slice.

## Day 2 — Core workflows and integrations (Tasks 11–20)

- [ ] 11. Implement scan adapter, quarantine states, metadata extraction, and safe promotion; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 12. Verify scan adapter, quarantine states, metadata extraction, and safe promotion with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 13. Design Rust image transformations, presets, deterministic keys, and derivative cache; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 14. Implement Rust image transformations, presets, deterministic keys, and derivative cache; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 15. Verify Rust image transformations, presets, deterministic keys, and derivative cache with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 16. Design video probe/transcode/thumbnail pipeline, resource limits, and cancellation; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 17. Implement video probe/transcode/thumbnail pipeline, resource limits, and cancellation; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 18. Verify video probe/transcode/thumbnail pipeline, resource limits, and cancellation with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 19. Design signed delivery URLs, authorization, range requests, CDN boundary, and expiry; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 20. Implement signed delivery URLs, authorization, range requests, CDN boundary, and expiry; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.

## Day 3 — Advanced behavior and production hardening (Tasks 21–30)

- [ ] 21. Verify signed delivery URLs, authorization, range requests, CDN boundary, and expiry with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 22. Design versioning, deletion, retention, storage lifecycle, and orphan cleanup; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 23. Implement versioning, deletion, retention, storage lifecycle, and orphan cleanup; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 24. Verify versioning, deletion, retention, storage lifecycle, and orphan cleanup with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 25. Design asset console, GraphQL search, job progress, webhooks, metrics, and billing usage; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 26. Implement asset console, GraphQL search, job progress, webhooks, metrics, and billing usage; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 27. Verify asset console, GraphQL search, job progress, webhooks, metrics, and billing usage with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 28. Design malicious-file/load/E2E tests, SDK examples, API docs, and operations runbook; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 29. Implement malicious-file/load/E2E tests, SDK examples, API docs, and operations runbook; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 30. Verify malicious-file/load/E2E tests, SDK examples, API docs, and operations runbook with tests, failure cases, telemetry, documentation, and a reviewable demo.

## Task completion checklist

A task is complete only when code is formatted and typed, tests pass, migrations are reproducible, UI states are handled, authorization is enforced, logs contain no secrets, and relevant docs are updated. Track blockers beneath the task instead of silently widening scope.

