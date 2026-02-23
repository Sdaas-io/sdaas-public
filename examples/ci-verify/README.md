# CI/CD Verification Example

Verify SDAAS.io certificates in a GitHub Actions pipeline before using synthetic datasets.

## Why this matters

Compliance teams need to prove that synthetic data used in staging and testing environments
is properly certified — not accidentally sourced from production. Adding certificate verification
to your CI pipeline creates an automated, auditable proof that the right dataset was used.

## Quick start

1. Purchase a SDAAS.io certificate for your synthetic dataset
2. Add the cert ID to GitHub Secrets: `SDAAS_CERT_ID`
3. Copy `verify-synthetic-data.yml` to your repo at `.github/workflows/`

## Verification script

`verify.mjs` is a **self-contained Node.js script** with zero npm dependencies (uses built-in `crypto`).

It:
1. Fetches the manifest envelope from `sdaas.io/api/cert/:id/manifest`
2. Fetches the current public keys from `sdaas.io/.well-known/signing-keys.json`
3. Verifies the Ed25519 signature locally
4. Exits 0 on success, 1 on any failure

```bash
SDAAS_CERT_ID=<your-cert-id> node verify.mjs
```

## Pinning the signing key

For maximum security, pin the expected `key_id`:

```bash
SDAAS_CERT_ID=<your-cert-id> SDAAS_EXPECTED_KEY_ID=ed25519-prod-2025-02 node verify.mjs
```

If SDAAS rotates to a new key, the CI will fail until you explicitly update the expected key ID —
giving you visibility into key changes.

## Sample output

```
[sdaas-verify] cert_id : a1b2c3d4-...
[sdaas-verify] base_url: https://sdaas.io
[sdaas-verify] alg    : Ed25519
[sdaas-verify] key_id : ed25519-prod-2025-02
[sdaas-verify] ✓ VERIFIED — cert_id=a1b2c3d4-... key_id=ed25519-prod-2025-02
```

## Using with @sdaas/sdk

If you prefer the full SDK with TypeScript types, see the commented-out Option B
in `verify-synthetic-data.yml`.
