# AI Image Generation Studio

A feature-rich AI image generation studio UI built in React — prompt-based generation workspace with style presets, aspect-ratio controls, gallery management, favorites, and image filtering. Everything runs client-side as a demo interface (generation actions are simulated in the demo).

Original Claude artifact preview: https://claude.ai/public/artifacts/6997798c-156d-41f5-b7cf-6b86652d6709

## Features

- **Generation workspace** — prompt + negative prompt inputs, CFG scale slider, seed control, image count selector
- **Style presets** — 16 styles: Photorealistic, Anime, Digital Art, Concept Art, Watercolor, Abstract, Cyberpunk, Fantasy, Oil Painting, Pixel Art, Surreal, Minimalist, Vintage, Neon, Gothic, Steampunk
- **Aspect ratios** — Square (1:1), Landscape (16:9), Portrait (9:16), Classic (4:3), Photo (3:4) with dimension labels
- **Style mixing** — mix multiple styles with per-style weights
- **Image-to-image** — upload a reference image with denoise-strength control
- **Gallery** — browse, search, and filter generated images (All / Favorites), favorite/unfavorite, select, delete, archive
- **Prompt assistant** — built-in helper panel for writing better prompts
- **Dark mode** — dark UI with light/dark toggle
- **Jest test suite** — covers gallery filtering behavior

## Tech Stack

- React 19 + TypeScript
- Lucide icons (`lucide-react`)
- Tailwind CSS utility classes (via CDN in the demo build)
- Vite (demo wrapper)
- Jest + React Testing Library (tests)

## Quick Start

```bash
npm install --legacy-peer-deps
npm run build        # outputs dist/
npx vite preview     # preview the production build locally
```

Or run the tests:

```bash
npm test
```

## Project Structure

```
├── aethercanvas-app.tsx        # The studio UI component (entry)
├── aethercanvas-app.test.tsx   # Jest tests for gallery filtering
├── __mocks__/styleMock.js      # Mock images/styles for tests
├── index.html                  # Demo page entry (Vite)
├── src/main.tsx                # React mount point
├── vite.config.ts              # Vite build config
├── babel.config.js / jest.config.js  # Test toolchain
└── package.json
```

## Deploy

The demo is a static Vite build — any static host works (Cloudflare Pages, Netlify, GitHub Pages):

```bash
npm run build
# serve dist/
```

## Notes

- Generation is simulated client-side; wire the Generate action to a real image-generation API (e.g. Replicate, Stability) to make it live.
- Component uses Tailwind utility classes; the demo loads Tailwind via CDN — for production, install Tailwind properly in your bundler pipeline.

---

Built by Girish Lade — https://ladestack.in
