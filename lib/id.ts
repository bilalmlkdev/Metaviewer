export function generateId(): string {
  // Use Node.js crypto module if available (server-side)
  try {
    const nodeCrypto = require("crypto");
    return nodeCrypto.randomUUID().replace(/-/g, "").slice(0, 12);
  } catch {
    // not available
  }
  // Use Web Crypto API if available (browser or modern Node)
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    const arr = new Uint8Array(6);
    globalThis.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Last resort fallback (less entropy but functional)
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
