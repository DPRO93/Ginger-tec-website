# Rebuilding the pages

Every `.html` file in the site root is generated from `tools/build-site.js`,
which holds the shared header, footer, metadata and the copy for each page.
Edit the script, then run:

    node tools/build-site.js

from the site folder. It rewrites the pages and `sitemap.xml`. Nothing else
is needed: no packages, no build tools, just Node.

Styles live in `assets/site.css` and behaviour in `assets/site.js`; those are
edited directly.
