# Akeluwa ToolBox

A private toolbox for PDF editing, PDF and photo size reduction, conversion, merging, page extraction, image tools, and AI background removal.

The header uses the supplied Forest Green AkeluwaToolBox logo, and the browser icon uses the supplied circuit favicon. Website colors combine forest green, restrained blue accents, and pale neutral backgrounds. Display assets live in `website/assets/images/`; the supplied original images are preserved in `docs/branding/`. Both the toolbox and standalone PDF page use the same display assets.

The homepage hero includes a static preview of the local Akeluwa Software Hub website, recreated from the supplied screenshot with its dark design, headline, and signal illustration.

## Project folders

```text
AkeluwaToolBox/
|-- website/
|   |-- index.html                 # Main toolbox page and navigation
|   |-- assets/
|   |   |-- css/                   # Website styles
|   |   |-- js/                    # Browser PDF and photo reducers
|   |   `-- images/                # Display logo and favicon
|   |-- pdf-reducer/               # Local Python PDF service
|   |   |-- pdf_reducer/           # Compression engine, API, and tests
|   |   |-- templates/             # Standalone PDF page
|   |   `-- run_windows.bat        # Standalone launcher
|   |-- scripts/build-static.mjs   # Shared build and website-root entry point
|   |-- vercel.json                # Website-root deployment configuration
|   `-- site.webmanifest, robots.txt, sitemap.xml
|-- scripts/build-static.mjs       # Creates the public dist/ website
|-- tests/                         # Browser checks
|-- docs/                          # Development notes and original branding
|-- start-windows.bat              # Launch the whole toolbox locally
|-- start-linux-mac.sh
|-- vercel.json                    # Static hosting configuration
`-- README.md
```

The PDF reducer is part of the website: its browser code is in `website/assets/js/pdf-reducer.js`, and its optional local engine is in `website/pdf-reducer/`. There is no separate `pdf-size-reducer-ready/` folder.

Generated folders (`.preview/`, `dist/`, `.venv/`, and `__pycache__/`) are ignored by Git. You can delete `.preview/` and `dist/`; the checks/build recreate them. Deleting the service's `.venv/` causes dependencies to reinstall on the next launch. Keep `.git/` for version history.

## Run on Windows

1. Double-click `start-windows.bat` in this folder.
2. On first launch, wait for the local Python environment and dependencies to install.
3. The toolbox opens at `http://127.0.0.1:8096`.
4. Choose **Compress PDF**, **Compress photo**, or another tool from the navigation or home page.
5. Keep the launcher window open while using the local service. Press Ctrl+C to stop.

Python 3.10 or newer is required. Enable **Add Python to PATH** during installation. Setup repairs an incomplete environment and skips package installation when the required versions are already present. If port 8096 is busy, close the previous toolbox server before launching again.

On Linux/macOS, run `sh start-linux-mac.sh` from this folder.

## PDF size reducer

- Choose or drag in a PDF, preview the first page, and select a 5-90% reduction target.
- **Preserve text** keeps selectable text, links, and forms. The local engine also recompresses embedded images. Browser-only optimization is gentle and may provide little reduction for scans.
- **Visual compression** recreates pages as JPEG images, trying successively lower resolutions and quality until the target is reached or all three passes finish. Text selection, links, forms, and accessibility tags are lost in flattened output.
- See original size, result size, actual savings, and whether the target was reached. Download automatically or use the download button.
- The smallest candidate is kept; a larger replacement is never returned. If nothing is smaller, the download contains the original PDF.
- Limits: 60 MB, 200 pages. Password-protected PDFs must be unlocked first. Keep originals of signed PDFs because compression can invalidate signatures.
- Browser compression can be cancelled. Cancelling a local request stops waiting in the browser; its worker can continue until completion or the 120-second timeout, after which its temporary files are removed.

The local PDF service and standalone page live in `website/pdf-reducer`. Run its `run_windows.bat` to open the standalone interface at `http://127.0.0.1:8000/reducer/`.

## Photo size reducer

Open **Compress photo** or the **Photo size reducer** home card. Choose or drag in a JPG, PNG, or WebP image, then select a target file size (100/200/500 KB presets), maximum width, quality, and output format. Leave the target empty to use your chosen width and quality directly.

The reducer searches for a quality that fits the target and lowers dimensions when needed, retaining the image proportions. It reports whether the target was reached, original/result sizes, actual size change, output dimensions, and encoding quality. Compare the previews and download the finished photo. Cancellation and clearing are supported.

