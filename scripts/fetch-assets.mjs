#!/usr/bin/env node
/**
 * Downloads the Lovable Assets referenced by src/assets/*.asset.json into the
 * folder the production server serves statically (public/ by default), so a
 * container running outside Lovable's hosting still shows the site's photos.
 *
 * Usage: node scripts/fetch-assets.mjs [--out public]
 * Env:   ASSET_BASE — where to download from
 *        (default https://autoescolavital.lovable.app)
 */
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.env.ASSET_BASE || "https://autoescolavital.lovable.app").replace(/\/+$/, "");

const outFlag = process.argv.indexOf("--out");
const outDir = resolve(root, outFlag > -1 ? process.argv[outFlag + 1] : "public");

const assetsDir = join(root, "src", "assets");
const pointers = (await readdir(assetsDir)).filter((f) => f.endsWith(".asset.json")).sort();

let fetched = 0;
let reused = 0;
let failed = 0;

for (const pointer of pointers) {
  let asset;
  try {
    asset = JSON.parse(await readFile(join(assetsDir, pointer), "utf8"));
  } catch (err) {
    console.error(`x ${pointer}: ${err.message}`);
    failed++;
    continue;
  }

  const url = asset.url;
  if (typeof url !== "string" || !url.startsWith("/")) {
    console.error(`x ${pointer}: no usable "url" field`);
    failed++;
    continue;
  }

  const dest = join(outDir, url);
  const expected = Number(asset.size) || 0;
  const existing = await stat(dest).catch(() => null);
  if (existing && existing.size === expected) {
    reused++;
    continue;
  }

  try {
    const res = await fetch(base + url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (expected && buf.length !== expected) {
      throw new Error(`size mismatch: got ${buf.length}, expected ${expected}`);
    }
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    fetched++;
    console.log(`ok ${url} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`x ${url}: ${err.message}`);
    failed++;
  }
}

console.log(`assets: ${fetched} downloaded, ${reused} already present, ${failed} failed`);
if (failed) process.exit(1);
