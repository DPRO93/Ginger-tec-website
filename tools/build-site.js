/* Builds the ten pages of gingertecsolutions.store from one shared shell.
   Output is plain HTML in the repo; this script is a tool, not a dependency. */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..');
const BASE = 'https://gingertecsolutions.store/';
const APP = 'https://connect.gingertecsolutions.store';
const PHONE = '+260 571 496 842', PHONE_RAW = '+260571496842';
const WA = '+260 960 884 708', WA_URL = 'https://wa.me/260960884708';
const EMAIL = 'dannykamalondo@gmail.com';
const NAME = 'Ginger Tec Solutions';
const TAG = 'Technology That Works. Built for Zambia.';

// ---------------------------------------------------------------- icons
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"></path></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.6 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.2-.2-.3-.4-.4z"></path></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"></rect><path d="M3 7l9 6 9-6"></path></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10.2" r="2.8"></circle></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"></circle><path d="M12 7v5l3.5 2"></path></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"></path><path d="M9 4v14M15 6v14"></path></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"></path></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"></circle><path d="M12 6.5v11M9 9.5a3 3 0 0 1 3-1.5c1.7 0 3 .9 3 2s-1.3 2-3 2-3 .9-3 2 1.3 2 3 2a3 3 0 0 0 3-1.5"></path></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5l-9.6 9.6a2.1 2.1 0 0 1-3-3l9.6-9.6z"></path><path d="M14.7 6.3a4 4 0 1 1 5 5"></path></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
  connect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8"></path></svg>',
};
const MARK = `<svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="currentColor"></rect><g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"><path d="M6.5 10.5a13 13 0 0 1 19 0"></path><path d="M10.5 15.5a8 8 0 0 1 11 0"></path><path d="M14 20.5a3.4 3.4 0 0 1 4 0"></path></g><circle cx="16" cy="25.5" r="2.1" fill="#fff"></circle></svg>`;
const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231a56db'/%3E%3Cg fill='none' stroke='white' stroke-width='2.1' stroke-linecap='round'%3E%3Cpath d='M6.5 10.5a13 13 0 0 1 19 0'/%3E%3Cpath d='M10.5 15.5a8 8 0 0 1 11 0'/%3E%3Cpath d='M14 20.5a3.4 3.4 0 0 1 4 0'/%3E%3C/g%3E%3Ccircle cx='16' cy='25.5' r='2.1' fill='white'/%3E%3C/svg%3E`;

const NAV = [
  ['index.html', 'Home'], ['services.html', 'Services'], ['solutions.html', 'Solutions'],
  ['projects.html', 'Projects'], ['about.html', 'About Us'], ['marketplace.html', 'Marketplace'], ['contact.html', 'Contact'],
];

// ---------------------------------------------------------------- pieces
const btnQuote = (cls = 'btn btn--primary') => `<a class="${cls}" href="contact.html#assessment">Get a free quote</a>`;
const btnWa = (label = 'Chat on WhatsApp', cls = 'btn btn--wa') => `<a class="${cls}" href="${WA_URL}" target="_blank" rel="noopener">${I.wa}${label}</a>`;
const btnCall = (cls = 'btn btn--ghost') => `<a class="${cls}" href="tel:${PHONE_RAW}">${I.phone}Call ${PHONE}</a>`;

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

// the free assessment form, used on the home and contact pages
const assessForm = (id) => `
          <form id="${id}" class="enquiry" data-subject="Free technology assessment request" novalidate>
            <div class="frow">
              <label class="field"><span>Name<i class="req" aria-hidden="true">*</i></span>
                <input type="text" name="name" autocomplete="name" placeholder="Your full name" required></label>
              <label class="field"><span>Phone / WhatsApp<i class="req" aria-hidden="true">*</i></span>
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+260 ..." required></label>
            </div>
            <div class="frow">
              <label class="field"><span>Email</span>
                <input type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
              <label class="field"><span>Business / Organisation</span>
                <input type="text" name="organisation" autocomplete="organization" placeholder="Company, school, NGO, or 'home'"></label>
            </div>
            <div class="frow frow--3">
              <label class="field"><span>Location</span>
                <input type="text" name="location" placeholder="Area or town"></label>
              <label class="field"><span>Service needed</span>
                <select name="service">
                  <option value="">Not sure yet</option>
                  <option>Networking (LAN, Wi-Fi, cabling)</option>
                  <option>CCTV &amp; security</option>
                  <option>Starlink &amp; connectivity</option>
                  <option>Managed IT services</option>
                  <option>Software &amp; digital solutions</option>
                  <option>Website development</option>
                  <option>IT training</option>
                  <option>Government e-services help</option>
                  <option>Something else</option>
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
            </div>
            <label class="field"><span>Describe your requirement<i class="req" aria-hidden="true">*</i></span>
              <textarea name="message" placeholder="What are you trying to achieve? What is not working today? Where is the site?" required></textarea></label>
            <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
            <button class="btn btn--primary btn--block" type="submit">Request a free assessment</button>
            <p class="fnote">No obligation. We reply the same working day, usually much sooner. Your details stay with us.</p>
            <p class="fstatus" role="status" aria-live="polite"></p>
          </form>`;