JPG composites transparent areas onto white. WebP and PNG retain transparency. PNG compression is lossless; its quality slider is disabled, and a size target can reduce dimensions. Phone-photo orientation is respected. Input limits are 30 MB and 40 million pixels; maximum width is 100–4096 pixels, and very large outputs are capped at 8 million pixels. Small photos are never enlarged. Animated images are treated as still images.

Photos are processed entirely in the browser with both local and static hosting. A target is not guaranteed for every image, and changing formats can increase file size; the result displays the actual size change. The original file remains on your device.

## Privacy and hosting

On the hosted/static site, files are processed in the user's browser. The PDF reducer never sends files to a cloud service. When the local launcher is used, compression runs through a same-origin Python service bound to `127.0.0.1`. It processes each PDF in an isolated worker with a timeout and removes temporary input/output files after each request. There is no database or saved upload history.

The PDF libraries and AI background-removal model load from CDNs, so initial use needs internet access. Other toolbox tools continue to run in the browser with either hosting mode.

For Vercel, use either the **repository root** (blank Root Directory) or **`website`** as the Root Directory. Both contain a `vercel.json` and a `scripts/build-static.mjs` entry point. Select **Other** for the framework preset, use **`node scripts/build-static.mjs`** for the build command, and **`dist`** for the output directory. Each build creates `dist/` inside its selected root; there is no dependency installation step.

The build copies only the browser website and assets, excluding the Python service, environments, build scripts, documentation, and tests. The hosted site uses browser compression; Vercel does not run Django. Redeploy the latest `main` commit after updating these settings.

If Node reports `MODULE_NOT_FOUND` with an empty `requireStack`, check the missing file path near the top of the deployment log and the deployed commit. The build command is resolved from the selected Root Directory. Both supported roots now include the script, so a deployment of an older commit can still report the old missing-path error.

For a static preview, install Node.js and run these commands from the project root:

```powershell
node scripts/build-static.mjs
py -m http.server 8096 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:8096`. Rebuild after changing website files. `dist/` is generated and excluded from Git.

The local Django launcher is for personal use on this computer. It is not configured as a public upload service.

## Included tools

- PDF editor: replace selectable text, add text, and place logos/photos on PDFs.
- PDF size reducer: preserve text or compress scans visually, with measured savings.
- Photo size reducer: target a file size in KB, adjust quality and width, compare previews, and export JPG/PNG/WebP.
- Converter: PDF to PNG, images to PDF, image conversion/resizing, PDF merging, and selected-page extraction.
- AI background remover: transparent PNG output from PNG/JPG/WebP images.

## SEO and custom domains

The current primary URL is `https://akeluwatoolbox-website.vercel.app/`. Builds create individual HTML pages for the core tools, including `/compress-pdf/` and `/compress-photo/`, with descriptive metadata, guides, shared branding, and a generated sitemap. Tool navigation uses crawlable links and supports browser Back and reload.

Page definitions are in `website/assets/js/seo.js`. Later, set the Vercel Production environment variable `SITE_URL` to your new HTTPS domain and redeploy to update all generated SEO URLs. Configure matching permanent redirects and update Search Console when moving domains. Setup and migration steps are in [docs/seo.md](docs/seo.md).

## Validation

From `website/pdf-reducer`:

```powershell
.venv\Scripts\python.exe manage.py test
```

For browser smoke checks, install the optional development requirements and run from the toolbox root. The checks require Node.js and an existing Chrome installation. They build the static site and start/stop their own test servers:

```powershell
website\pdf-reducer\.venv\Scripts\python.exe -m pip install -r website\pdf-reducer\requirements-dev.txt
website\pdf-reducer\.venv\Scripts\python.exe tests\browser_smoke.py
```

Generated test fixtures, results, screenshots, and the browser report are saved under `.preview/reducer/`.

Photo reducer checks run with the same environment:

```powershell
website\pdf-reducer\.venv\Scripts\python.exe tests\photo_smoke.py
```

These checks cover local/static hosting, target sizes, valid downloads, transparency, phone-photo orientation, invalid inputs, cancellation, and responsive layouts. Artifacts are saved under `.preview/photo/`.

SEO, page navigation, and custom-domain checks:

```powershell
website\pdf-reducer\.venv\Scripts\python.exe tests\seo_smoke.py
```

These checks inspect all generated pages, sitemap entries, static content without JavaScript, mobile layouts, Back/reload behavior, domain overrides, preview indexing rules, and invalid domain configuration. Artifacts are saved under `.preview/seo/`.
