/**
 * 浏览器端密钥生成（无需请求面板接口）。
 * - Reality：Web Crypto X25519 + short_id
 * - Sudoku：Ed25519 标量 master 密钥（与后端 SudokuKey 一致）
 * - ECH：X25519 + draft-ietf-tls-esni-18 PEM
 */

import { ed25519, x25519 } from "@noble/curves/ed25519.js";

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function pemBody(label: string, payload: Uint8Array): string {
  const b64 = bytesToBase64(payload);
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

function u16be(n: number): Uint8Array {
  return new Uint8Array([(n >> 8) & 0xff, n & 0xff]);
}

function u8(n: number): Uint8Array {
  return new Uint8Array([n & 0xff]);
}

/** PKCS8 末尾 32 字节为 X25519 私钥标量（OID 1.3.101.110 结构固定） */
function extractX25519PrivateKey(pkcs8: ArrayBuffer): Uint8Array {
  const bytes = new Uint8Array(pkcs8);
  if (bytes.length < 32) {
    throw new Error("invalid X25519 PKCS8 length");
  }
  return bytes.slice(bytes.length - 32);
}

export interface RealityKeyPair {
  public_key: string;
  private_key: string;
  /** 16 位 hex（8 字节），Xray shortIds 允许 0–16 位 */
  short_id: string;
}

/**
 * 生成 Reality X25519 密钥对 + short_id。
 * 编码：base64.RawURLEncoding（与 Xray / Clash.Meta 一致）。
 */
export async function generateRealityKeyPair(): Promise<RealityKeyPair> {
  // 优先 Web Crypto；不可用时回退 noble x25519
  if (globalThis.crypto?.subtle?.generateKey) {
    try {
      const keyPair = (await crypto.subtle.generateKey(
        { name: "X25519" } as AlgorithmIdentifier,
        true,
        ["deriveBits"],
      )) as CryptoKeyPair;

      const publicRaw = new Uint8Array(
        await crypto.subtle.exportKey("raw", keyPair.publicKey),
      );
      if (publicRaw.length !== 32) {
        throw new Error(
          `unexpected X25519 public key length: ${publicRaw.length}`,
        );
      }

      const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const privateRaw = extractX25519PrivateKey(pkcs8);
      const shortId = bytesToHex(crypto.getRandomValues(new Uint8Array(8)));

      return {
        public_key: bytesToBase64Url(publicRaw),
        private_key: bytesToBase64Url(privateRaw),
        short_id: shortId,
      };
    } catch {
      // fall through to noble
    }
  }

  const privateRaw = x25519.utils.randomSecretKey();
  const publicRaw = x25519.getPublicKey(privateRaw);
  return {
    public_key: bytesToBase64Url(publicRaw),
    private_key: bytesToBase64Url(privateRaw),
    short_id: bytesToHex(crypto.getRandomValues(new Uint8Array(8))),
  };
}

export interface SudokuMasterKeyPair {
  master_public_key: string;
  master_private_key: string;
}

/**
 * Sudoku Master 密钥：与后端 SudokuKey::generateMasterKeyPair 一致。
 * - private: reduce(64 random bytes) 的 32-byte 标量（hex）
 * - public:  P = x·B 压缩 Edwards 点（hex）
 * 不做 clamp（标量已是 canonical）。
 */
export function generateSudokuMasterKeyPair(): SudokuMasterKeyPair {
  const Fn = ed25519.Point.Fn;
  const seed = crypto.getRandomValues(new Uint8Array(64));
  // little-endian 64-byte integer mod L
  let x = 0n;
  for (let i = 63; i >= 0; i--) {
    x = (x << 8n) + BigInt(seed[i]!);
  }
  const scalar = Fn.create(x);
  const scalarBytes = Fn.toBytes(scalar);
  const publicBytes = ed25519.Point.BASE.multiply(scalar).toBytes();

  return {
    master_private_key: bytesToHex(scalarBytes),
    master_public_key: bytesToHex(publicBytes),
  };
}

export interface EchKeyPair {
  /** PEM: -----BEGIN ECH KEYS----- */
  key: string;
  /** PEM: -----BEGIN ECH CONFIGS----- */
  config: string;
}

/**
 * 生成 ECH 密钥/配置 PEM（draft-ietf-tls-esni-18），与后端 ManageController::generateEchKey 一致。
 */
export function generateEchKeyPair(
  publicName = "ech.example.com",
): EchKeyPair {
  const name = publicName.trim() || "ech.example.com";
  if (name.length < 1 || name.length > 253) {
    throw new Error("public_name must be a valid domain (1-253 bytes)");
  }

  // 与 PHP random_bytes(32) + scalarmult_base 对齐：用 x25519 标准密钥生成
  const privateKey = x25519.utils.randomSecretKey();
  const publicKey = x25519.getPublicKey(privateKey);
  const configId = crypto.getRandomValues(new Uint8Array(1))[0]!;

  // ECHConfigContents
  const nameBytes = new TextEncoder().encode(name);
  const contents = concatBytes(
    u8(configId), // config_id
    u16be(0x0020), // kem_id: DHKEM(X25519)
    u16be(32),
    publicKey, // public_key length-prefixed
    u16be(8), // cipher_suites byte length
    u16be(0x0001),
    u16be(0x0001), // HKDF-SHA256 + AES-128-GCM
    u16be(0x0001),
    u16be(0x0003), // HKDF-SHA256 + ChaCha20Poly1305
    u8(0), // max_name_length
    u8(nameBytes.length),
    nameBytes,
    u16be(0), // extensions empty
  );

  // ECHConfig = version(2) + length(2) + contents
  const echConfig = concatBytes(u16be(0xfe0d), u16be(contents.length), contents);
  // ECHConfigList = total_length(2) + configs
  const echConfigList = concatBytes(u16be(echConfig.length), echConfig);
  // ECH Keys = private_key_len(2) + key(32) + config_len(2) + config
  const echKeysPayload = concatBytes(
    u16be(32),
    privateKey,
    u16be(echConfig.length),
    echConfig,
  );

  return {
    key: pemBody("ECH KEYS", echKeysPayload),
    config: pemBody("ECH CONFIGS", echConfigList),
  };
}
