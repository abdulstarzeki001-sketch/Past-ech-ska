/**
 * Build the static Cloudflare Pages release from the monorepo root.
 *
 * Cloudflare Pages setup:
 *   Production branch: main
 *   Root directory: /
 *   Build command: pnpm run build:cloudflare
 *   Build output directory: artifacts/nafsam/dist/public
 *
 * Private photos, videos and content.json remain on the existing archive
 * endpoint configured in artifacts/nafsam/.env.cloudflare-pages.
 * This script NEVER copies, exposes or deletes those private archive files.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function build(pkg, basePath) {
  console.log(`\n[Cloudflare Pages] Building ${pkg} for ${basePath}`);
  const result = spawnSync(pnpm, ["--filter", pkg, "run", "build"], {
    cwd: root,
    env: { ...process.env, CF_PAGES: "1", NODE_ENV: "production", BASE_PATH: basePath },
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Build failed for ${pkg} (exit ${result.status ?? "unknown"})`);
  }
}

function mustExist(path, purpose) {
  if (!existsSync(path)) throw new Error(`Missing ${purpose}: ${path}`);
}

build("@workspace/nafsam", "/");
build("@workspace/telegram-call", "/telegram-call/");

const dest = join(root, "artifacts/nafsam/dist/public");
const telegram = join(root, "artifacts/telegram-call/dist/public");
mustExist(join(dest, "index.html"), "main site HTML");
mustExist(join(telegram, "index.html"), "Telegram app HTML");
mustExist(join(dest, "_redirects"), "Cloudflare Pages SPA redirects");

mkdirSync(join(dest, "telegram-call"), { recursive: true });
cpSync(telegram, join(dest, "telegram-call"), { recursive: true, force: true });

if (process.env.INCLUDE_MONITOR === "true") {
  // Monitoring contains sensitive activity data. Publish it ONLY when its
  // Cloudflare path is independently protected (e.g., Cloudflare Access).
  build("@workspace/monitor", "/monitor/");
  const monitor = join(root, "artifacts/monitor/dist/public");
  mustExist(join(monitor, "index.html"), "monitor HTML");
  mkdirSync(join(dest, "monitor"), { recursive: true });
  cpSync(monitor, join(dest, "monitor"), { recursive: true, force: true });
}

if (existsSync(join(dest, "404.html"))) {
  throw new Error("Unexpected 404.html: Cloudflare Pages deep-link fallback can break. Remove it from public assets.");
}

const redirects = readFileSync(join(dest, "_redirects"), "utf8");
if (!redirects.includes("/telegram-call/index.html")) {
  throw new Error("Missing Telegram SPA rewrite in _redirects");
}

console.log("\n[Cloudflare Pages] Static deployment output ready:");
console.log("  artifacts/nafsam/dist/public");
console.log("  /                 → main site");
console.log("  /telegram-call/    → chat app");
console.log(process.env.INCLUDE_MONITOR === "true"
  ? "  /monitor/          → monitor (must be protected by Cloudflare Access)"
  : "  /monitor/          → not published (private by default)");
console.log("  Photos and writings → existing external archive endpoint");
