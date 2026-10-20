import path from 'node:path';
import { unlink } from 'node:fs/promises';
import { config } from '../config.js';

// Uploads are always saved by the server as `<uuid>.pdf` or `<uuid>.epub`;
// nothing coming from the database is ever written to disk unvalidated.
const STORED_FILE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|epub)$/i;

export function isStoredFileName(value) {
  return STORED_FILE_PATTERN.test(value);
}

// Delete a previously stored upload. The allowlist rejects any name that the
// server did not generate, and the containment check guarantees the resolved
// path stays inside the uploads directory.
export async function removeStoredFile(storedName) {
  if (!isStoredFileName(storedName)) {
    return false;
  }
  const uploadsRoot = path.resolve(config.upload.dir);
  const absolutePath = path.resolve(uploadsRoot, storedName);
  if (!absolutePath.startsWith(uploadsRoot + path.sep)) {
    return false;
  }
  await unlink(absolutePath).catch(() => false);
  return true;
}
