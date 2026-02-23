/**
 * Ed25519 signature verification using Node.js built-in crypto.
 * Accepts PEM-formatted public keys (as published at /.well-known/signing-keys.json).
 */
import crypto from "crypto";

function normalizePem(pem: string): string {
  // Restore newlines if stored with literal \n (common in env vars / JSON)
  return pem
    .replace(/\\n/g, "\n")
    .replace(/(-----BEGIN [A-Z ]+-----)\s+/g, "$1\n")
    .replace(/\s+(-----END [A-Z ]+-----)/g, "\n$1")
    .trim();
}

export function verifyEd25519Pem(opts: {
  payloadBytes: Buffer;
  signatureB64: string;
  publicKeyPem: string;
}): boolean {
  try {
    const key = crypto.createPublicKey(normalizePem(opts.publicKeyPem));
    if (key.asymmetricKeyType !== "ed25519") {
      throw new Error(
        `Expected Ed25519 public key, got ${key.asymmetricKeyType}. ` +
        "Fetch the correct key from /.well-known/signing-keys.json."
      );
    }
    const sig = Buffer.from(opts.signatureB64, "base64");
    return crypto.verify(null, opts.payloadBytes, key, sig);
  } catch (err) {
    throw new Error(`Ed25519 verification error: ${(err as Error).message}`);
  }
}