const SERVICES = [
  { id: 'networking', name: 'Networking', img: 'assets/svc/network.jpg', alt: 'A network cabinet with patch panel, switches and neatly routed blue and grey cables',
    pts: ['LAN/WAN', 'Wi-Fi', 'Routers', 'Switches', 'Structured cabling', 'Network configuration'],
    lede: 'Wired and wireless networks that stay up. We design, cable, configure and document, so the next person can find the fault as fast as we can.' },
  { id: 'cctv', name: 'CCTV & Security', img: 'assets/svc/cctv.jpg', alt: 'A security camera mounted under the eaves of a building',
    pts: ['CCTV installation', 'NVR/DVR', 'Remote monitoring', 'Camera configuration', 'Maintenance'],
    lede: 'Cameras placed where they actually see, recorders sized for the days you need, and a phone app that works from anywhere.' },
  { id: 'starlink', name: 'Starlink & Connectivity', img: 'assets/svc/starlink.jpg', alt: 'A flat satellite internet panel on a pole against a dusk sky',
    pts: ['Starlink installation', 'Network configuration', 'Wi-Fi optimisation', 'Internet troubleshooting', 'Connectivity solutions'],
    lede: 'Internet for the places the cable never reached. We supply, mount, power and set up, then stay on call if anything drops.' },
  { id: 'managed-it', name: 'Managed IT Services', img: 'assets/svc/managed.jpg', alt: 'Monitors on desks in an office at dusk beside a server tower',
    pts: ['Computer support', 'Hardware maintenance', 'Software support', 'Network support', 'IT consulting'],
    lede: 'Your IT department without hiring one. Monthly, part-time, or when something breaks. Includes 24/7 support and e-services help.' },
  { id: 'software', name: 'Software & Digital Solutions', img: 'assets/svc/web.jpg', alt: 'A laptop and a phone lit up on a desk',
    pts: ['Website development', 'Business systems', 'Digital automation', 'Custom software', 'Digital transformation'],
    lede: 'Modern websites and business tools, built, hosted and kept running. Solwezi Connect is our own product, so we use what we sell.' },
  { id: 'training', name: 'IT Training', img: 'assets/photos/training.jpg', alt: 'Young Zambian adults learning at desktop computers in a training room, one pointing at a classmate\u2019s screen',
    pts: ['Computer skills', 'Digital literacy', 'Networking fundamentals', 'IT support skills', 'Business technology training'],
    lede: 'Practical skills taught by people who install this equipment for a living. Free basic training for youth, and paid courses for businesses.' },
];

const WHY = [
  ['\u{1F1FF}\u{1F1F2}', 'Zambian Technology Expertise', 'Solutions designed around local needs.'],
  ['\u26A1', 'Fast Response', 'Responsive technical support when you need it.'],
  ['\u{1F4B0}', 'Affordable', 'Solutions designed around practical budgets.'],
  ['\u{1F6E0}\uFE0F', 'Professional Installation', 'Careful installation and configuration.'],
  ['\u{1F512}', 'Security Focused', 'Reliable technology and security infrastructure.'],
  ['\u{1F91D}', 'Long-Term Support', 'We don\u2019t disappear after installation.'],
];

// Each of these describes a KIND of job we do. None is a claim about a
// specific past project, and every image is labelled as illustrative.
const PROJECTS = [
  { type: 'Network installation', title: 'Small-business office network', img: 'assets/svc/network.jpg', alt: 'Patch panel and switches in a wall cabinet',
    loc: 'Solwezi District', sol: 'Structured cabling, managed switch, Wi-Fi',
    desc: 'Every desk cabled to a labelled patch panel, one managed switch, business Wi-Fi with a separate guest network, and a drawing left with the owner.' },
  { type: 'CCTV installation', title: 'Retail shop camera system', img: 'assets/svc/cctv.jpg', alt: 'Security camera on a building exterior',
    loc: 'Solwezi District', sol: 'IP cameras, NVR, phone viewing',
    desc: 'Cameras covering the till, the door and the stockroom, thirty days of recording, and the owner watching from their phone at home.' },
  { type: 'Business IT setup', title: 'New office, from boxes to working desks', img: 'assets/photos/office-setup.jpg', alt: 'Two technicians setting up computers and a router in a freshly painted office',
    loc: 'Solwezi District', sol: 'Computers, printer, router, backups',
    desc: 'Computers unboxed, set up and secured, a shared printer, a router configured properly, and a backup that runs without anyone remembering to.' },
  { type: 'Wi-Fi installation', title: 'School computer room and staff Wi-Fi', img: 'assets/photos/school.jpg', alt: 'Pupils in uniform at computers in a classroom with an access point on the wall',
    loc: 'Solwezi District', sol: 'Access points, content filtering, lab setup',
    desc: 'Coverage across classrooms and the staff room, filtering appropriate for pupils, and a computer room that the teacher can reset in a minute.' },
  { type: 'Starlink installation', title: 'Connectivity for a remote site', img: 'assets/svc/starlink.jpg', alt: 'Satellite dish mounted on a roof',
    loc: 'North-Western Province', sol: 'Starlink, mounting, power, local Wi-Fi',
    desc: 'A lodge, a farm or a camp with no fibre and poor mobile signal gets a dish on a proper mount, clean power, and Wi-Fi that reaches the rooms.' },
  { type: 'Computer & server setup', title: 'Site office for an industrial contractor', img: 'assets/photos/mining-office.jpg', alt: 'An administrator in a safety vest at a two-screen workstation in a site office',
    loc: 'Solwezi District', sol: 'Workstations, UPS, shared storage, support',
    desc: 'Dusty, hot and off the main road. Workstations with clean power, shared files that survive a power cut, and a support line that answers.' },
];

