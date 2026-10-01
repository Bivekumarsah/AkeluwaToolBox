// Publish only the browser website; the local Python service stays in source.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'website');
const output = join(root, 'dist');
const publicFiles = ['index.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest'];

// This exact directory belongs to this build; never remove arbitrary paths.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of publicFiles) {
  await cp(join(source, name), join(output, name));
}
await cp(join(source, 'assets'), join(output, 'assets'), { recursive: true });
console.log(`Static website built in dist/: ${(await readdir(output)).join(', ')}`);
