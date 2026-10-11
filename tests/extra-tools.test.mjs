import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const catalog=JSON.parse(await readFile(join(root,'website/extra-tools/catalog.json'),'utf8'));
const read=p=>readFile(join(root,p),'utf8');
const expected=['photo-signature-resizer','pdf-to-word','pdf-esign-watermark','ocr-text-extractor','unicode-preeti','resume-builder','image-format-converter','qr-code-generator','pdf-page-numbers','bulk-image-compressor'];
test('Ten unique functional standalone tool pages and SEO metadata',async()=>{
 assert.deepEqual(catalog.map(x=>x.slug),expected);
 const home=await read('website/index.html');
 for(const item of catalog){
  assert.ok(item.name && item.description.length>60);
  const html=await read('website/extra-tools/'+item.slug+'/index.html');
  assert.ok(html.includes('data-extra-tool="'+item.slug+'"'));
  assert.ok(html.includes('<form')||item.slug==='resume-builder');
  assert.ok(html.includes('<meta name="description"'));
  assert.ok(html.includes('__TOOLBOX_PUBLIC_ROOT__/extra-tools/'+item.slug+'/'));
  assert.ok(html.includes('src="../app.js" defer'));
  assert.ok(home.includes('href="/extra-tools/'+item.slug+'/"'));
 }
 assert.ok(home.includes('href="/extra-tools/"'));
});
test('Browser script covers all tools, uses local image/PDF processing and safe output',async()=>{
 const s=await read('website/extra-tools/app.js');
 for(const item of catalog)assert.ok(s.includes('"'+item.slug+'":'));
 for(const required of ['getTextContent','PDFDocument.load','toBlob','Tesseract','qrcode.min.js','window.print','new Blob([body,directory,end]','openImage(file)','file.arrayBuffer()']) assert.ok(s.includes(required),required);
 assert.ok(!s.includes('fetch('));
 assert.ok(!s.includes('XMLHttpRequest'));
 assert.ok(!s.includes('eval('));
});
test('Static build creates 21 SEO URLs with correct canonical and asset paths',async()=>{
 execFileSync('node',['scripts/build-static.mjs'],{cwd:root,env:{...process.env,SITE_URL:'https://demo.example.org',SITE_BASE_PATH:''},stdio:'pipe'});
 const sitemap=await read('dist/sitemap.xml');
 for(const {slug} of catalog){
  const path='extra-tools/'+slug+'/index.html';
  const page=await read('dist/'+path);
  assert.ok(page.includes('href="https://demo.example.org/extra-tools/'+slug+'/'));
  assert.ok(!page.includes('__TOOLBOX_PUBLIC_ROOT__'));
  assert.ok(page.includes('href="../../assets/images/favicon.png"'));
  assert.ok(sitemap.includes('https://demo.example.org/extra-tools/'+slug+'/'));
 }
 assert.equal((sitemap.match(/<loc>/g)||[]).length,21);
 assert.ok((await stat(join(root,'dist/extra-tools/app.js'))).isFile());
});
test('Nested company base path changes new canonical links safely',async()=>{
 execFileSync('node',['scripts/build-static.mjs'],{cwd:root,env:{...process.env,SITE_URL:'https://company.example.org',SITE_BASE_PATH:'/akeluwatoolbox'},stdio:'pipe'});
 const page=await read('dist/extra-tools/pdf-to-word/index.html');
 const sitemap=await read('dist/sitemap.xml');
 assert.ok(page.includes('href="https://company.example.org/akeluwatoolbox/extra-tools/pdf-to-word/"'));
 assert.ok(sitemap.includes('https://company.example.org/akeluwatoolbox/extra-tools/pdf-to-word/'));
 assert.ok(page.includes('src="../../assets/vendor/pdfjs/pdf.min.js"'));
});
