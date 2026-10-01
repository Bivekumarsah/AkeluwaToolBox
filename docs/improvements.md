# Website improvements

The opening screen uses a custom paper-and-ink design: warm backgrounds, forest-green accents, serif display typography, and local SVG illustrations. The PDF editor, PDF reducer, converter, and background-removal workspaces share this palette.

- Replaced repetitive promotional sections with a concise introduction, useful tool entry points, and an expandable privacy FAQ.
- Removed self-assigned ratings, browser visit counters, and tool usage tracking.
- Added direct links to merge, extraction, and image conversion panels.
- Added a keyboard skip link, visible focus states, accessible file inputs, active navigation indicators, and reduced-motion support.
- Added a matching favicon and updated the web manifest and Vercel asset routes.
- Documented browser processing, external library/model downloads, session clearing, and the limits of PDF overlay editing.

## Validation

Checked the landing page and tool navigation in Chrome at desktop and mobile sizes. The layouts fit without horizontal overflow, and tool links select the intended panel.

Smoke checks passed for PDF editing/export, merging two two-page PDFs, extracting one page, image-to-PDF conversion, JPG image conversion, and PDF-to-PNG export. Background-remover image selection and preview passed; the AI model itself was not rerun for this visual update.

## Hosting follow-up

The canonical URL, Open Graph URL, robots file, and sitemap still reference localhost. Set them to the production domain when that domain is available.

## PDF reducer integration — October 1, 2026

- Completed the standalone Django application with settings, upload handling, CSRF protection, isolated compression workers, cleanup, and a 120-second timeout.
- Added text-preserving image optimization and optional visual compression with three quality passes. The smallest candidate is retained and a larger replacement is never returned.
- Added a matching toolbox workspace with drag/drop, a first-page preview, 5–90% targets, presets, progress, cancellation, actual savings, and automatic/manual downloads.
- Added a browser engine so static/Vercel deployments can compress PDFs without uploads. Local launchers use the PyMuPDF engine on the same computer.
- Updated Windows and Linux/macOS launchers to create/repair the environment, avoid unnecessary reinstallations, and open the browser after the service starts.
- Preserved the older compression API and updated privacy/deployment documentation for both processing modes.

Validation: all 16 backend tests passed. Ten Chrome smoke-check groups passed with no JavaScript errors, covering standalone/local/browser compression, text/link/form retention, rotated pages, invalid and encrypted files, page limits, cancellation, stale-result clearing, editor export, PDF merging, and layouts at 375/768/1024/1440 pixels. Browser visual compression reduced a generated 2.4 MB two-page scan by more than 75% without any upload. Reproducible checks are in `tests/browser_smoke.py`; screenshots and metrics are under `.preview/reducer/`.

## Supplied logo and favicon — October 1, 2026

- Added the supplied forest-green wordmark to the header and the supplied circuit icon as the PNG favicon, touch icon, and manifest icon.
- Balanced the palette around forest-green buttons/headings, small blue navigation/conversion accents, and pale backgrounds. Focus indicators now use the same blue accent.
- Added the image routes for Vercel and the local service. The standalone PDF reducer uses the same branding assets as the website.

Verified both static and local asset responses against the original images, all tool navigation, and desktop/tablet/mobile layouts without horizontal overflow or JavaScript errors. Screenshots and the verification report are in `.preview/branding/`.

## Software Hub homepage preview — October 1, 2026

Replaced the fictional Studio North document illustration with a static preview of the user's local Akeluwa Software Hub website. The preview follows the supplied screenshot: dark background, “Many Roots. One Digital future.” headline, blue brand symbol, and signal illustration. It uses local HTML/SVG and has a caption identifying the main website.

Verified local and static hosting, tool navigation, and responsive layouts from 320 to 1440 pixels with no horizontal overflow or JavaScript errors. Preview screenshots are under `.preview/software-hub/`.

## Photo size reducer — October 1, 2026

Added a dedicated **Compress photo** navigation entry and home card. The workspace provides JPG/PNG/WebP input and output, target sizes in KB with presets, width/quality controls, original/result previews, actual size changes, cancellation, and downloads. Quality is adjusted before dimensions to fit a target; PNG preserves transparency and uses resizing to reduce size. Phone-photo orientation is retained, transparent JPEG output is composited onto white, and unsupported export formats report an error.

Photo processing stays in the browser for both local and static hosting. Added the JavaScript asset to local and Vercel routes and adjusted navigation wrapping for the extra tool.

Validation: all 12 photo browser check groups passed with no JavaScript errors. A generated 4,696,036-byte test image was reduced to 102,129 bytes (97.8% smaller) at a 100 KB target on both local and static hosting. Checks cover format/download validity, transparency, PNG targets, rotation, invalid inputs/options, clearing stale results, cancellation, tool navigation, and layouts from 320 to 1440 pixels. Reproducible checks are in `tests/photo_smoke.py`; screenshots and results are under `.preview/photo/`.

## Directory cleanup

Moved the local PDF engine from `pdf-size-reducer-ready/pdf-size-reducer/` into `website/pdf-reducer/`. Grouped browser styles, scripts, and display images under `website/assets/`. Original branding and this development history now live under `docs/`.

Removed the unused legacy `compressor` module and duplicated branding. Its API remains supported and its three checks were moved into the active test suite. Updated launchers, asset routes, smoke checks, and documentation. Static builds publish only public website files to `dist/`, keeping the local Python service out of hosted output.

Validation after cleanup: all 16 backend tests, 10 PDF browser check groups, and 12 photo browser check groups passed. Local and static hosting produced valid downloads with no browser JavaScript errors. Static asset links, manifest icons, shared branding, and the deployment file whitelist were checked. Generated test artifacts and build output were removed after verification.

## Vercel build directory compatibility

Reproduced the missing build script error when the build command runs with `website/` as its working directory. Added a website-local build entry point and Vercel configuration while retaining the repository-root command. Both configurations publish only browser files to their own `dist/` directory. The shared build implementation lives inside `website/`, so website-root deployments do not need files from outside their selected root.
