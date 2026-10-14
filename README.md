# Past-ech-ska

موقع Nafsam للأرشيف والمحادثات — React + Vite + pnpm monorepo.

## Cloudflare Pages (production branch: `main`)

The site is built from **`main`**. Configure the **past-ech-ska** Cloudflare Pages project as follows:

| Cloudflare field | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | `/` (repository root) |
| Build command | `pnpm run build:cloudflare` |
| Build output directory | `artifacts/nafsam/dist/public` |
| `NODE_VERSION` | `24` |
| `PNPM_VERSION` | `9.15.9` |

Every commit to `main` runs the [Cloudflare build validation workflow](.github/workflows/cloudflare-build.yml), which checks that the site and chat SPA entrypoints are present. This workflow **validates** a release; it does not automatically deploy to Cloudflare unless the Pages project is connected to GitHub with production branch `main`.

Cloudflare production links (only when the deployment is healthy):

- Website: https://past-ech-ska.pages.dev/
- Photos: https://past-ech-ska.pages.dev/photos
- Writings: https://past-ech-ska.pages.dev/writings
- Chat: https://past-ech-ska.pages.dev/telegram-call/

## Content and private media

The committed file `artifacts/nafsam/.env.cloudflare-pages` points `VITE_R2_BASE` to the **existing external Cloudflare Pages archive**. The website reads `content.json` (photos index, writings and translations) and then loads photos and media from that same archive endpoint. These source media **are not stored in this repository** and must not be copied into a public Git repository to fix missing photos.

**Do not reconfigure or redeploy the original `ech-nafasm-ska` project using a Git-only build.** Its previous media (~2 GB) were uploaded as part of a manual Pages deployment; rebuilding the original project from source without restaging these assets could make them disappear.

The monitor UI is intentionally not bundled into the public Pages deployment. If its route is protected using Cloudflare Access, set `INCLUDE_MONITOR=true` at build time to include `/monitor/`; never serve the visitor analytics monitor publicly without access controls.

## Diagnosing errors

- **522 on `*.pages.dev`** means Cloudflare couldn't complete the origin connection. It is not a React image-resolution error. Inspect the project status and **Deployments** in Cloudflare. A passing GitHub Actions build does **not** prove that the Cloudflare-hosted release is responding.
- **Blank photos and writings with a healthy homepage:** verify that `VITE_R2_BASE` is correct at build time, and that `<base>/content.json` and `<base>/images/...` return HTTP 200. Rebuild after any config changes.
- **Broken deep links:** Cloudflare needs the `_redirects` file in the published output. Do not add a `404.html` to this Cloudflare Pages build.
- **Persistent old version on iPhone/iPad:** restart the browser, and review the service worker's cached release after deployment.

**Security:** the current browser-side static word gate is not adequate protection for private media, and the chat app contains client-side test login credentials. Rotate any active exposed accounts and complete a server-authenticated media/auth migration before treating this deployment as private.

## Branch policy

- All new code fixes go to **`main`**.
- In GitHub: **Settings → General → Default branch → `main`** (requires repository admin).
- In Cloudflare: **Workers & Pages → past-ech-ska → Settings → Builds & deployments → Production branch → `main`** (location may vary in the UI).
- Previous experimental branches are left untouched for history and recovery.
