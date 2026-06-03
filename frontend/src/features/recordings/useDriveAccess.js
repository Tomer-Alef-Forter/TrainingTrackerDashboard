import { useEffect, useState } from "react";

/**
 * Extract a Google Drive file ID from a recording URL.
 * Handles `…/file/d/{ID}/view…` and `…/open?id={ID}` (and bare `?id=`/`&id=`).
 * Returns null for non-Drive URLs.
 */
export function extractDriveFileId(url) {
  if (!url || typeof url !== "string") return null;
  if (!/drive\.google\.com/.test(url)) return null;
  const path = url.match(/\/file\/d\/([^/?#]+)/);
  if (path) return path[1];
  const query = url.match(/[?&]id=([^&]+)/);
  if (query) return query[1];
  return null;
}

// status: "unknown" | "checking" | "accessible" | "denied"
const PROBE_TIMEOUT_MS = 8000;
const STORAGE_PREFIX = "driveAccess:";

const cache = new Map(); // fileId -> resolved status
const inflight = new Map(); // fileId -> Promise<status>

function readSessionCache(fileId) {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + fileId) || null;
  } catch {
    return null;
  }
}

function writeSessionCache(fileId, status) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + fileId, status);
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

/**
 * Probe whether the current browser session can access a Drive file by loading
 * its thumbnail in an <img>. Loads (onload) => "accessible"; errors (onerror) =>
 * "denied"; times out => "unknown". Results are cached per file ID (memory +
 * sessionStorage) and concurrent probes for the same ID are deduped.
 */
function probeDriveAccess(fileId) {
  if (cache.has(fileId)) return Promise.resolve(cache.get(fileId));

  const stored = readSessionCache(fileId);
  if (stored) {
    cache.set(fileId, stored);
    return Promise.resolve(stored);
  }

  if (inflight.has(fileId)) return inflight.get(fileId);

  const promise = new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const finish = (status) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      img.onload = img.onerror = null;
      // Only persist confident outcomes; "unknown" stays re-checkable.
      if (status !== "unknown") {
        cache.set(fileId, status);
        writeSessionCache(fileId, status);
      }
      inflight.delete(fileId);
      resolve(status);
    };

    const timer = setTimeout(() => finish("unknown"), PROBE_TIMEOUT_MS);
    img.onload = () => finish("accessible");
    img.onerror = () => finish("denied");
    // Small thumbnail; default account. Sends the viewer's Google cookies.
    img.referrerPolicy = "no-referrer";
    img.src = `https://drive.google.com/thumbnail?id=${encodeURIComponent(
      fileId
    )}&sz=w16&authuser=0`;
  });

  inflight.set(fileId, promise);
  return promise;
}

/**
 * React hook: returns the access status for a recording URL.
 * Non-Drive or empty URLs resolve to "unknown" (caller shows no indicator).
 */
export function useDriveAccess(url) {
  const fileId = extractDriveFileId(url);
  const [status, setStatus] = useState(() =>
    fileId ? cache.get(fileId) || "checking" : "unknown"
  );

  useEffect(() => {
    if (!fileId) {
      setStatus("unknown");
      return;
    }
    let active = true;
    const cached = cache.get(fileId);
    setStatus(cached || "checking");
    if (!cached) {
      probeDriveAccess(fileId).then((s) => {
        if (active) setStatus(s);
      });
    }
    return () => {
      active = false;
    };
  }, [fileId]);

  return status;
}
