#!/usr/bin/env node
/**
 * Make a .webp twin for every JPEG under assets/photos and assets/svc.
 * build-site.js turns any <img> whose JPEG has a twin into a <picture>.
 *
 *   node tools/webp.js            (needs `sharp`; see tools/README.md)
 *
 * Re-run after adding photos. Existing twins are only rewritten when the
 * JPEG is newer than the WebP, so this is safe to run every time.
 */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch {
  // the static site has no node_modules; borrow the app's copy when it is beside us
  try { sharp = require(path.join(__dirname, '..', '..', 'solwezi-connect', 'node_modules', 'sharp')); }
  catch { console.error('sharp not found. Run `npm i sharp` here, or keep solwezi-connect next to this folder.'); process.exit(1); }
}

const ROOT = path.join(__dirname, '..');
const dirs = ['assets/photos', 'assets/photos/work', 'assets/svc'];
(async () => {
  let made = 0, kept = 0, before = 0, after = 0;
  for (const d of dirs) {
    const full = path.join(ROOT, d);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full)) {
      if (!/\.jpe?g$/i.test(f)) continue;
      const src = path.join(full, f), out = src.replace(/\.jpe?g$/i, '.webp');
      before += fs.statSync(src).size;
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { kept++; after += fs.statSync(out).size; continue; }
      await sharp(src).webp({ quality: 78, effort: 5 }).toFile(out);
      after += fs.statSync(out).size; made++;
    }
  }
  console.log(`webp: ${made} made, ${kept} up to date. JPEG ${(before / 1024).toFixed(0)} KB -> WebP ${(after / 1024).toFixed(0)} KB`);
})();
