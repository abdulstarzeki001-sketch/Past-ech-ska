# NAFSAM — Celestial Archive Design System

## Architecture

The cinematic redesign is implemented on `main` without replacing the private content manifest or the existing auth, routes, media and playback logic.

- `artifacts/nafsam/src/styles/cinematic.css`: design tokens, midnight aurora, editorial layouts, responsive grids, glass surfaces, keyboard focus, reduced-motion rules.
- `artifacts/nafsam/src/styles/tailwind.css`: Tailwind v4 utilities (no destructive preflight reset).
- `artifacts/nafsam/src/pages/Home.tsx`: cinematic home hero, real existing content and translations, responsive memory collection and countdown.
- `artifacts/nafsam/src/components/Navbar.tsx`: desktop horizontal header, mobile fixed 7-tab dock, chat and sign-out actions.
- `artifacts/nafsam/src/components/CinematicAtmosphere.tsx`: layered CSS aurora and desktop-only pointer-following light.
- `artifacts/nafsam/src/components/CosmicHeroArt.tsx`: static CSS orbital sculpture fallback, lazy WebGL capability gate.
- `artifacts/nafsam/src/components/CosmicOrb.tsx`: defer-loaded React Three Fiber celestial sculpture, capped DPR, no postprocessing.
- `artifacts/nafsam/src/hooks/useCinematicScroll.ts`: GSAP + ScrollTrigger deferred on desktop, uses reduced-motion and fallback rules.
- `artifacts/nafsam/src/main.tsx` / `App.tsx`: global theme and atmosphere.
- `artifacts/nafsam/src/styles/luxe-*.css` and `src/index.css`: prior page-specific selectors remain in place, overridden through the new theme to preserve gallery, viewer, chapters and writings behavior.

## Mobile/performance policy

- 320 / 620 / 960 / 1180px progressive breakpoints.
- iPhone/touch: CSS-only orbit; WebGL disabled to protect memory and battery.
- Desktop: WebGL instantiated after initial paint if available, no reduced-motion and no data saver.
- WebGL DPR capped at 1.5 with low-power context; mesh/light/particle geometry intentionally limited.
- 7 navigation tabs visible at 320px and above; fixed dock respects safe-area insets.
- Animations respect `prefers-reduced-motion`, are disabled for large hover/touch transformations, and expensive ScrollTrigger is desktop-only.
- Photos and videos retain lazy thumbnails, incremental loading and lightbox logic.

## Private content is untouched

The original `content.json`, image files, captions, audio and videos stay in the existing archive host defined in `.env.cloudflare-pages`. This commit only redesigns the presentation.

## Build/deployment

Build command: `pnpm run build:cloudflare`
Output: `artifacts/nafsam/dist/public`
Production branch: `main`

See `.github/workflows/cloudflare-build.yml` for automated build validation and `.github/workflows/update-pnpm-lock.yml` for synchronized new dependencies.

Check final `Build Cloudflare Pages release` logs, `/home` after sign-in, `/photos`, `/writings`, `/videos`, `/telegram-call/`, and Safari portrait/safe-area behavior. Test real private content only with an authorized session.

## Security note

Visual gate and remote-media URLs are not cryptographic privacy controls. The full server-authenticated media migration remains separate security work; avoid copying private content or credentials into public source.
