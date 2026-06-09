import { Digest } from "../types/issue.js";

export function formatJson(digest: Digest): string {
  return `${JSON.stringify(digest, null, 2)}\n`;
}
