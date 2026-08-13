# ADR 0002: Scan, metadata, and safe promotion

Accepted for tasks 11–12. Completion moves an asset to `QUARANTINED` and emits `asset.scan.requested`. A scanner adapter streams bytes through malware detection without mounting the public bucket, validates magic bytes against the declared MIME type, and extracts bounded metadata: dimensions, duration, codecs, page count, and safe EXIF fields. It returns `CLEAN`, `INFECTED`, `MISMATCH`, or `ERROR` with a versioned engine signature.

Only `CLEAN` results can copy from the immutable quarantine key to `sources/{tenant}/{asset}/v{n}`. Promotion uses source checksum as a precondition, writes metadata transactionally with status `READY`, and deletes quarantine asynchronously after verification. Infected or mismatched content becomes `REJECTED` and remains inaccessible. Transient scanner errors retry three times with backoff, then dead-letter without promotion.

Acceptance requires signature/version capture, MIME-spoof fixtures, decompression-bomb limits, metadata redaction, idempotent promotion, tenant isolation, quarantine-only delivery denial, metrics, and recovery documentation.
