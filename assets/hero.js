/* ==========================================================================
   Ginger Tec Solutions - the scroll-scrubbed hero (Home page only)

   The visitor scrolls, the signal comes down. Forward on the way down,
   backward on the way up. The page settles where the shot rests.

   The page is complete and good looking with no video at all: the drawn
   scene below carries the whole journey on its own, and that is also what
   ships until the generated footage is dropped in.
   ========================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var stage    = hero.querySelector('.stage');
  var video    = hero.querySelector('.vid');
  var ring     = hero.querySelector('.ring');
  var poster   = hero.querySelector('.poster');
  var sceneEl  = hero.querySelector('.scene');
  var bandEls  = [].slice.call(hero.querySelectorAll('.band'));

  /* THE FOOTAGE SWITCH.
     While this is false the hero runs entirely on the drawn scene below and
     asks the network for nothing, so no failed requests and a clean console.
     When assets/hero-scrub.mp4 and assets/hero-poster.jpg are added, flip this
     to true and set VIDEO_BYTES to the real file size. Nothing else changes. */
  var HAS_FOOTAGE = false;

  var VIDEO_URL   = 'assets/hero-scrub.mp4';
  var POSTER_URL  = 'assets/hero-poster.jpg';
  var VIDEO_BYTES = 6500000;   // fallback when Content-Length is missing

  /* --------------------------------------------------------- the band map */
  /* Ranges are scroll progress through the pinned hero.
     The hero is 520vh tall, so the scroll range is 420vh and one unit of
     progress is 420vh. RAMP of 0.045 is about 19vh of eased edge, which keeps
     every beat readable for six or more normal flicks. The skill's default
     cap of 0.02 is tuned for a much taller chained hero; on a 420vh range it
     would give a 8vh ramp, so this build widens it deliberately. */
  var RAMP = 0.045;

  var BANDS = [
    { el: bandEls[0], a: 0.00, b: 0.32, easeIn: false, easeOut: true  },
    { el: bandEls[1], a: 0.36, b: 0.66, easeIn: true,  easeOut: true  },
    { el: bandEls[2], a: 0.70, b: 1.00, easeIn: true,  easeOut: false }
  ].filter(function (band) { return !!band.el; });

  BANDS.forEach(function (band) {
    band.op = -1;    // cached opacity, so the DOM is only written on change
    band.k  = -1;    // cached assembly progress
    var attr = band.el.getAttribute('data-ramp');
    band.ramp = attr ? parseFloat(attr) : RAMP;
  });

  /* ------------------------------------------------------ text splitting */
  /* Seeded, so the "random" thresholds are identical on every load. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  function splitWords(el, seed, spread) {
    if (!el || el.dataset.split === '1') return;
    var text = el.textContent;
    var words = text.split(/(\s+)/);
    var rand = rng(seed);
    var visible = words.filter(function (w) { return w.trim().length; }).length;

    var sr = document.createElement('span');
    sr.className = 'vh';
    sr.textContent = text;

    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');

    var i = 0;
    words.forEach(function (chunk) {
      if (!chunk.trim().length) { vis.appendChild(document.createTextNode(chunk)); return; }
      var w = document.createElement('span');
      w.className = 'w';
      w.textContent = chunk;
      var th = (visible > 1 ? (i / (visible - 1)) : 0) * spread + rand() * 0.04;
      w.style.setProperty('--th', th.toFixed(3));
      vis.appendChild(w);
      i++;
    });

    el.textContent = '';
    el.appendChild(sr);
    el.appendChild(vis);
    el.dataset.split = '1';
  }

  BANDS.forEach(function (band, n) {
    var target = band.el.querySelector('h1, .tag, .settle');
    var spread = band.el.getAttribute('data-spread');
    splitWords(target, 20260903 + n * 7919, spread ? parseFloat(spread) : 0.42);
  });

  /* ---------------------------------------------------------- the drawing */
  /* The scene is one SVG. Progress moves the falling signal down the fiber,
     drifts the camera, and wakes the rack lamps in sequence at the end. */
  var fiber   = sceneEl ? sceneEl.querySelector('#fiber') : null;
  var trail   = sceneEl ? sceneEl.querySelector('#trail') : null;
  var spark   = sceneEl ? sceneEl.querySelector('#spark') : null;
  var camera  = sceneEl ? sceneEl.querySelector('#camera') : null;
  var lamps   = sceneEl ? [].slice.call(sceneEl.querySelectorAll('.lamp')) : [];
  var glow    = sceneEl ? sceneEl.querySelector('#landglow') : null;
  var fiberLen = 0;

  if (fiber) {
    fiberLen = fiber.getTotalLength();
    if (trail) {
      trail.setAttribute('stroke-dasharray', fiberLen.toFixed(1));
      trail.setAttribute('stroke-dashoffset', fiberLen.toFixed(1));
    }
  }

  var sceneShown = -1;

  function drawScene(p) {
    if (!sceneEl || Math.abs(p - sceneShown) < 0.0015) return;
    sceneShown = p;

    if (trail) trail.setAttribute('stroke-dashoffset', (fiberLen * (1 - p)).toFixed(1));

    if (spark && fiberLen) {
      var pt = fiber.getPointAtLength(fiberLen * p);
      spark.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')');
      spark.setAttribute('opacity', (p > 0.985 ? (1 - p) * 66 : 1).toFixed(3));
    }

    // a slow camera descent so the whole frame moves with the scroll
    if (camera) camera.setAttribute('transform', 'translate(0,' + (-p * 46).toFixed(1) + ')');

    // the rack wakes one lamp at a time, and only at the arrival
    for (var i = 0; i < lamps.length; i++) {
      var t = 0.74 + i * 0.055;
      var on = Math.min(1, Math.max(0, (p - t) / 0.05));
      lamps[i].setAttribute('opacity', (0.16 + 0.84 * on).toFixed(3));
    }

    if (glow) glow.setAttribute('opacity', (0.14 + 0.86 * Math.min(1, Math.max(0, (p - 0.6) / 0.34))).toFixed(3));

    // the scroll cue has done its job once the journey is under way
    if (stage) {
      var past = p > 0.07;
      if (past !== cueHidden) { cueHidden = past; stage.classList.toggle('past-intro', past); }
    }
  }
  var cueHidden = null;

  /* ------------------------------------------------------- band captions */
  function smoothstep(p, e0, e1) {
    var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }

  function updateCaptions(p) {
    for (var i = 0; i < BANDS.length; i++) {
      var band = BANDS[i];
      var f = Math.min(band.ramp, (band.b - band.a) / 3);
      var op = 1;
      if (band.easeIn)  op *= smoothstep(p, band.a, band.a + f);
      if (band.easeOut) op *= (1 - smoothstep(p, band.b - f, band.b));
      if (p < band.a && band.easeIn) op = 0;
      if (p > band.b && band.easeOut) op = 0;

      if (Math.abs(op - band.op) > 0.004 || (op === 0 && band.op !== 0) || (op === 1 && band.op !== 1)) {
        band.op = op;
        band.el.style.opacity = op.toFixed(3);
        band.el.style.visibility = op < 0.004 ? 'hidden' : 'visible';
      }

      var k = clamp01((p - band.a) / band.ramp);
      if (i === 0) k = Math.max(k, loadK);   // band one opens already settled
      if (Math.abs(k - band.k) > 0.008 || k === 0 || k === 1) {
        band.k = k;
        band.el.style.setProperty('--k', k.toFixed(3));
      }
    }
    drawScene(p);
  }

  /* band one gets a one-time load ramp that hands over to scroll */
  var loadK = 0;
  var loadStart = 0;
  function loadRamp(now) {
    if (!loadStart) loadStart = now;
    loadK = clamp01((now - loadStart) / 900);
    updateCaptions(lastProgress);
    if (loadK < 1) window.requestAnimationFrame(loadRamp);
  }

  /* --------------------------------------------------------- seek gating */
  var seekBusy = false;
  var pendingTime = null;

  function requestSeek(t) {
    if (!video || !video.duration || !isFinite(video.duration)) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }

  if (video) {
    video.addEventListener('seeked', function () {
      seekBusy = false;
      if (pendingTime !== null) {
        var t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    });
    video.addEventListener('error', function () {   // the deadlock escape
      seekBusy = false;
      pendingTime = null;
      failVideo();
    });
  }

  /* ----------------------------------------------------- the drive loop */
  var target = 0, shown = 0, rafId = null, lastTick = 0;
  var lastProgress = 0;
  var heroOnScreen = true;

  function heroProgress() {
    var range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    var y = -hero.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, y / range));
  }

  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) {
      shown = target;
      rafId = null;
      lastTick = 0;
    } else {
      rafId = window.requestAnimationFrame(tick);
    }
    lastProgress = shown;
    if (video && video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown);
  }

  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = window.requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroOnScreen = entries[0].isIntersecting;
      if (heroOnScreen && rafId === null && scrubOn) rafId = window.requestAnimationFrame(tick);
    }, { rootMargin: '10% 0px 10% 0px' }).observe(hero);
  }

  /* ---------------------------------------------------- the video loading */
  var started = false;

  function failVideo() {
    if (!stage) return;
    stage.classList.add('video-failed');   // the drawn scene simply carries on
    if (ring && !ring.dataset.swapped) {
      ring.dataset.swapped = '1';
      ring.style.opacity = '0';
    }
  }

  function startBlobFetch() {
    if (started) return;
    started = true;
    loadHeroBlob().catch(failVideo);
  }

  function initHeroOnce() {
    if (initHeroOnce.done) return;
    initHeroOnce.done = true;

    window.requestAnimationFrame(loadRamp);

    if (!HAS_FOOTAGE) {
      // nothing to fetch: the drawn scene is the hero, and it is already here
      failVideo();
      return;
    }

    // the poster wins the bandwidth race by design: paint it, then fetch
    var img = new Image();
    img.onload = function () {
      if (poster) {
        poster.style.backgroundImage = "url('" + POSTER_URL + "')";
        if (stage) stage.classList.add('poster-ready');
      }
      startBlobFetch();
    };
    img.onerror = startBlobFetch;
    img.src = POSTER_URL;
    window.setTimeout(startBlobFetch, 4000);   // a hung poster never blocks forever
  }

  function loadHeroBlob() {
    if (!video) return Promise.reject(new Error('no video element'));

    var ctrl = new AbortController();
    var watchdog = window.setTimeout(function () { ctrl.abort(); }, 20000);

    return fetch(VIDEO_URL, { signal: ctrl.signal }).then(function (res) {
      if (!res.ok) throw new Error('video not available');
      var total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
      if (!res.body || !res.body.getReader) {
        return res.blob().then(function (b) { window.clearTimeout(watchdog); return b; });
      }
      var reader = res.body.getReader();
      var chunks = [];
      var got = 0, lastRing = 0;

      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) { window.clearTimeout(watchdog); return new Blob(chunks); }
          window.clearTimeout(watchdog);
          watchdog = window.setTimeout(function () { ctrl.abort(); }, 20000);
          chunks.push(r.value);
          got += r.value.length;
          var frac = Math.min(1, got / total);
          var now = performance.now();
          if (ring && (now - lastRing > 100 || frac === 1)) {
            lastRing = now;
            ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
          }
          return pump();
        });
      })();
    }).then(function (blob) {
      if (ring) ring.style.setProperty('--ld', 0);
      video.src = URL.createObjectURL(blob);
      video.load();
      video.addEventListener('canplay', function () {
        requestSeek(heroProgress() * video.duration);
        if (stage) stage.classList.add('video-ready');
      }, { once: true });
    });
  }

  /* ------------------------------------------ THE STATIC HERO GATE (five) */
  /* Character for character the same five strings as the media query block
     in site.css. If these two lists ever drift, one side loads assets the
     other side hides. */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return window.matchMedia(q); });
  var scrubOn = false;

  function pinBandsToFinal() {
    // the composed static layout: every beat shown, nothing scroll driven
    BANDS.forEach(function (band) {
      band.op = -1; band.k = -1;
      band.el.style.opacity = '';
      band.el.style.visibility = '';
      band.el.style.setProperty('--k', '1');
    });
    drawScene(1);
    sceneShown = -1;
  }

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    BANDS.forEach(function (band) { band.op = -1; band.k = -1; });
    sceneShown = -1;
    updateCaptions(heroProgress());
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; }
    pinBandsToFinal();
  }

  function applyHeroMode() {
    var gated = MQLS.some(function (m) { return m.matches; });
    // In the static layout the frame is much taller than it is wide, so anchor
    // the crop to the sky. Anchored to the middle, the equipment at the bottom
    // of the scene lands right behind the buttons.
    if (sceneEl) {
      sceneEl.setAttribute('preserveAspectRatio', gated ? 'xMidYMin slice' : 'xMidYMid slice');
    }
    if (gated) disableScrub();
    else enableScrub();
  }

  MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });
  window.gtsApplyHeroMode = applyHeroMode;

  applyHeroMode();
})();
