# SEO and the website domain

The current primary address is **https://akeluwatoolbox-website.vercel.app/**. A custom domain is not required to start indexing the site. Search visibility depends on useful pages, reliable tools, crawlability, links, and competition; this setup does not guarantee rankings.

## What the project provides

The static build creates the homepage and nine tool pages. Each has an individual title, description, canonical URL, social sharing metadata, structured data, instructions, questions, and related links. The selected tool and its guide are visible in the built HTML before JavaScript runs. Browser navigation preserves open tool state and updates the URL, metadata, and guide; browser Back and reload are supported.

Page definitions and copy live in `website/assets/js/seo.js`. The build uses this same data to create `sitemap.xml` and `robots.txt`. Both supported Vercel roots publish only the generated browser site. Unknown paths return 404 instead of being rewritten to the homepage. Old `?tool=` entry points redirect to the corresponding tool page on Vercel. Vercel preview builds include `noindex` and discourage crawling.

## Start Google Search Console

1. Add a **URL-prefix property** for `https://akeluwatoolbox-website.vercel.app/` in [Google Search Console](https://search.google.com/search-console).
2. Verify ownership using a supported method. If using an HTML verification tag, provide the exact tag so it can be added to the source head and retained by the build. Do not share a Google password.
3. Submit `https://akeluwatoolbox-website.vercel.app/sitemap.xml`.
4. Inspect the homepage and important tool pages using URL Inspection. Run the live test and request indexing after checking the result.
5. Monitor indexed pages, impressions, queries, and clicks. Indexing requests do not guarantee indexing or a particular ranking.

Search Console ownership and submissions are actions in the owner's Google account. They are not completed automatically by a website build. No analytics or tracking script has been added.

## Later: use a custom domain

1. Add the domain to the same Vercel project and configure its DNS. Confirm HTTPS and the existing tool paths work on that domain.
2. In the Vercel project's **Production** environment variables, set `SITE_URL` to the new HTTPS origin, such as `https://tools.example.org`. Use only the origin, with no path or query. Rebuild/deploy. The build replaces every page's canonical, schema, sharing URL, and sitemap address together.
3. Configure permanent server redirects (301 or 308) from the old domain to the matching paths on the new domain. Keep those redirects available; do not send every tool URL to the new homepage.
4. Verify the new site in Search Console, submit its sitemap, and use Change of Address for the old property when eligible. Check redirected URLs and monitor indexing during the move.

The default origin is in `website/assets/js/seo.js`; `SITE_URL` overrides it for a deployment. Changing the domain preserves the tool paths. Do not set `SITE_URL` to a temporary preview URL. A domain move can temporarily affect search visibility.

## Maintain useful content

Keep guides accurate when tool capabilities change. Add original examples and troubleshooting information that answer real user questions. Use natural titles and descriptions; do not create repetitive pages just to repeat keywords or invent ratings/reviews. Test mobile speed and actual downloads as the tools evolve.

References: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [URL Inspection](https://support.google.com/webmasters/answer/9012289), [site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
