import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL('../public/', import.meta.url), dist, { recursive: true });
// A portable review copy that opens without a web server or extra image files.
const source = new URL('../public/', import.meta.url);
let html = await readFile(new URL('index.html', source), 'utf8');
let css = await readFile(new URL('styles.css', source), 'utf8');
for (const filename of ['garden-hero.png', 'service-photos.png']) {
  const data = 'data:image/png;base64,' + (await readFile(new URL('assets/' + filename, source))).toString('base64');
  html = html.replaceAll('assets/' + filename, data);
  css = css.replaceAll('assets/' + filename, data);
}
const favicon = 'data:image/svg+xml;base64,' + (await readFile(new URL('favicon.svg', source))).toString('base64');
html = html.replace('favicon.svg', favicon)
  .replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
  .replace('<script src="main.js" defer></script>', '')
  .replace('</body>', `<script>${await readFile(new URL('main.js', source), 'utf8')}</script></body>`);
await writeFile(new URL('suzuyasu-denki.html', dist), html);
console.log('Built static website in dist/');
