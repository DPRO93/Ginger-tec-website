# Updating the site

Every `.html` file in the site root is generated. Do not edit them by hand;
the next build overwrites them. Edit the content, then rebuild:

    node tools/build-site.js

from the site folder. No packages, no build tools, just Node. Then commit
and push; GitHub Pages republishes within a few minutes.

## Where things live

| Want to change            | Edit                          |
|---------------------------|-------------------------------|
| Phone, WhatsApp, email, hours, social links | `content/site.json` |
| Services and their bullet lists             | `content/services.json` |
| Projects (and replacing illustrative images with real ones) | `content/projects.json` |
| Industries on the Solutions page            | `content/industries.json` |
| Testimonials (real, permitted quotes only)  | `content/testimonials.json` |
| Page copy, section order, headlines         | `tools/build-site.js` |
| Photographs                                 | `assets/photos/` (people), `assets/svc/` (equipment) |
| Styles / behaviour                          | `assets/site.css`, `assets/site.js` |

## Rules baked in

- A project stays labelled **Illustrative image** until `illustrative` is
  set to `false` in `content/projects.json` and a real photograph is used.
- Testimonials render as placeholders until `placeholder` is `false`.
- Social icons appear only for entries in `site.json` that have a URL.
- Set `claims.yearsOperating` to `null` to remove the years claim everywhere.
- Forms fall back to the visitor's email app or WhatsApp until a Formspree
  endpoint is set in `assets/site.js` (`FORM_ENDPOINT`).

## Images

Photos are JPEG with a WebP twin beside them (`assets/photos/x.jpg` + `x.webp`).
`node tools/webp.js` makes or refreshes the twins (it borrows `sharp` from the
`solwezi-connect` folder next door if this folder has no `node_modules`), and
`build-site.js` wraps any `<img>` whose JPEG has a twin in a `<picture>` with a
WebP source. Add a photo → run `webp.js` → run `build-site.js`.
