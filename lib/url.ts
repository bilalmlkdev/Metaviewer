export function isValidUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (/\s/.test(v)) return false;
  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProtocol);
    if (!u.hostname.includes(".")) return false;
    if (/\.\./.test(u.hostname)) return false;
    if (/^[\d.]+$/.test(u.hostname)) return false;
    return /^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(u.hostname + u.pathname);
  } catch {
    return false;
  }
}

export function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
