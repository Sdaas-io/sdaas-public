export interface SigningKey {
  key_id: string;
  algorithm: string;
  public_key_pem: string;
  status: "active" | "revoked";
  created_at?: string;
}

export interface SigningKeysResponse {
  keys: SigningKey[];
  issuer: string;
  documentation?: string;
}

export interface VerifyStatusResponse {
  cert_id: string;
  verified: boolean;
  status: string | null;
  signature_verified: boolean | null;
  alg: string | null;
  key_id: string | null;
  checked_at: string;
}
