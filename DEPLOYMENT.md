# GitHub Pages

The site is fully static: Bible text, study dictionary, people, geography and timeline data are included in the build. It needs no server, database, account system or API key. Bookmarks and personal notes have been removed.

## Publish

1. Put this project in your GitHub repository's `main` branch, including `public/`, `src/`, `bun.lock` and `.github/workflows/deploy-pages.yml`. Do not upload `node_modules/`, `.tools/` or `test-results/`.
2. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` or run **Deploy Canon and Chronos to GitHub Pages** from Actions. The workflow builds `dist/` and deploys it. Its deployment output supplies the actual site URL.

Vite uses relative asset paths, so the same build works at `https://owner.github.io/repository/`, at a root domain, or under another static folder. No client-side path routes or server redirects are required. Reference navigation happens within the page.

## Static build or manual upload

Run `bun install --frozen-lockfile` and `bun run build`. Upload the **contents** of `dist/` to your static host. `dist/.nojekyll` is included. Open the site through HTTP(S), rather than double-clicking `index.html`, because browsers restrict local JSON requests through `file://`.

The ready-to-upload build is also packaged as `artifacts/canon-chronos-static.zip`. For GitHub Pages without a build workflow, extract that archive into a `gh-pages` branch and choose **Settings → Pages → Deploy from a branch → gh-pages → /(root)**. Do not upload only the ZIP itself; Pages needs its extracted contents.

Read aloud uses the browser/device speech engine. It selects a matching voice, prefers natural/enhanced voices when available, supports speed changes and pause/resume, and automatically continues through chapters and books until stopped or the Bible ends. Voice availability and quality vary by device; the site does not upload scripture to a custom speech server. Navigating away, changing the chapter edition or pressing Stop ends playback.

Map base tiles are served by OpenStreetMap and need internet access. Place lists, details, markers and timeline data are bundled. English definitions normally use the bundled WordNet dictionary; unknown words may try the public dictionary service. Failed external requests do not prevent reading or browsing the bundled content. Display and audio preferences are optional browser-local settings and continue to work when storage is blocked.

## Verify the built site

The browser suite accepts `PLAYWRIGHT_BASE_URL` for checking the compiled build at a repository subpath. Tests cover map sidebars, cross-navigation, synthetic speech lifecycle events, verse switching, meanings and bundled data. Real voice timbre must be checked on the target device.