const INDUSTRIES = [
  { t: 'Businesses', s: 'Offices, SMEs, contractors', img: 'assets/photos/office-setup.jpg', alt: 'Technicians setting up computers in an office' },
  { t: 'Schools', s: 'Computer rooms, staff networks', img: 'assets/photos/school.jpg', alt: 'Pupils at computers in a Zambian classroom' },
  { t: 'NGOs', s: 'Field offices, reporting, security', ico: '\u{1F91D}' },
  { t: 'Government offices', s: 'Networks, e-services, support', ico: '\u{1F3DB}\uFE0F' },
  { t: 'Mining & industrial', s: 'Site offices, camps, remote links', img: 'assets/photos/mining-office.jpg', alt: 'A site office overlooking red earth and a parked pickup' },
  { t: 'Retail shops', s: 'CCTV, tills, Wi-Fi', img: 'assets/photos/shop-consult.jpg', alt: 'A consultant showing a shop owner something on a tablet in a grocery shop' },
  { t: 'Homes', s: 'Internet, Wi-Fi, cameras', img: 'assets/photos/home-internet.jpg', alt: 'A technician mounting a dish on a house while the homeowner watches' },
  { t: 'Communities', s: 'Training, digital inclusion', img: 'assets/photos/training.jpg', alt: 'Young people learning at computers' },
];

const MK_CATS = [
  ['\u{1F697}', 'Hire a Vehicle'], ['\u{1F4E6}', 'Delivery Services'], ['\u{1F9F9}', 'House Cleaning'],
  ['\u{1F455}', 'Laundry Services'], ['\u{1F3E0}', 'Houses for Rent'], ['\u{1F469}\u{1F3FF}\u200D\u{1F373}', 'Helpers & Maids'],
  ['\u{1F527}', 'Skilled Workers'], ['\u{1F4BC}', 'Jobs'], ['\u{1F6E0}\uFE0F', 'General Services'],
];

const FAQ = [
  ['How fast do you actually respond?', 'We are based in Solwezi District, so a call goes to someone who can be on your site the same day. Our helpdesk runs 24/7, and WhatsApp is the fastest way to reach us at any hour.'],
  ['Will there be hidden costs or travel charges?', 'No. You get the price before the work starts, and we do not bill travel time or mileage for jobs inside Solwezi District. If a job needs parts we did not expect, we tell you before we buy them.'],
  ['Do I have to sign a long contract?', 'No. You can call us for one job, take managed support monthly, or use our part-time IT support as and when you need it. Nothing locks you in.'],
  ['Are you going to still be here next year?', 'We have served mining contractors, SMEs, schools, lodges and government institutions in Solwezi District for 5 years. This is our home district, not a territory we visit.'],
  ['Can Starlink really work at a remote site?', 'Yes. Starlink is built for places the cable never reached, which is exactly why it suits remote and off-grid sites here. We handle the sale, the mounting, the power, and the setup, then we stay on call if anything drops.'],
];

