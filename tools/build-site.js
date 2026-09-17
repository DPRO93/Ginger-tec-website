/* Builds every page of gingertecsolutions.store from the content files in
   /content and the shared shell below. Run: node tools/build-site.js
   Output is plain HTML in the site root. No packages needed. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'));

const SITE = read('site.json');
const SERVICES = read('services.json');
const PROJECTS = read('projects.json').projects;
const INDUSTRIES = read('industries.json');
const TESTIMONIALS = read('testimonials.json').testimonials;

const BASE = SITE.url, APP = SITE.marketplaceUrl, NAME = SITE.name, TAG = SITE.tagline;
const PHONE = SITE.phone, PHONE_RAW = SITE.phoneRaw, WA = SITE.whatsapp, WA_URL = SITE.whatsappUrl, EMAIL = SITE.email;
const YEARS = SITE.claims && SITE.claims.yearsOperating;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------------------------------------------------------------- icons
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"></path></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.6 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.2-.2-.3-.4-.4z"></path></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"></rect><path d="M3 7l9 6 9-6"></path></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10.2" r="2.8"></circle></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"></circle><path d="M12 7v5l3.5 2"></path></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"></path></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"></circle><path d="M12 6.5v11M9 9.5a3 3 0 0 1 3-1.5c1.7 0 3 .9 3 2s-1.3 2-3 2-3 .9-3 2 1.3 2 3 2a3 3 0 0 0 3-1.5"></path></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5l-9.6 9.6a2.1 2.1 0 0 1-3-3l9.6-9.6z"></path><path d="M14.7 6.3a4 4 0 1 1 5 5"></path></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
  connect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8"></path></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V14h2.8v8z"></path></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5zM4.8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM21 13.3c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9V8.5H9.9V21h3.4v-6.6c0-1.8.3-3.5 2.5-3.5 2.1 0 2.1 2 2.1 3.6V21H21z"></path></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"></circle></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.4 1.7 3.8 4 4v3.2c-1.5 0-2.9-.5-4-1.3v6.1a5.8 5.8 0 1 1-5-5.7v3.3a2.6 2.6 0 1 0 1.8 2.5V3z"></path></svg>',
};
const MARK = '<svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="currentColor"></rect><g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"><path d="M6.5 10.5a13 13 0 0 1 19 0"></path><path d="M10.5 15.5a8 8 0 0 1 11 0"></path><path d="M14 20.5a3.4 3.4 0 0 1 4 0"></path></g><circle cx="16" cy="25.5" r="2.1" fill="#fff"></circle></svg>';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231a56db'/%3E%3Cg fill='none' stroke='white' stroke-width='2.1' stroke-linecap='round'%3E%3Cpath d='M6.5 10.5a13 13 0 0 1 19 0'/%3E%3Cpath d='M10.5 15.5a8 8 0 0 1 11 0'/%3E%3Cpath d='M14 20.5a3.4 3.4 0 0 1 4 0'/%3E%3C/g%3E%3Ccircle cx='16' cy='25.5' r='2.1' fill='white'/%3E%3C/svg%3E";

const NAV = [
  ['index.html', 'Home'], ['services.html', 'Services'], ['solutions.html', 'Solutions'],
  ['projects.html', 'Projects'], ['about.html', 'About'], ['marketplace.html', 'Marketplace'], ['contact.html', 'Contact'],
];

// ---------------------------------------------------------------- buttons & blocks
const btnQuote = (cls = 'btn btn--primary', label = 'Get a free quote') => `<a class="${cls}" href="contact.html#assessment">${label}</a>`;
const btnWa = (label = 'Chat on WhatsApp', cls = 'btn btn--wa') => `<a class="${cls}" href="${WA_URL}" target="_blank" rel="noopener">${I.wa}${label}</a>`;

const cta = (h = 'Ready to get started?', p = 'Tell us what you need. We will give you a straight answer and a clear price.') => `
  <section class="sec cta">
    <div class="shell cta__in rv">
      <h2>${h}</h2>
      <p>${p}</p>
      <div class="cta__row">
        ${btnQuote()}
        ${btnWa('WhatsApp us')}
        <a class="btn btn--onDeep" href="tel:${PHONE_RAW}">Call now</a>
      </div>
    </div>
  </section>`;

const SERVICE_OPTIONS = ['Networking', 'CCTV', 'Starlink', 'IT Support', 'Computer Maintenance', 'Software', 'Website', 'Training', 'Other'];

// The quote / free-assessment form. One definition, used on home and contact.
const assessForm = (id) => `
          <form id="${id}" class="enquiry" data-subject="Free quote request" novalidate>
            <div class="frow">
              <label class="field"><span>Name<i class="req" aria-hidden="true">*</i></span>
                <input type="text" name="name" autocomplete="name" placeholder="Your full name" required></label>
              <label class="field"><span>Phone<i class="req" aria-hidden="true">*</i></span>
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+260 ..." required></label>
            </div>
            <div class="frow">
              <label class="field"><span>WhatsApp</span>
                <input type="tel" name="whatsapp" inputmode="tel" placeholder="Same as phone, or another number"></label>
              <label class="field"><span>Email</span>
                <input type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
            </div>
            <div class="frow">
              <label class="field"><span>Business / Organisation</span>
                <input type="text" name="organisation" autocomplete="organization" placeholder="Company, school, NGO, or 'home'"></label>
              <label class="field"><span>Location</span>
                <input type="text" name="location" placeholder="Area or town"></label>
            </div>
            <div class="frow frow--3">
              <label class="field"><span>Service required</span>
                <select name="service">
                  <option value="">Not sure yet</option>
                  ${SERVICE_OPTIONS.map((o) => `<option>${o}</option>`).join('')}
                </select></label>
              <label class="field"><span>Budget range</span>
                <select name="budget">
                  <option value="">Prefer not to say</option>
                  <option>Under K2,000</option>
                  <option>K2,000 to K10,000</option>
                  <option>K10,000 to K50,000</option>
                  <option>Over K50,000</option>
                  <option>Need advice first</option>
                </select></label>
              <label class="field"><span>Preferred date</span>
                <input type="date" name="preferredDate"></label>
            </div>
            <label class="field"><span>Description<i class="req" aria-hidden="true">*</i></span>
              <textarea name="message" placeholder="What are you trying to achieve? What is not working today? Where is the site?" required></textarea></label>
            <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
            <div class="frow frow--btns">
              <button class="btn btn--primary" type="submit">Request a free assessment</button>
              <button class="btn btn--wa" type="button" data-wa-send>${I.wa}Send it on WhatsApp instead</button>
            </div>
            <p class="fnote">No obligation. We reply the same working day, usually much sooner. Your details stay with us.</p>
            <p class="fstatus" role="status" aria-live="polite"></p>
          </form>`;

const WHY = [
  ['\u{1F1FF}\u{1F1F2}', 'Local Zambian Expertise', 'Solutions designed around local needs, by people based in Solwezi.'],
  ['⚡', 'Fast Response', 'Responsive technical support when you need it, on WhatsApp first.'],
  ['\u{1F4B0}', 'Affordable Solutions', 'Solutions designed around practical budgets, priced before work starts.'],
  ['\u{1F6E0}️', 'Professional Installation', 'Careful installation and configuration, labelled and documented.'],
  ['\u{1F512}', 'Security Focused', 'Reliable technology and security infrastructure, done properly.'],
  ['\u{1F91D}', 'Long-Term Support', 'We don’t disappear after installation.'],
];

// Marketplace categories, each pointing at the matching place in the app
const MK_CATS = [
  ['\u{1F4BC}', 'Jobs', '/jobs'], ['\u{1F9F9}', 'Cleaning', '/services'], ['\u{1F3E0}', 'Property', '/property'],
  ['\u{1F697}', 'Vehicles', '/vehicles'], ['\u{1F4E6}', 'Delivery', '/delivery'], ['\u{1F527}', 'Skilled Workers', '/services'],
  ['\u{1F6E0}️', 'General Work', '/jobs'], ['\u{1F469}\u{1F3FF}‍\u{1F373}', 'Maids & Helpers', '/services'], ['\u{1F3EA}', 'Businesses', '/businesses'],
];

const FAQ = [
  ['How fast do you actually respond?', 'We are based in Solwezi District, so a call goes to someone who can be on your site the same day. Our support line runs 24/7, and WhatsApp is the fastest way to reach us at any hour.'],
  ['Will there be hidden costs or travel charges?', 'No. You get the price before the work starts, and we do not bill travel time or mileage for jobs inside Solwezi District. If a job needs parts we did not expect, we tell you before we buy them.'],
  ['Do I have to sign a long contract?', 'No. You can call us for one job, take managed support monthly, or use part-time IT support as and when you need it. Nothing locks you in.'],
  ['Are you going to still be here next year?', YEARS ? `We have served businesses, schools, lodges and institutions in Solwezi District for ${YEARS} years. This is our home district, not a territory we visit.` : 'Solwezi District is our home, not a territory we visit. We are here because we live here.'],
  ['Can Starlink really work at a remote site?', 'Yes. Starlink is built for places the cable never reached, which is exactly why it suits remote and off-grid sites here. We handle the sale, the mounting, the power, and the setup, then we stay on call if anything drops.'],
];

// ---------------------------------------------------------------- shell
function shell({ file, title, desc, ogTitle, ogImage = 'assets/og.jpg', ogAlt, jsonld, body, extraHead = '', crumb }) {
  const url = BASE + (file === 'index.html' ? '' : file);
  const nav = NAV.map(([h, l]) => `<a href="${h}"${h === file ? ' aria-current="page"' : ''}>${l}</a>`).join('\n      ');
  const drawer = NAV.map(([h, l]) => `<li><a href="${h}"${h === file ? ' aria-current="page"' : ''}>${l}</a></li>`).join('\n        ');
  const ftrLinks = [['index.html', 'Home'], ['services.html', 'Services'], ['projects.html', 'Projects'], ['about.html', 'About'], ['marketplace.html', 'Marketplace'], ['contact.html', 'Contact'], ['privacy.html', 'Privacy Policy'], ['terms.html', 'Terms']]
    .map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('\n          ');

  const socials = Object.entries(SITE.social || {}).filter(([k, v]) => k !== '_readme' && v && I[k])
    .map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}">${I[k]}</a>`).join('\n          ');

  const graph = [];
  if (jsonld) graph.push(...(Array.isArray(jsonld) ? jsonld : [jsonld]));
  if (crumb) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
    { '@type': 'ListItem', position: 2, name: crumb, item: url },
  ] });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0b1220">
<link rel="canonical" href="${url}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${ogTitle || title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ogAlt || NAME + '. ' + TAG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle || title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${BASE}${ogImage}">

<link rel="icon" href="${FAVICON}">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/sora-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/plex-sans-var.woff2" crossorigin>
${extraHead}<link rel="stylesheet" href="assets/site.css">
${graph.length ? `<script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1)}\n</script>` : ''}
</head>
<body>

<a class="skip" href="#main">Skip to content</a>
<div class="env" aria-hidden="true"></div>

<div class="rail" aria-hidden="true">
  <span class="rail__track"></span>
  <span class="rail__fill"></span>
  <span class="rail__node" data-at="0.18" style="top:18%"></span>
  <span class="rail__node" data-at="0.42" style="top:42%"></span>
  <span class="rail__node" data-at="0.66" style="top:66%"></span>
  <span class="rail__node" data-at="0.88" style="top:88%"></span>
  <span class="rail__dot"></span>
</div>

<div class="page">

<header class="hdr">
  <div class="shell hdr__in">
    <a class="brand" href="index.html">
      ${MARK}
      <span class="brand__name">Ginger Tec <i>Solutions</i></span>
    </a>

    <nav class="nav" aria-label="Main">
      ${nav}
    </nav>

    <div class="hdr__cta">
      ${btnWa('WhatsApp', 'btn btn--wa btn--sm')}
      <a class="btn btn--primary btn--sm hdr__quote" href="contact.html#assessment">Get a free quote</a>
    </div>

    <a class="hdr__call hdr__call--wa" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Chat with ${NAME} on WhatsApp">${I.wa}</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span></button>
  </div>

  <div class="drawer" id="drawer">
    <div class="shell">
      <ul>
        ${drawer}
      </ul>
      <div class="drawer__cta">
        <a class="btn btn--primary" href="contact.html#assessment">Get a free quote</a>
        ${btnWa('WhatsApp us')}
        <a class="btn btn--ghost" href="tel:${PHONE_RAW}">Call ${PHONE}</a>
      </div>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">
${body}
</main>

<footer class="ftr">
  <div class="shell">
    <div class="ftr__grid">
      <div>
        <a class="ftr__brand" href="index.html">
          ${MARK}
          <span class="brand__name">Ginger Tec <i>Solutions</i></span>
        </a>
        <p class="ftr__tag">${TAG}</p>
        <p>A Zambian technology and innovation company in Solwezi District. IT support, networking, CCTV, Starlink, software, training, and the Solwezi Connect marketplace.</p>
        <div class="ftr__social" aria-label="Contact channels and social media">
          <a href="${WA_URL}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
          <a href="tel:${PHONE_RAW}" aria-label="Phone">${I.phone}</a>
          <a href="mailto:${EMAIL}" aria-label="Email">${I.mail}</a>
          <a href="${APP}" aria-label="Solwezi Connect">${I.connect}</a>
          ${socials}
        </div>
      </div>

      <div>
        <h3>Pages</h3>
        <ul>
          ${ftrLinks}
        </ul>
      </div>

      <div>
        <h3>Get in touch</h3>
        <ul>
          <li><a href="tel:${PHONE_RAW}">${I.phone}${PHONE}</a></li>
          <li><a href="${WA_URL}" target="_blank" rel="noopener">${I.wa}WhatsApp ${WA}</a></li>
          <li><a href="mailto:${EMAIL}">${I.mail}${EMAIL}</a></li>
          <li><a href="contact.html">${I.pin}${SITE.location}</a></li>
        </ul>
      </div>
    </div>

    <div class="ftr__base">
      <p>&copy; <span data-year>2026</span> ${NAME}. Solwezi District, Zambia.</p>
      <p>Serving Solwezi District and expanding across Zambia.</p>
    </div>
  </div>
</footer>

<a class="float" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
  ${I.wa}
  <span class="float__label">Chat on WhatsApp</span>
</a>

</div><!-- /.page -->

<script src="assets/site.js"></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- shared sections
const trustStrip = () => `
  <section class="trust" aria-label="Why people choose us">
    <div class="shell">
      <div class="trust__grid">
        <div class="trust__item"><span class="trust__ico">${I.pin}</span><div><h3>Local expertise</h3><p>Professional technology solutions designed for Zambia.</p></div></div>
        <div class="trust__item"><span class="trust__ico">${I.bolt}</span><div><h3>Fast support</h3><p>Responsive technical assistance for businesses and individuals.</p></div></div>
        <div class="trust__item"><span class="trust__ico">${I.coin}</span><div><h3>Affordable solutions</h3><p>Practical technology without unnecessary costs.</p></div></div>
        <div class="trust__item"><span class="trust__ico">${I.wrench}</span><div><h3>End-to-end service</h3><p>Installation, configuration, maintenance and support.</p></div></div>
      </div>
    </div>
  </section>`;

const serviceCards = () => `
      <div class="scards stag">
        ${SERVICES.filter((s) => s.homeCard !== false).map((s) => `<article class="scard">
          <div class="scard__art"><img src="${s.image}" alt="${esc(s.alt)}" loading="lazy" width="1200" height="750"></div>
          <div class="scard__body">
            <h3>${s.name}</h3>
            <ul>${s.items.map((p) => `<li>${p}</li>`).join('')}</ul>
            <a class="scard__link" href="services.html#${s.id}">More about ${s.name}</a>
          </div>
        </article>`).join('\n        ')}
      </div>`;

const whyBlocks = () => `
      <div class="why stag">
        ${WHY.map(([e, h, p]) => `<div class="why__item"><span class="why__e" aria-hidden="true">${e}</span><h3>${h}</h3><p>${p}</p></div>`).join('\n        ')}
      </div>`;

const industriesGrid = () => `
      <div class="inds stag">
        ${INDUSTRIES.map((d) => d.image
          ? `<a class="ind" href="solutions.html#${d.id}"><img src="${d.image}" alt="${esc(d.alt)}" loading="lazy" width="1200" height="900"><span class="ind__label">${d.name}<small>${d.tile}</small></span></a>`
          : `<a class="ind ind--flat" href="solutions.html#${d.id}"><span class="ind__ico" aria-hidden="true">${d.icon}</span><span class="ind__label">${d.name}<small>${d.tile}</small></span></a>`).join('\n        ')}
      </div>`;

const projectCards = (list = PROJECTS, full = false) => `
      <div class="projs stag">
        ${list.map((p) => `<article class="proj">
          <figure>
            <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy" width="1200" height="800">
            ${p.illustrative ? '<figcaption class="proj__illus">Illustrative image</figcaption>' : ''}
          </figure>
          <div class="proj__body">
            <span class="proj__type">${p.category}</span>
            <h3>${p.title}</h3>
            <dl>
              <dt>Location</dt><dd>${p.location}</dd>
              ${p.date ? `<dt>Date</dt><dd>${p.date}</dd>` : ''}
              ${full ? `<dt>Problem</dt><dd>${p.problem}</dd><dt>Solution</dt><dd>${p.solution}</dd><dt>Equipment</dt><dd>${p.equipment}</dd><dt>Result</dt><dd>${p.result}</dd>` : `<dt>Solution</dt><dd>${p.equipment}</dd>`}
            </dl>
            ${full ? '' : `<p>${p.solution}</p>`}
          </div>
        </article>`).join('\n        ')}
      </div>`;

const marketplaceBand = () => `
  <section class="sec connect-band" id="marketplace">
    <div class="shell">
      <div class="connect-band__in rv">
        <span class="connect-band__tag">${I.connect.replace('<svg', '<svg style="width:14px;height:14px"')} Now live</span>
        <h2>Solwezi <em>Connect</em></h2>
        <p class="connect-band__tagline">Find Services. Find Opportunities. Connect Locally.</p>
        <p class="connect-band__lede">Find local services, jobs and opportunities. Find a service. Find a worker. Find a vehicle. Find property. Find work. Post an opportunity. A digital marketplace connecting people, businesses and service providers across Solwezi, free to join.</p>
        <ul class="connect-band__grid connect-band__grid--links">
          ${MK_CATS.map(([e, t, p]) => `<li><a href="${APP}${p}"><span aria-hidden="true">${e}</span> ${t}</a></li>`).join('\n          ')}
        </ul>
        <div class="connect-band__row">
          <a class="btn connect-band__btn" href="${APP}">Explore marketplace</a>
          <a class="btn btn--onDeep" href="${APP}/post">Post a job</a>
        </div>
        <p class="connect-band__note">Built in Solwezi, for Solwezi, and built to grow across Zambia. <a href="marketplace.html">How it works</a>.</p>
      </div>
    </div>
  </section>`;

const faqSection = () => `
  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Straight answers</span>
        <h2 class="h2">The questions we get asked most</h2>
      </div>
      <div class="faq rv">
        ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p class="ans">${a}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const contactGrid = () => `
      <div class="cgrid stag">
        <a class="cg" href="${WA_URL}" target="_blank" rel="noopener"><span class="cg__k">WhatsApp</span><span class="cg__v">${WA}</span><span class="cg__s">Fastest reply, any hour</span></a>
        <a class="cg" href="tel:${PHONE_RAW}"><span class="cg__k">Phone</span><span class="cg__v">${PHONE}</span><span class="cg__s">Support line, 24/7</span></a>
        <a class="cg" href="mailto:${EMAIL}"><span class="cg__k">Email</span><span class="cg__v">${EMAIL}</span><span class="cg__s">Same working day</span></a>
        <div class="cg"><span class="cg__k">Location</span><span class="cg__v">${SITE.location}</span><span class="cg__s">Site visits by appointment</span></div>
        <div class="cg"><span class="cg__k">Business hours</span><span class="cg__v">${SITE.hours.support}</span><span class="cg__s">${SITE.hours.office}</span></div>
      </div>`;

const communitySection = () => `
  <section class="sec sec--deep" id="community">
    <div class="shell">
      <div class="feat feat--flip">
        <div class="rv">
          <span class="kicker">Community &amp; digital empowerment</span>
          <h2 class="h2">Technology Should Create Opportunity</h2>
          <p class="lede">The equipment is only half of it. The other half is people who can use it, fix it and build on it. That is why we teach, and why we built a marketplace.</p>
          <ul class="ticks">
            <li>Digital literacy</li><li>Youth empowerment</li><li>Women in technology</li><li>IT training</li><li>Community connectivity</li><li>Digital inclusion</li><li>Entrepreneurship</li>
          </ul>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/training.jpg" alt="Young Zambian adults at desktop computers in a whitewashed training room, one woman in a headwrap pointing at a classmate’s screen" loading="lazy" width="1003" height="752">
          <figcaption>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section class="sec give">
    <div class="shell give__in">
      <div class="rv">
        <span class="give__tag">Giving back</span>
        <h2>Free Basic IT Training <em>for Youth</em></h2>
        <p>We offer free foundational IT training to youth in our community, building job-ready skills and creating pathways into the tech sector.</p>
        <a class="btn give__btn" href="contact.html">Ask about the training</a>
      </div>
      <ul class="give__list stag">
        <li><span><b>Computer literacy</b>The everyday skills an employer expects on day one.</span></li>
        <li><span><b>Networking fundamentals</b>How the cables, switches and signals actually fit together.</span></li>
        <li><span><b>Internet safety</b>Staying safe online, and keeping an employer's data safe too.</span></li>
      </ul>
    </div>
  </section>`;

const testimonialsSection = () => `
  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">What customers say</span>
        <h2 class="h2">In their words</h2>
        <p class="lede">We only publish testimonials from real customers, in their own words, with their permission. This section fills as they come in.</p>
      </div>
      <!-- PLACEHOLDER CONTENT until content/testimonials.json holds real, permitted quotes. Never invent one. -->
      <div class="testis stag">
        ${TESTIMONIALS.map((t) => `<div class="testi${t.placeholder ? '' : ' testi--real'}"><span class="testi__mark" aria-hidden="true">&ldquo;</span><p>${esc(t.quote)}</p><div class="testi__who"><i aria-hidden="true"></i>${esc(t.who)}</div></div>`).join('\n        ')}
        <div class="testi testi--ask"><p><strong>Have we worked for you?</strong> Tell us what you thought, good or bad. If you are happy for us to publish it, it goes here with your name.</p>${btnWa('Send a testimonial', 'btn btn--wa btn--sm')}</div>
      </div>
    </div>
  </section>`;

const assessSection = (formId, points) => `
  <section class="sec sec--deep assess" id="assessment">
    <div class="shell">
      <div class="assess__grid">
        <div class="rv">
          <span class="kicker">Free technology assessment</span>
          <h2 class="h2">Not Sure What Technology You Need?</h2>
          <p class="lede">Tell us what you're trying to achieve. We'll help you identify the right technology solution for your home, business or organisation.</p>
          <ul class="assess__pts">${points.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="formwrap rv">
          ${assessForm(formId)}
        </div>
      </div>
    </div>
  </section>`;

const business = {
  '@type': 'ProfessionalService',
  '@id': BASE + '#business',
  name: NAME, url: BASE, image: BASE + 'assets/og-hero.jpg', logo: BASE + 'assets/og.jpg', slogan: TAG,
  description: 'Zambian technology and innovation company in Solwezi District providing IT support and managed IT services, network installation, LAN/WAN and Wi-Fi infrastructure, CCTV and security systems, Starlink and internet connectivity, computer hardware and maintenance, software and website development, and digital literacy and IT training.',
  telephone: PHONE_RAW, email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Solwezi', addressRegion: 'North-Western Province', addressCountry: 'ZM' },
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Solwezi District' }, { '@type': 'Country', name: 'Zambia' }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
  sameAs: [APP].concat(Object.entries(SITE.social || {}).filter(([k, v]) => k !== '_readme' && v).map(([, v]) => v)),
  knowsAbout: ['IT support', 'Managed IT services', 'Network installation', 'Wi-Fi installation', 'Structured cabling', 'CCTV installation', 'Starlink installation', 'Computer maintenance', 'Website development', 'Software development', 'IT training', 'Digital literacy'],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Technology services',
    itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.lede, url: BASE + 'services.html#' + s.id, areaServed: 'Solwezi District, Zambia' } })) },
};

// ---------------------------------------------------------------- pages
const pages = [];

pages.push({
  file: 'index.html',
  title: 'Ginger Tec Solutions | IT, Networking, CCTV & Starlink in Solwezi',
  desc: 'Zambian IT company in Solwezi: IT support, networking, Wi-Fi, CCTV, Starlink, software, websites and IT training. Technology that works, built for Zambia.',
  ogTitle: 'Ginger Tec Solutions | Technology That Works. Built for Zambia.',
  ogImage: 'assets/og-hero.jpg',
  extraHead: '<link rel="preload" as="image" href="assets/photos/hero-technician.webp" imagesrcset="assets/photos/hero-technician-m.webp 900w, assets/photos/hero-technician.webp 1344w" imagesizes="100vw" type="image/webp">\n',
  jsonld: [business, { '@type': 'WebSite', '@id': BASE + '#website', url: BASE, name: NAME, publisher: { '@id': BASE + '#business' }, inLanguage: 'en' }],
  body: `
  <!-- HERO -->
  <section class="hero2" aria-label="${NAME}">
    <div class="hero2__media">
      <img src="assets/photos/hero-technician.jpg" srcset="assets/photos/hero-technician-m.jpg 900w, assets/photos/hero-technician.jpg 1344w" sizes="100vw" width="1344" height="752" fetchpriority="high" alt="A Zambian network technician crouched at a wall-mounted cabinet, clipping a blue patch cable into a switch in the back room of a hardware shop in Solwezi">
    </div>
    <div class="hero2__scrim"></div>
    <div class="shell hero2__in">
      <span class="kicker">Solwezi District, Zambia</span>
      <h1>Technology That Works. <em>Built for Zambia.</em></h1>
      <p class="hero2__sub">Reliable IT, networking, security, connectivity and digital solutions for homes, businesses and communities.</p>
      <p class="hero2__sup">Based in Solwezi District, ${NAME} provides practical and affordable technology solutions designed around real Zambian needs.</p>
      <div class="hero2__row">
        ${btnQuote('btn btn--primary')}
        ${btnWa('Chat on WhatsApp')}
      </div>
      <div class="hero2__facts">
        <span>${I.pin}<b>Solwezi</b> based, Zambia wide</span>
        <span>${I.clock}<b>24/7</b> support line</span>
        <span>${I.phone}<b>${PHONE}</b></span>
      </div>
    </div>
  </section>

  ${trustStrip()}

  <!-- SERVICES -->
  <section class="sec" id="services">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">What we do</span>
        <h2 class="h2">Technology Solutions for Real-World Needs</h2>
        <p class="lede">Six things we do well, from the cable in the wall to the training that makes it useful. Every one comes with a clear price and someone to call afterwards.</p>
      </div>
      ${serviceCards()}
      <p class="projs__note rv">Also: Government e-services help for the ZamServices portal. <a href="services.html">See every service</a>.</p>
    </div>
  </section>

  <!-- WHY -->
  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Why Ginger Tec</span>
        <h2 class="h2">Why Choose Ginger Tec?</h2>
      </div>
      ${whyBlocks()}
    </div>
  </section>

  <!-- SOLUTIONS BY INDUSTRY -->
  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Solutions by industry</span>
        <h2 class="h2">Technology for Every Environment</h2>
        <p class="lede">Different buildings, the same problem: the work stops when the technology does. Tap one to see what we put in place.</p>
      </div>
      ${industriesGrid()}
    </div>
  </section>

  <!-- PROJECTS -->
  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Technology projects</span>
        <h2 class="h2">The kind of work we do</h2>
        <p class="lede">Six typical jobs, what they involve, and what you get at the end. Images marked illustrative are not photographs of our own work; real project photos replace them as clients give permission.</p>
      </div>
      ${projectCards()}
      <p class="rv" style="margin-top:28px"><a class="btn btn--onDeep" href="projects.html">Every project type in detail</a></p>
    </div>
  </section>

  ${marketplaceBand()}

  ${communitySection()}

  <!-- ABOUT -->
  <section class="sec">
    <div class="shell">
      <div class="feat">
        <div class="rv">
          <span class="kicker">About Ginger Tec</span>
          <h2 class="h2">Technology. Innovation. Opportunity.</h2>
          <p class="lede">${NAME} is a Zambian technology and innovation company focused on making technology, skills and innovative solutions more accessible to individuals, businesses and communities.</p>
          <ul class="ticks">
            <li>Young people</li><li>Women</li><li>People with disabilities</li><li>Businesses</li><li>Communities</li>${YEARS ? `<li>${YEARS} years serving Solwezi District</li>` : ''}
          </ul>
          <p style="margin-top:24px"><a class="btn btn--primary" href="about.html">Our story</a></p>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/women-tech.jpg" alt="A young Zambian woman in a blue work shirt crimping an Ethernet cable at a workshop bench" loading="lazy" width="1200" height="900">
          <figcaption>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>

  ${testimonialsSection()}

  ${assessSection('assess-form', [
    'A straight answer, not a sales pitch',
    'A clear price before any work starts',
    `Prefer to talk? <a href="${WA_URL}" target="_blank" rel="noopener" style="color:#9db9f5">WhatsApp us</a> or call ${PHONE}`,
  ])}

  <!-- CONTACT -->
  <section class="sec sec--tight" id="contact">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Contact</span>
        <h2 class="h2">Talk to a person in Solwezi</h2>
        <p class="lede">Serving Solwezi District and expanding across Zambia.</p>
      </div>
      ${contactGrid()}
      <div class="cta__row rv" style="justify-content:flex-start">
        <a class="btn btn--primary" href="tel:${PHONE_RAW}">Call now</a>
        ${btnWa('WhatsApp us')}
        <a class="btn btn--ghost" href="contact.html#assessment">Get a quote</a>
      </div>
    </div>
  </section>
`,
});

// ---- services
pages.push({
  file: 'services.html', crumb: 'Services',
  title: 'IT Services in Solwezi | Networking, CCTV, Starlink & Managed IT',
  desc: 'Network and Wi-Fi installation, CCTV, Starlink, managed IT services, software and website development, and IT training in Solwezi and across Zambia.',
  jsonld: { '@type': 'ItemList', name: 'Ginger Tec Solutions services', itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: BASE + 'services.html#' + s.id, name: s.name })) },
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Services</span>
      <h1>Technology Solutions for Real-World Needs</h1>
      <p>Everything a home, business, school or site needs to stay connected, secure and working, delivered by people based in Solwezi District.</p>
      <div class="phero__row">${btnQuote()}${btnWa()}</div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      ${SERVICES.map((s, i) => `<article class="svc rv" id="${s.id}">
        <div>
          <span class="svc__n">0${i + 1}</span>
          <h2 class="h3" style="font-size:clamp(24px,3vw,34px)">${s.name}</h2>
          <p class="lede" style="margin-top:12px">${s.lede}</p>
          <ul class="svc__pts">${s.items.map((p) => `<li>${p}</li>`).join('')}</ul>
          <div class="svc__act">
            <a class="svc__act-link" href="contact.html#assessment">Get a quote for ${s.short.toLowerCase()} ${I.arrow}</a>
            <a class="svc__act-link svc__act-link--wa" href="${WA_URL}?text=${encodeURIComponent('Hi Ginger Tec, I would like to ask about ' + s.name)}" target="_blank" rel="noopener">${I.wa} Ask on WhatsApp</a>
          </div>
        </div>
        <div>
          <div class="svc__art"><img class="svc__img" src="${s.image}" alt="${esc(s.alt)}" loading="lazy" width="1200" height="896"><span class="svc__cap">${s.short}</span></div>
          ${s.gallery ? `<div class="svc__gal">${s.gallery.map((g) => `<img src="${g.image}" alt="${esc(g.alt)}" loading="lazy" width="600" height="450">`).join('')}</div>` : ''}
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>

  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv"><span class="kicker">Why Ginger Tec</span><h2 class="h2">Why Choose Ginger Tec?</h2></div>
      ${whyBlocks()}
    </div>
  </section>

  ${cta('Not sure which service you need?', 'That is what the free assessment is for. Tell us the problem; we will tell you the fix.')}
`,
});

// ---- solutions
pages.push({
  file: 'solutions.html', crumb: 'Solutions',
  title: 'Solutions by Industry | Ginger Tec Solutions, Solwezi',
  desc: 'Technology for businesses, schools, NGOs, government, mining, retail, homes and communities in Solwezi: the problem, what we put in, and what changes.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Solutions</span>
      <h1>Technology for Every Environment</h1>
      <p>Different buildings, the same problem: the work stops when the technology does. For each, the problem we usually find, what we put in place, and what changes.</p>
      <div class="phero__row">${btnQuote()}${btnWa()}</div>
    </div>
  </section>
  <section class="sec">
    <div class="shell">
      ${INDUSTRIES.map((s) => `<article class="sol rv" id="${s.id}">
        <div class="sol__art${s.image ? '' : ' sol__art--flat'}">${s.image ? `<img src="${s.image}" alt="${esc(s.alt)}" loading="lazy" width="1200" height="900"><span class="sol__illus">Illustrative image</span>` : `<span aria-hidden="true">${s.icon}</span>`}</div>
        <div>
          <h2>${s.name}</h2>
          <p class="sol__head">${s.headline}</p>
          <dl class="sol__psb">
            <dt>The problem</dt><dd>${s.problem}</dd>
            <dt>What we put in</dt><dd><ul>${s.solution.map((x) => `<li>${x}</li>`).join('')}</ul></dd>
            <dt>What changes</dt><dd><ul class="sol__ben">${s.benefits.map((x) => `<li>${x}</li>`).join('')}</ul></dd>
          </dl>
          <a class="btn btn--primary btn--sm" href="contact.html#assessment">${s.cta || 'Request a free assessment'}</a>
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>
  ${cta()}
`,
});

// ---- projects
pages.push({
  file: 'projects.html', crumb: 'Projects',
  title: 'Technology Projects in Solwezi | Ginger Tec Solutions',
  desc: 'Technology projects in Solwezi District: network installations, CCTV, business IT setups, Wi-Fi, Starlink, and computer and server setups.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Projects</span>
      <h1>Technology Projects</h1>
      <p>What each kind of job involves: the problem we find, what we put in, and what changes. Images marked illustrative are not photographs of our own work.</p>
      <div class="phero__row">${btnQuote()}${btnWa()}</div>
    </div>
  </section>
  <section class="sec">
    <div class="shell">
      ${projectCards(PROJECTS, true)}
      <p class="projs__note rv">Honesty note: we do not show a job we did not do. Until a client agrees to have their site photographed and named, cards describe the type of work only. Real projects, with dates and photographs, replace these as permission is given.</p>
    </div>
  </section>
  ${cta('Have a project like one of these?', 'Send a photo of the site on WhatsApp and we will tell you what it needs and what it costs.')}
`,
});

// ---- about
pages.push({
  file: 'about.html', crumb: 'About',
  title: 'About Ginger Tec Solutions | Zambian Technology Company, Solwezi',
  desc: 'Ginger Tec Solutions is a Zambian technology and innovation company in Solwezi, making technology and skills accessible to people, businesses and communities.',
  jsonld: { '@type': 'AboutPage', url: BASE + 'about.html', about: { '@id': BASE + '#business' } },
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">About us</span>
      <h1>Technology. Innovation. Opportunity.</h1>
      <p>${NAME} is a Zambian technology and innovation company based in Solwezi District. We make technology, skills and innovative solutions more accessible to individuals, businesses and communities${YEARS ? `, and we have been doing it here for ${YEARS} years` : ''}.</p>
      <div class="phero__row">${btnQuote()}<a class="btn btn--onDeep" href="services.html">See our services</a></div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      <div class="feat">
        <div class="rv">
          <span class="kicker">Mission</span>
          <h2 class="h2">Make technology, skills and innovative solutions accessible.</h2>
          <p class="lede">To individuals, businesses and communities in Zambia. We install networks, cameras and internet because businesses here need them to run. We teach because the district needs people who can run them. Both are the same mission.</p>
          <ul class="ticks">
            <li>Young people: free basic IT training and pathways into work</li>
            <li>Women: in every role, including the technical ones</li>
            <li>People with disabilities: included by design, not as an afterthought</li>
            <li>Businesses: technology that pays for itself</li>
            <li>Communities: Solwezi Connect, our marketplace, built here</li>
          </ul>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/women-tech.jpg" alt="A young Zambian woman crimping an Ethernet cable at a workshop bench" loading="lazy" width="1200" height="900">
          <figcaption>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Vision</span>
        <h2 class="h2">A leading Zambian technology ecosystem</h2>
        <p class="lede">One that creates jobs, develops digital skills, supports businesses and connects communities. The services pay for it; the marketplace and the training are how it grows.</p>
      </div>
      <div class="why stag">
        <div class="why__item"><span class="why__n">01</span><h3>Employment creation</h3><p>Local youth hiring. Women in all roles. Disability inclusion. We hire from Solwezi first.</p></div>
        <div class="why__item"><span class="why__n">02</span><h3>Free IT training for youth</h3><p>Computer literacy, networking fundamentals and internet safety, free, for young people in our community.</p></div>
        <div class="why__item"><span class="why__n">03</span><h3>Sustainability</h3><p>Energy-efficient equipment, solar-powered CCTV where it fits, and e-waste recycled rather than dumped.</p></div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      <div class="feat feat--flip">
        <div class="rv">
          <span class="kicker">Who we work with</span>
          <h2 class="h2">The sites we look after</h2>
          <p class="lede">Businesses, schools, lodges, shops, NGOs, contractors and institutions across Solwezi District. Different buildings, the same problem: the work stops when the connection does.</p>
          <p style="margin-top:22px"><a class="btn btn--primary" href="solutions.html">Solutions by environment</a></p>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/shop-consult.jpg" alt="A consultant showing a shop owner something on a tablet in a Solwezi grocery shop" loading="lazy" width="1200" height="900">
          <figcaption>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>

  ${marketplaceBand()}
  ${cta()}
`,
});

// ---- marketplace
pages.push({
  file: 'marketplace.html', crumb: 'Marketplace',
  title: 'Solwezi Connect Marketplace | Find Services & Work in Solwezi',
  desc: 'Solwezi Connect, the Ginger Tec marketplace: jobs, cleaning, property, vehicles, delivery, skilled workers, helpers and local businesses. Free to join.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Marketplace</span>
      <h1>Find Services. Find Opportunities. Connect Locally.</h1>
      <p>Solwezi Connect is a digital marketplace connecting people, businesses and service providers across Solwezi. Built by ${NAME}, live now, and free to join.</p>
      <div class="phero__row">
        <a class="btn btn--primary" href="${APP}">Explore marketplace</a>
        <a class="btn btn--onDeep" href="${APP}/post">Post a job</a>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      <div class="sec__head rv"><span class="kicker">How it works</span><h2 class="h2">Three steps, one phone</h2></div>
      <div class="mk-steps stag">
        <div class="mk-step"><b>01</b><h3>Say what you need</h3><p>Post a job, request help in plain words, or browse what people are offering near you.</p></div>
        <div class="mk-step"><b>02</b><h3>Talk directly</h3><p>Message the person inside the app. Agree the price between you. No middleman takes a cut.</p></div>
        <div class="mk-step"><b>03</b><h3>Get it done</h3><p>Meet, do the work, pay each other directly. Leave a review so the next person knows who to trust.</p></div>
      </div>
    </div>
  </section>

  ${marketplaceBand()}

  <section class="sec">
    <div class="shell">
      <div class="feat">
        <div class="rv">
          <span class="kicker">Ginger Tec Academy</span>
          <h2 class="h2">Learn it here. Then find work here.</h2>
          <p class="lede">Solwezi Connect includes the Ginger Tec Academy: computer, networking and digital skills courses. Finish a course and it shows on your profile, so the people hiring can see what you can do.</p>
          <p style="margin-top:22px"><a class="btn btn--primary" href="${APP}/academy">See the courses</a></p>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/training.jpg" alt="Young Zambian adults learning at computers" loading="lazy" width="1003" height="752">
          <figcaption>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>
  ${cta('Businesses: get listed', 'A free listing in the Solwezi Connect directory puts your shop, lodge or service in front of people searching for it.')}
`,
});

// ---- contact
pages.push({
  file: 'contact.html', crumb: 'Contact',
  title: 'Contact Ginger Tec Solutions | Free Quote, Solwezi',
  desc: 'Contact Ginger Tec Solutions in Solwezi: WhatsApp +260 960 884 708, call +260 571 496 842, or request a free technology assessment.',
  jsonld: [
    { '@type': 'ContactPage', url: BASE + 'contact.html', about: { '@id': BASE + '#business' } },
    { '@type': 'FAQPage', '@id': BASE + 'contact.html#faq', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ],
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Contact</span>
      <h1>Talk to a person in Solwezi</h1>
      <p>Serving Solwezi District and expanding across Zambia. WhatsApp is fastest; the phone line is always answered; the form below gets you a free assessment.</p>
      <div class="phero__row">
        <a class="btn btn--primary" href="tel:${PHONE_RAW}">Call now</a>
        ${btnWa('WhatsApp us')}
        <a class="btn btn--onDeep" href="#assessment">Get a quote</a>
      </div>
    </div>
  </section>

  <section class="sec sec--tight">
    <div class="shell">
      ${contactGrid()}
    </div>
  </section>

  ${assessSection('quote-form', [
    'A straight answer, not a sales pitch',
    'A clear price before any work starts',
    'No travel charges inside Solwezi District',
    `Urgent? A site down is a phone call, not a form: ${PHONE}`,
  ])}

  ${faqSection()}
`,
});

// ---- legal
pages.push({
  file: 'privacy.html', crumb: 'Privacy Policy',
  title: 'Privacy Policy | Ginger Tec Solutions',
  desc: 'How Ginger Tec Solutions handles the information you share with us through this website, WhatsApp, phone and email.',
  body: `
  <section class="phero"><div class="shell phero__in rv"><span class="kicker">Legal</span><h1>Privacy Policy</h1><p>What we collect, why, and what we do with it. Written to be read.</p></div></section>
  <section class="sec"><div class="shell legal rv">
    <p class="updated">Last updated 15 September 2026</p>
    <h2>Who we are</h2>
    <p>${NAME}, ${SITE.location}. Contact: ${EMAIL}, WhatsApp ${WA}.</p>
    <h2>What we collect</h2>
    <ul>
      <li><strong>What you send us.</strong> When you use a form on this site, WhatsApp us, call or email, we receive what you give us: typically a name, phone number, email address, location and a description of what you need.</li>
      <li><strong>Nothing automatically.</strong> This website sets no cookies and runs no analytics or advertising trackers. Our web host may keep standard server logs (IP address, pages requested) for security.</li>
    </ul>
    <h2>Why we use it</h2>
    <p>To reply to you, quote for work, do the work, and keep records of it. We do not sell or rent your details, and we do not send marketing you did not ask for.</p>
    <h2>Forms on this site</h2>
    <p>Until a form service is connected, submitting a form opens your own email app or WhatsApp with the message addressed to us; nothing is stored on this website. If we later connect a form service, submissions pass through that provider to reach our inbox.</p>
    <h2>Solwezi Connect</h2>
    <p>Our marketplace at <a href="${APP}">connect.gingertecsolutions.store</a> is a separate service with its own account system and its own privacy terms, shown there.</p>
    <h2>Your rights</h2>
    <p>Ask us what we hold about you, ask us to correct it, or ask us to delete it, and we will, unless the law or an active job requires us to keep it. Write to ${EMAIL}.</p>
    <h2>Changes</h2>
    <p>If this policy changes, the date at the top changes with it.</p>
  </div></section>`,
});

pages.push({
  file: 'terms.html', crumb: 'Terms',
  title: 'Terms of Service | Ginger Tec Solutions',
  desc: 'The terms on which Ginger Tec Solutions quotes for and carries out technology work, and the terms of use of this website.',
  body: `
  <section class="phero"><div class="shell phero__in rv"><span class="kicker">Legal</span><h1>Terms</h1><p>How we quote, how we work, and what you can expect from us.</p></div></section>
  <section class="sec"><div class="shell legal rv">
    <p class="updated">Last updated 15 September 2026</p>
    <h2>Quotes and prices</h2>
    <ul>
      <li>You get a written price before work starts. It is the price, unless the job turns out to need parts or work we could not have seen, in which case we tell you before we buy or do anything extra.</li>
      <li>We do not charge travel time or mileage for jobs inside Solwezi District.</li>
      <li>A quote is valid for 30 days unless it says otherwise.</li>
    </ul>
    <h2>Doing the work</h2>
    <ul>
      <li>We install equipment to manufacturer guidance and label and document what we install.</li>
      <li>New equipment we supply carries the manufacturer's warranty. Our workmanship is guaranteed: if something we installed fails because of how we installed it, we put it right at no charge.</li>
      <li>Managed and part-time support are month to month unless a contract says otherwise. Nothing locks you in.</li>
    </ul>
    <h2>Payment</h2>
    <p>Payment terms are on the quote. For supplied equipment we may ask for a deposit before ordering.</p>
    <h2>This website</h2>
    <ul>
      <li>Information here is general. Your site is specific; the assessment is free precisely so we can look before we promise.</li>
      <li>Photographs of people on this site are illustrative unless captioned as a real project. They are not our staff or customers unless we say so.</li>
      <li>Solwezi Connect has its own terms, shown at <a href="${APP}">connect.gingertecsolutions.store</a>.</li>
    </ul>
    <h2>Law</h2>
    <p>These terms are governed by the laws of Zambia.</p>
    <h2>Questions</h2>
    <p>Write to ${EMAIL} or WhatsApp ${WA}.</p>
  </div></section>`,
});

pages.push({
  file: '404.html',
  title: 'Page not found | Ginger Tec Solutions',
  desc: 'That page is not here. Everything Ginger Tec Solutions does in Solwezi is one tap away.',
  body: `
  <section class="phero"><div class="shell phero__in rv"><span class="kicker">404</span><h1>That page is not here</h1><p>The link may be old, or mistyped. Everything we do is one tap away.</p>
  <div class="phero__row"><a class="btn btn--primary" href="index.html">Home</a><a class="btn btn--onDeep" href="services.html">Services</a>${btnWa()}</div></div></section>`,
});

// ---------------------------------------------------------------- images
// Every <img> pointing at a JPEG that has a .webp twin on disk becomes a
// <picture> with a WebP source. Browsers that cannot show WebP (none in
// practice now) still get the JPEG. The twins are made by tools/webp.js.
const hasWebp = (src) => fs.existsSync(path.join(ROOT, src.replace(/\.jpe?g$/i, '.webp')));
const toWebp = (src) => src.replace(/\.jpe?g$/i, '.webp');
function pictures(html) {
  return html.replace(/<img\b([^>]*?)\ssrc="(assets\/[^"]+\.jpe?g)"([^>]*)>/g, (m, before, src, after) => {
    if (!hasWebp(src)) return m;
    const srcsetMatch = (before + after).match(/\ssrcset="([^"]+)"/);
    const sizesMatch = (before + after).match(/\ssizes="([^"]+)"/);
    const srcset = srcsetMatch
      ? srcsetMatch[1].split(',').map((part) => { const [u, w] = part.trim().split(/\s+/); return hasWebp(u) ? `${toWebp(u)} ${w}` : null; }).filter(Boolean).join(', ')
      : toWebp(src);
    if (!srcset) return m;
    return `<picture><source type="image/webp" srcset="${srcset}"${sizesMatch ? ` sizes="${sizesMatch[1]}"` : ''}>${m}</picture>`;
  });
}

// ---------------------------------------------------------------- write
for (const p of pages) {
  const html = pictures(shell(p));
  fs.writeFileSync(path.join(ROOT, p.file), html, 'utf8');
  console.log(p.file.padEnd(18), Math.round(html.length / 1024) + ' KB');
}

const today = new Date().toISOString().slice(0, 10);
const sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.filter((p) => p.file !== '404.html').map((p) => `  <url><loc>${BASE}${p.file === 'index.html' ? '' : p.file}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
console.log('sitemap.xml         ', pages.length - 1, 'urls');
