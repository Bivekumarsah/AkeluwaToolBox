// Copy only browser source into the company project, which can then build independently.
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { pages } from '../website/assets/js/seo.js';

const source = fileURLToPath(new URL('../website/', import.meta.url));
const target = fileURLToPath(new URL('../AKELUWA-SH-Full-Stack/toolbox/', import.meta.url));
await mkdir(join(target, 'scripts'), { recursive: true });
for (const name of ['index.html', 'assets', 'site.webmanifest', 'googlefb3975d72926d897.html']) {
  await cp(join(source, name), join(target, name), { recursive: true });
}
await cp(join(source, 'scripts/build-static.mjs'), join(target, 'scripts/build-static.mjs'));
await writeFile(join(target, 'routes.json'), JSON.stringify(pages.map(({ path, tool }) => ({ path, tool })), null, 2) + '\n');
console.log('Company toolbox browser source synchronized.');