// ---------------------------------------------------------------- shell
function shell({ file, title, desc, ogTitle, ogImage = 'assets/og.jpg', ogAlt, jsonld, body, extraHead = '' }) {
  const url = BASE + (file === 'index.html' ? '' : file);
  const nav = NAV.map(([h, l]) => `<a href="${h}"${h === file ? ' aria-current="page"' : ''}>${l}</a>`).join('\n      ');
  const drawer = NAV.map(([h, l]) => `<li><a href="${h}"${h === file ? ' aria-current="page"' : ''}>${l}</a></li>`).join('\n        ');
  const ftrLinks = [['index.html', 'Home'], ['services.html', 'Services'], ['projects.html', 'Projects'], ['about.html', 'About'], ['marketplace.html', 'Marketplace'], ['contact.html', 'Contact'], ['privacy.html', 'Privacy Policy'], ['terms.html', 'Terms']]
    .map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('\n          ');

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

<link rel="icon" href="${FAVICON}">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/sora-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/plex-sans-var.woff2" crossorigin>
${extraHead}<link rel="stylesheet" href="assets/site.css">
${jsonld ? `<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 1)}\n</script>` : ''}
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
      <a class="btn btn--wa btn--sm" href="${WA_URL}" target="_blank" rel="noopener">${I.wa}WhatsApp</a>
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
        <a class="btn btn--wa" href="${WA_URL}" target="_blank" rel="noopener">WhatsApp</a>
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
        <div class="ftr__social" aria-label="Contact channels">
          <a href="${WA_URL}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
          <a href="tel:${PHONE_RAW}" aria-label="Phone">${I.phone}</a>
          <a href="mailto:${EMAIL}" aria-label="Email">${I.mail}</a>
          <a href="${APP}" aria-label="Solwezi Connect">${I.connect}</a>
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
          <li><a href="contact.html">${I.pin}Solwezi District, Zambia</a></li>
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
        ${SERVICES.map((s) => `<article class="scard">
          <div class="scard__art"><img src="${s.img}" alt="${s.alt}" loading="lazy" width="1200" height="750"></div>
          <div class="scard__body">
            <h3>${s.name}</h3>
            <ul>${s.pts.map((p) => `<li>${p}</li>`).join('')}</ul>
            <a class="scard__link" href="services.html#${s.id}">More about ${s.name}</a>
          </div>
        </article>`).join('\n        ')}
      </div>`;

const industriesGrid = () => `
      <div class="inds stag">
        ${INDUSTRIES.map((d) => d.img
          ? `<a class="ind" href="solutions.html#${slug(d.t)}"><img src="${d.img}" alt="${d.alt}" loading="lazy" width="1200" height="900"><span class="ind__label">${d.t}<small>${d.s}</small></span></a>`
          : `<a class="ind ind--flat" href="solutions.html#${slug(d.t)}"><span class="ind__ico" aria-hidden="true">${d.ico}</span><span class="ind__label">${d.t}<small>${d.s}</small></span></a>`).join('\n        ')}
      </div>`;

const projectCards = (list = PROJECTS) => `
      <div class="projs stag">
        ${list.map((p) => `<article class="proj">
          <figure>
            <img src="${p.img}" alt="${p.alt}" loading="lazy" width="1200" height="800">
            <figcaption class="proj__illus">Illustrative project image</figcaption>
          </figure>
          <div class="proj__body">
            <span class="proj__type">${p.type}</span>
            <h3>${p.title}</h3>
            <dl><dt>Location</dt><dd>${p.loc}</dd><dt>Solution</dt><dd>${p.sol}</dd></dl>
            <p>${p.desc}</p>
          </div>
        </article>`).join('\n        ')}
      </div>`;

const marketplaceBand = () => `
  <section class="sec connect-band" id="marketplace">
    <div class="shell">
      <div class="connect-band__in rv">
        <span class="connect-band__tag">${I.connect.replace('<svg', '<svg style="width:14px;height:14px"')} Now live</span>
        <h2>Find Services. <em>Find Opportunities.</em> Connect Locally.</h2>
        <p class="connect-band__tagline">Solwezi Connect, a Ginger Tec product.</p>
        <p class="connect-band__lede">A digital marketplace connecting people, businesses and service providers across Solwezi. Free to join.</p>
        <ul class="connect-band__grid">
          ${MK_CATS.map(([e, t]) => `<li><span aria-hidden="true">${e}</span> ${t}</li>`).join('\n          ')}
        </ul>
        <div class="connect-band__row">
          <a class="btn connect-band__btn" href="${APP}">Explore the marketplace</a>
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
        <div class="cg"><span class="cg__k">Location</span><span class="cg__v">Solwezi District, North-Western Province, Zambia</span><span class="cg__s">Site visits by appointment</span></div>
        <div class="cg"><span class="cg__k">Business hours</span><span class="cg__v">Support: 24 hours, 7 days</span><span class="cg__s">Office enquiries: Monday to Saturday</span></div>
      </div>`;

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const business = {
  '@type': 'ProfessionalService',
  '@id': BASE + '#business',
  name: NAME,
  url: BASE,
  image: BASE + 'assets/og.jpg',
  logo: BASE + 'assets/og.jpg',
  slogan: TAG,
  description: 'Zambian technology and innovation company in Solwezi District providing IT support and managed IT services, network installation, LAN/WAN and Wi-Fi infrastructure, CCTV and security systems, Starlink and internet connectivity, computer hardware and maintenance, software and website development, and digital literacy and IT training.',
  telephone: PHONE_RAW,
  email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Solwezi', addressRegion: 'North-Western Province', addressCountry: 'ZM' },
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Solwezi District' }, { '@type': 'Country', name: 'Zambia' }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
  sameAs: [APP],
  knowsAbout: ['IT support', 'Managed IT services', 'Network installation', 'Wi-Fi installation', 'Structured cabling', 'CCTV installation', 'Starlink installation', 'Computer maintenance', 'Website development', 'Software development', 'IT training', 'Digital literacy'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Technology services',
    itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.lede, url: BASE + 'services.html#' + s.id, areaServed: 'Solwezi District, Zambia' } })),
  },
};

// ---------------------------------------------------------------- pages
const pages = [];

pages.push({
  file: 'index.html',
  title: 'Ginger Tec Solutions | IT, Networking, CCTV & Starlink in Solwezi',
  desc: 'Zambian IT company in Solwezi District: IT support, network and Wi-Fi installation, CCTV, Starlink, software, websites and IT training. Technology that works, built for Zambia. WhatsApp +260 960 884 708.',
  ogTitle: 'Ginger Tec Solutions | Technology That Works. Built for Zambia.',
  ogImage: 'assets/og-hero.jpg',
  extraHead: `<link rel="preload" as="image" href="assets/photos/hero-technician.jpg" imagesrcset="assets/photos/hero-technician-m.jpg 900w, assets/photos/hero-technician.jpg 1344w" imagesizes="100vw">\n`,
  jsonld: { '@context': 'https://schema.org', '@graph': [
    business,
    { '@type': 'WebSite', '@id': BASE + '#website', url: BASE, name: NAME, publisher: { '@id': BASE + '#business' }, inLanguage: 'en' },
    { '@type': 'FAQPage', '@id': BASE + '#faq', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] },
  body: `
  <!-- ============================ HERO ============================ -->
  <section class="hero2" aria-label="${NAME}">
    <div class="hero2__media">
      <img src="assets/photos/hero-technician.jpg" srcset="assets/photos/hero-technician-m.jpg 900w, assets/photos/hero-technician.jpg 1344w" sizes="100vw" width="1344" height="752" fetchpriority="high" alt="A Zambian network technician crouched at a wall-mounted cabinet, clipping a blue patch cable into a switch in the back room of a hardware shop in Solwezi">
    </div>
    <div class="hero2__scrim"></div>
    <div class="shell hero2__in">
      <span class="kicker">Solwezi District, Zambia</span>
      <h1>Technology That Works. <em>Built for Zambia.</em></h1>
      <p class="hero2__sub">Reliable IT, networking, security and connectivity solutions for homes, businesses and communities.</p>
      <p class="hero2__sup">Based in Solwezi District, ${NAME} delivers practical, affordable and professional technology solutions across Zambia.</p>
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

  <!-- ============================ SERVICES ============================ -->
  <section class="sec" id="services">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">What we do</span>
        <h2 class="h2">Technology Solutions for Real-World Needs</h2>
        <p class="lede">Six things we do well, from the cable in the wall to the training that makes it useful. Every one comes with a clear price and someone to call afterwards.</p>
      </div>
      ${serviceCards()}
      <p class="projs__note rv">Also: Government e-services help for the ZamServices portal, ICT consultancy, and part-time IT support. <a href="services.html">See every service</a>.</p>
    </div>
  </section>

  <!-- ============================ WHY ============================ -->
  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Why Ginger Tec</span>
        <h2 class="h2">Why Choose Ginger Tec?</h2>
      </div>
      <div class="why stag">
        ${WHY.map(([e, h, p]) => `<div class="why__item"><span class="why__e" aria-hidden="true">${e}</span><h3>${h}</h3><p>${p}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- ============================ PROJECTS ============================ -->
  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Technology projects</span>
        <h2 class="h2">The kind of work we do</h2>
        <p class="lede">Six typical jobs, what they involve, and what you get at the end. Photographs are illustrative; real project photos are added as clients give permission.</p>
      </div>
      ${projectCards()}
      <p class="rv" style="margin-top:28px"><a class="btn btn--ghost" href="projects.html">All project types</a></p>
    </div>
  </section>

  <!-- ============================ INDUSTRIES ============================ -->
  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Industries we serve</span>
        <h2 class="h2">Technology for Every Environment</h2>
        <p class="lede">Different buildings, the same problem: the work stops when the technology does.</p>
      </div>
      ${industriesGrid()}
    </div>
  </section>

  ${marketplaceBand()}

  <!-- ============================ ABOUT ============================ -->
  <section class="sec">
    <div class="shell">
      <div class="feat">
        <div class="rv">
          <span class="kicker">About Ginger Tec</span>
          <h2 class="h2">Technology. Innovation. Opportunity.</h2>
          <p class="lede">${NAME} is a Zambian technology and innovation company focused on making technology, skills and innovative solutions more accessible to individuals, businesses and communities.</p>
          <ul class="ticks">
            <li>Young people</li><li>Women</li><li>People with disabilities</li><li>Businesses</li><li>Communities</li><li>Five years serving Solwezi District</li>
          </ul>
          <p style="margin-top:24px"><a class="btn btn--primary" href="about.html">Our story</a></p>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/women-tech.jpg" alt="A young Zambian woman in a blue work shirt crimping an Ethernet cable at a workshop bench" loading="lazy" width="1200" height="900">
        </figure>
      </div>
    </div>
  </section>

  <!-- ============================ COMMUNITY ============================ -->
  <section class="sec sec--deep">
    <div class="shell">
      <div class="feat feat--flip">
        <div class="rv">
          <span class="kicker">Community &amp; digital empowerment</span>
          <h2 class="h2">Technology Should Create Opportunity</h2>
          <p class="lede">The equipment is only half of it. The other half is people who can use it, fix it and build on it. That is why we teach.</p>
          <ul class="ticks">
            <li>Digital literacy</li><li>IT training</li><li>Youth empowerment</li><li>Women in technology</li><li>Digital inclusion</li><li>Community innovation</li>
          </ul>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/training.jpg" alt="Young Zambian adults at desktop computers in a whitewashed training room, one woman in a headwrap pointing at a classmate\u2019s screen" loading="lazy" width="1003" height="752">
        </figure>
      </div>
    </div>
  </section>

  <!-- ==================== FREE YOUTH TRAINING (kept distinct) ==================== -->
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
  </section>

  <!-- ============================ TESTIMONIALS ============================ -->
  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">What customers say</span>
        <h2 class="h2">In their words</h2>
        <p class="lede">We only publish testimonials from real customers, in their own words, with their permission. This section fills as they come in.</p>
      </div>
      <!-- PLACEHOLDER CONTENT: replace each .testi with a genuine, permitted customer quote. Never invent one. -->
      <div class="testis stag">
        <div class="testi"><span class="testi__mark" aria-hidden="true">&ldquo;</span><p>Space reserved for a customer's words about a network or CCTV installation.</p><div class="testi__who"><i aria-hidden="true"></i>Customer name and business, with permission</div></div>
        <div class="testi"><span class="testi__mark" aria-hidden="true">&ldquo;</span><p>Space reserved for a customer's words about support, response time or a Starlink setup.</p><div class="testi__who"><i aria-hidden="true"></i>Customer name and business, with permission</div></div>
        <div class="testi testi--ask"><p><strong>Have we worked for you?</strong> Tell us what you thought, good or bad. If you are happy for us to publish it, it goes here with your name.</p>${btnWa('Send a testimonial', 'btn btn--wa btn--sm')}</div>
      </div>
    </div>
  </section>

  <!-- ============================ FREE ASSESSMENT ============================ -->
  <section class="sec sec--deep assess" id="assessment">
    <div class="shell">
      <div class="assess__grid">
        <div class="rv">
          <span class="kicker">Free technology assessment</span>
          <h2 class="h2">Not Sure What Technology You Need?</h2>
          <p class="lede">Tell us what you're trying to achieve. We'll help you identify the right technology solution for your home, business or organisation.</p>
          <ul class="assess__pts">
            <li>A straight answer, not a sales pitch</li>
            <li>A clear price before any work starts</li>
            <li>Prefer to talk? <a href="${WA_URL}" target="_blank" rel="noopener" style="color:#9db9f5">WhatsApp us</a> or call ${PHONE}</li>
          </ul>
        </div>
        <div class="formwrap rv">
          ${assessForm('assess-form')}
        </div>
      </div>
    </div>
  </section>

  ${faqSection()}

  <!-- ============================ CONTACT ============================ -->
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
  file: 'services.html',
  title: 'IT Services in Solwezi | Networking, CCTV, Starlink & Managed IT',
  desc: 'Network installation, Wi-Fi, structured cabling, CCTV installation, Starlink, managed IT services, software and website development, and IT training in Solwezi District and across Zambia.',
  jsonld: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Ginger Tec Solutions services', itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: BASE + 'services.html#' + s.id, name: s.name })) },
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
          <ul class="svc__pts">${s.pts.map((p) => `<li>${p}</li>`).join('')}</ul>
          <div class="svc__act">
            <a class="svc__act-link" href="contact.html#assessment">Get a quote for ${s.name.toLowerCase().replace(' & ', ' and ')} ${I.arrow}</a>
            <a class="svc__act-link svc__act-link--wa" href="${WA_URL}?text=${encodeURIComponent('Hi Ginger Tec, I would like to ask about ' + s.name)}" target="_blank" rel="noopener">${I.wa} Ask on WhatsApp</a>
          </div>
        </div>
        <div class="svc__art"><img class="svc__img" src="${s.img}" alt="${s.alt}" loading="lazy" width="1200" height="896"><span class="svc__cap">${s.name}</span></div>
      </article>`).join('\n      ')}

      <article class="svc rv" id="egov">
        <div>
          <span class="svc__n">07</span>
          <h2 class="h3" style="font-size:clamp(24px,3vw,34px)">Government e-Services Help</h2>
          <p class="lede" style="margin-top:12px">We help you apply for any of the 572 services on the Government of Zambia ZamServices portal: PACRA registrations, ZRA, RTSA, mining licences, land records and more. You bring the documents; we handle the portal.</p>
          <ul class="svc__pts"><li>PACRA</li><li>ZRA</li><li>RTSA</li><li>Licences &amp; permits</li><li>Land records</li></ul>
          <div class="svc__act"><a class="svc__act-link" href="contact.html#assessment">Ask about e-services ${I.arrow}</a></div>
        </div>
        <div class="svc__art"><img class="svc__img" src="assets/svc/egov.jpg" alt="A laptop open on a government services portal" loading="lazy" width="1200" height="896"><span class="svc__cap">e-Services</span></div>
      </article>
    </div>
  </section>

  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Why Ginger Tec</span>
        <h2 class="h2">Why Choose Ginger Tec?</h2>
      </div>
      <div class="why stag">
        ${WHY.map(([e, h, p]) => `<div class="why__item"><span class="why__e" aria-hidden="true">${e}</span><h3>${h}</h3><p>${p}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  ${cta('Not sure which service you need?', 'That is what the free assessment is for. Tell us the problem; we will tell you the fix.')}
`,
});

// ---- solutions
const SOL = [
  { t: 'Businesses', img: 'assets/photos/office-setup.jpg', alt: 'Technicians setting up computers in a new office', p: 'Offices, SMEs and contractors need the basics done properly: a network that does not drop, computers that are backed up, cameras on the stock, and a number to call.', pts: ['Office network & Wi-Fi', 'Computers & printers', 'Backups', 'CCTV', 'Managed support', 'Website'] },
  { t: 'Schools', img: 'assets/photos/school.jpg', alt: 'Pupils at computers in a classroom', p: 'Computer rooms that survive a term, Wi-Fi that reaches the staff room, filtering appropriate for pupils, and training for the teachers who run it.', pts: ['Computer labs', 'Campus Wi-Fi', 'Content filtering', 'CCTV', 'Teacher training'] },
  { t: 'NGOs', ico: '\u{1F91D}', p: 'Field offices with donors to report to. Reliable connectivity for reporting, secure storage for beneficiary data, and support that understands a grant cycle.', pts: ['Connectivity', 'Secure data', 'Laptops & support', 'Starlink for field sites'] },
  { t: 'Government offices', ico: '\u{1F3DB}\uFE0F', p: 'Departmental networks, e-services access for the public, printers that print, and maintenance contracts with clear terms.', pts: ['Office networks', 'e-Services', 'Maintenance contracts', 'CCTV'] },
  { t: 'Mining & industrial', img: 'assets/photos/mining-office.jpg', alt: 'A site office overlooking red earth', p: 'Site offices and camps: dust, heat, unreliable power and no fibre. Rugged workstations, UPS, Starlink links, and cameras on the gate and the yard.', pts: ['Site office IT', 'Starlink & links', 'UPS & power', 'CCTV & access', 'Camp Wi-Fi'] },
  { t: 'Retail shops', img: 'assets/photos/shop-consult.jpg', alt: 'A consultant with a shop owner in a grocery shop', p: 'Cameras on the till and the stockroom, a point-of-sale that works, Wi-Fi for mobile money, and someone to call when it stops.', pts: ['CCTV', 'Point of sale', 'Wi-Fi', 'Support'] },
  { t: 'Homes', img: 'assets/photos/home-internet.jpg', alt: 'A technician mounting a dish on a house', p: 'Internet that reaches every room, cameras you can check from work, and a home network set up once and properly.', pts: ['Starlink & internet', 'Home Wi-Fi', 'Cameras', 'Computer repair'] },
  { t: 'Communities', img: 'assets/photos/training.jpg', alt: 'Young people learning at computers', p: 'Free basic IT training for youth, digital literacy for adults, and the Solwezi Connect marketplace so skills turn into work.', pts: ['Free youth training', 'Digital literacy', 'Solwezi Connect'] },
];
pages.push({
  file: 'solutions.html',
  title: 'Solutions by Industry | Ginger Tec Solutions, Solwezi',
  desc: 'Technology for every environment in Solwezi District: office networks, school computer rooms, NGO field connectivity, government e-services, mining site offices, retail CCTV, home internet and community training.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Solutions</span>
      <h1>Technology for Every Environment</h1>
      <p>Different buildings, the same problem: the work stops when the technology does. Here is what we put in place for each.</p>
      <div class="phero__row">${btnQuote()}${btnWa()}</div>
    </div>
  </section>
  <section class="sec">
    <div class="shell">
      ${SOL.map((s) => `<article class="sol rv" id="${slug(s.t)}">
        <div class="sol__art${s.img ? '' : ' sol__art--flat'}">${s.img ? `<img src="${s.img}" alt="${s.alt}" loading="lazy" width="1200" height="900">` : `<span aria-hidden="true">${s.ico}</span>`}</div>
        <div>
          <h2>${s.t}</h2>
          <p>${s.p}</p>
          <ul>${s.pts.map((x) => `<li>${x}</li>`).join('')}</ul>
          <a class="btn btn--primary btn--sm" href="contact.html#assessment">Get a free assessment</a>
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>
  ${cta()}
`,
});

// ---- projects
pages.push({
  file: 'projects.html',
  title: 'Technology Projects in Solwezi | Ginger Tec Solutions',
  desc: 'The kinds of technology projects Ginger Tec Solutions delivers in Solwezi District: network installations, CCTV, business IT setups, Wi-Fi, Starlink and computer and server setups.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Projects</span>
      <h1>Technology Projects</h1>
      <p>What each kind of job involves, where we do it, and what you are left with. Photographs on this page are illustrative; real project photographs are added as clients give permission.</p>
      <div class="phero__row">${btnQuote()}${btnWa()}</div>
    </div>
  </section>
  <section class="sec">
    <div class="shell">
      ${projectCards()}
      <p class="projs__note rv">Honesty note: we do not show a job we did not do. Until a client agrees to have their site photographed and named, cards describe the type of work only.</p>
    </div>
  </section>
  ${cta('Have a project like one of these?', 'Send a photo of the site on WhatsApp and we will tell you what it needs and what it costs.')}
`,
});

// ---- about
pages.push({
  file: 'about.html',
  title: 'About Ginger Tec Solutions | Zambian Technology Company, Solwezi',
  desc: 'Ginger Tec Solutions is a Zambian technology and innovation company in Solwezi District, making technology, skills and innovative solutions accessible to individuals, businesses and communities.',
  jsonld: { '@context': 'https://schema.org', '@type': 'AboutPage', url: BASE + 'about.html', about: { '@id': BASE + '#business' } },
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">About us</span>
      <h1>Technology. Innovation. Opportunity.</h1>
      <p>${NAME} is a Zambian technology and innovation company based in Solwezi District. We make technology, skills and innovative solutions more accessible to individuals, businesses and communities, and we have been doing it here for five years.</p>
      <div class="phero__row">${btnQuote()}<a class="btn btn--onDeep" href="services.html">See our services</a></div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      <div class="feat">
        <div class="rv">
          <span class="kicker">What we are for</span>
          <h2 class="h2">The work is the job. The district is the point.</h2>
          <p class="lede">We install networks, cameras and internet because businesses in Solwezi need them to run. We teach because the district needs people who can run them. Both are the same mission.</p>
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
        </figure>
      </div>
    </div>
  </section>

  <section class="sec sec--deep">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">Our commitments</span>
        <h2 class="h2">Three things underneath everything we install</h2>
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
          <p class="lede">Mining contractors, SMEs, schools, lodges, shops, NGOs and government institutions across Solwezi District. Different buildings, the same problem: the work stops when the connection does.</p>
          <p style="margin-top:22px"><a class="btn btn--primary" href="solutions.html">Solutions by environment</a></p>
        </div>
        <figure class="feat__art rv">
          <img src="assets/photos/shop-consult.jpg" alt="A consultant showing a shop owner something on a tablet in a Solwezi grocery shop" loading="lazy" width="1200" height="900">
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
  file: 'marketplace.html',
  title: 'Solwezi Connect Marketplace | Find Services & Work in Solwezi',
  desc: 'Solwezi Connect is the Ginger Tec digital marketplace for Solwezi: hire a vehicle, find a cleaner or helper, request a delivery, rent a house, find skilled workers, post and find jobs. Free to join.',
  body: `
  <section class="phero">
    <div class="shell phero__in rv">
      <span class="kicker">Marketplace</span>
      <h1>Find Services. Find Opportunities. Connect Locally.</h1>
      <p>A digital marketplace connecting people, businesses and service providers across Solwezi. Built by ${NAME}, live now, and free to join.</p>
      <div class="phero__row">
        <a class="btn btn--primary" href="${APP}">Explore the marketplace</a>
        <a class="btn btn--onDeep" href="${APP}/post">Post a job</a>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="shell">
      <div class="sec__head rv">
        <span class="kicker">How it works</span>
        <h2 class="h2">Three steps, one phone</h2>
      </div>
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
        </figure>
      </div>
    </div>
  </section>
  ${cta('Businesses: get listed', 'A free listing in the Solwezi Connect directory puts your shop, lodge or service in front of people searching for it.')}
`,
});

// ---- contact
pages.push({
  file: 'contact.html',
  title: 'Contact Ginger Tec Solutions | Free Quote, Solwezi',
  desc: 'Contact Ginger Tec Solutions in Solwezi: WhatsApp +260 960 884 708, call +260 571 496 842, or request a free technology assessment for your home, business or organisation.',
  jsonld: { '@context': 'https://schema.org', '@type': 'ContactPage', url: BASE + 'contact.html', about: { '@id': BASE + '#business' } },
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

  <section class="sec sec--deep assess" id="assessment">
    <div class="shell">
      <div class="assess__grid">
        <div class="rv">
          <span class="kicker">Free technology assessment</span>
          <h2 class="h2">Not Sure What Technology You Need?</h2>
          <p class="lede">Tell us what you're trying to achieve. We'll help you identify the right technology solution for your home, business or organisation.</p>
          <ul class="assess__pts">
            <li>A straight answer, not a sales pitch</li>
            <li>A clear price before any work starts</li>
            <li>No travel charges inside Solwezi District</li>
            <li>Urgent? A site down is a phone call, not a form: ${PHONE}</li>
          </ul>
        </div>
        <div class="formwrap rv">
          ${assessForm('quote-form')}
        </div>
      </div>
    </div>
  </section>

  ${faqSection()}
`,
});

// ---- privacy
pages.push({
  file: 'privacy.html',
  title: 'Privacy Policy | Ginger Tec Solutions',
  desc: 'How Ginger Tec Solutions handles the information you share with us through this website, WhatsApp, phone and email.',
  body: `
  <section class="phero"><div class="shell phero__in rv"><span class="kicker">Legal</span><h1>Privacy Policy</h1><p>What we collect, why, and what we do with it. Written to be read.</p></div></section>
  <section class="sec"><div class="shell legal rv">
    <p class="updated">Last updated 15 September 2026</p>
    <h2>Who we are</h2>
    <p>${NAME}, Solwezi District, North-Western Province, Zambia. Contact: ${EMAIL}, WhatsApp ${WA}.</p>
    <h2>What we collect</h2>
    <ul>
      <li><strong>What you send us.</strong> When you use a form on this site, WhatsApp us, call or email, we receive what you give us: typically a name, phone number, email address, location and a description of what you need.</li>
      <li><strong>Nothing automatically.</strong> This website sets no cookies and runs no analytics or advertising trackers. Our web host may keep standard server logs (IP address, pages requested) for security.</li>
    </ul>
    <h2>Why we use it</h2>
    <p>To reply to you, quote for work, do the work, and keep records of it. We do not sell or rent your details, and we do not send marketing you did not ask for.</p>
    <h2>Forms on this site</h2>
    <p>Until a form service is connected, submitting a form opens your own email app with the message addressed to us; nothing is stored on this website. If we later connect a form service, submissions pass through that provider to reach our inbox.</p>
    <h2>Solwezi Connect</h2>
    <p>Our marketplace at <a href="${APP}">connect.gingertecsolutions.store</a> is a separate service with its own account system and its own privacy terms, shown there.</p>
    <h2>Your rights</h2>
    <p>Ask us what we hold about you, ask us to correct it, or ask us to delete it, and we will, unless the law or an active job requires us to keep it. Write to ${EMAIL}.</p>
    <h2>Changes</h2>
    <p>If this policy changes, the date at the top changes with it.</p>
  </div></section>`,
});

// ---- terms
pages.push({
  file: 'terms.html',
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

// ---- 404
pages.push({
  file: '404.html',
  title: 'Page not found | Ginger Tec Solutions',
  desc: 'That page is not here. The rest of the site is.',
  body: `
  <section class="phero"><div class="shell phero__in rv"><span class="kicker">404</span><h1>That page is not here</h1><p>The link may be old, or mistyped. Everything we do is one tap away.</p>
  <div class="phero__row"><a class="btn btn--primary" href="index.html">Home</a><a class="btn btn--onDeep" href="services.html">Services</a>${btnWa()}</div></div></section>`,
});

// ---------------------------------------------------------------- write
for (const p of pages) {
  const html = shell(p);
  fs.writeFileSync(path.join(OUT, p.file), html, 'utf8');
  console.log(p.file.padEnd(18), Math.round(html.length / 1024) + ' KB');
}

// sitemap
const today = '2026-09-15';
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.filter((p) => p.file !== '404.html').map((p) => `  <url><loc>${BASE}${p.file === 'index.html' ? '' : p.file}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sm);
console.log('sitemap.xml         ', pages.length - 1, 'urls');
