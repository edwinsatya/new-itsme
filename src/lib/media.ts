import fs from "node:fs";
import path from "node:path";

/**
 * Server-only helper: returns the public path when the file actually exists,
 * otherwise null so components render their designed fallback without ever
 * firing a 404. Drop real files into /public/media and rebuild to swap them in.
 */
export function resolveMedia(publicPath: string | null): string | null {
  if (!publicPath) return null;
  try {
    const abs = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    return fs.existsSync(abs) ? publicPath : null;
  } catch {
    return null;
  }
}
