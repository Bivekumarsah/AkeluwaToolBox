// Safe, additive sync of shared Toolbox assets into the local company checkout.
// The company owns its homepage, routes, SEO and Digital Stamp Maker.
// Run after checking out the company's Git submodule next to this repository.
import { cp, mkdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const source = fileURLToPath(new URL('../website/', import.meta.url));
const target = fileURLToPath(new URL('../AKELUWA-SH-Full-Stack/toolbox/', import.meta.url));
const shared = [
  'assets/js/pdf-reducer.js',
  'assets/js/photo-reducer.js',
  'assets/js/tool-finder.mjs',
  'extra-tools/app.js',
  'extra-tools/style.css',
  'extra-tools/catalog.json',
];
const dryRun = process.argv.includes('--dry-run');
const companyHome = join(target, 'index.html');
try { await stat(companyHome); } catch {
  throw new Error('Company toolbox checkout missing. Initialize the company Git submodule before syncing.');
}
const home = await readFile(companyHome, 'utf8');
if (!home.includes('id="stampTool"') || !home.includes('href="/digital-stamp-maker/"')) {
  throw new Error('Company Digital Stamp Maker was not found; refusing to sync into an unexpected checkout.');
}
for (const file of shared) {
  const from = join(source, file), to = join(target, file);
  await stat(from);
  if (!dryRun) {
    await mkdir(dirname(to), {recursive:true});
    await cp(from, to);
  }
  console.log((dryRun ? '[dry run] ' : 'Synced ') + file);
}
const verify = await readFile(companyHome, 'utf8');
if (verify !== home) throw new Error('Company homepage changed unexpectedly during sync.');
console.log('Company homepage, stamp editor, country templates, routes and SEO definitions were not modified.');
console.log('Review homepage, navigation, CSS and SEO changes separately by pull request.');
