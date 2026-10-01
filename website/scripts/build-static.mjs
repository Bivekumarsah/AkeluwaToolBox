// Publish only browser files, keeping the local Python service out of dist/.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';

const source = fileURLToPath(new URL('../', import.meta.url));
const websiteOutput = resolve(source, 'dist');
const repositoryOutput = resolve(source, '..', 'dist');
const publicFiles = ['index.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest'];

export async function buildStatic(outputUrl = new URL('../dist/', import.meta.url)) {
  const output = resolve(fileURLToPath(outputUrl));
  // Validate the absolute target before deleting generated output.
  if (output !== websiteOutput && output !== repositoryOutput) {
    throw new Error('Build output must be the website or repository dist directory.');
  }
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const name of publicFiles) {
    await cp(join(source, name), join(output, name));
  }
  await cp(join(source, 'assets'), join(output, 'assets'), { recursive: true });
  console.log(`Static website built in ${output}: ${(await readdir(output)).join(', ')}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await buildStatic();
}
