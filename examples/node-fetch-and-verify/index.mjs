/**
 * Example: Fetch a SDAAS certificate manifest from the live API
 * and independently verify the Ed25519 signature.
 *
 * Usage:
 *   SDAAS_CERT_ID=<cert-id> node index.mjs
 *
 * Optional env vars:
 *   SDAAS_BASE_URL  — defaults to https://sdaas.io
 */

import { SdaasClient } from "@sdaas/sdk";

const certId = process.env.SDAAS_CERT_ID;
const baseUrl = process.env.SDAAS_BASE_URL ?? "https://sdaas.io";

if (!certId) {
  console.error("Error: set SDAAS_CERT_ID environment variable");
  console.error("  Example: SDAAS_CERT_ID=<your-cert-id> node index.mjs");
  process.exit(1);
}

const client = new SdaasClient(baseUrl);

console.log(`\nCert ID : ${certId}`);
console.log(`Base URL: ${baseUrl}\n`);

// Fetch manifest + signing keys, then verify locally
const { manifest, result } = await client.fetchAndVerify(certId);

console.log("Certificate:");
console.log(`  type      : ${manifest.payload.certificate_type}`);
console.log(`  issued_at : ${manifest.payload.issued_at}`);
console.log(`  issuer    : ${manifest.payload.issuer?.name}`);
console.log(`  dataset   : ${manifest.payload.subject?.dataset_name ?? "(none)"}`);
console.log(`  key_id    : ${manifest.signature.key_id}`);
console.log(`  alg       : ${manifest.signature.alg}`);
console.log();
console.log("Verification:", result);

if (!result.verified) {
  process.exit(1);
}
