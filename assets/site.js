/* ==========================================================================
   Ginger Tec Solutions - shared behaviour for every page
   Plain vanilla JS. No framework, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var reduceQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return reduceQ.matches; };

  /* ---------------------------------------------------------------- header */
  var hdr = document.querySelector('.hdr');
  var burger = document.querySelector('.burger');

  if (hdr) {
    var darkTop = document.querySelector('.hero, .phero');   // the dark section at the top
    var stuckState = null;                       // delta-gated: only write on change
    var darkState = null;

    var onHdrScroll = function () {
      var want = window.scrollY > 8;
      if (want !== stuckState) {
        stuckState = want;
        hdr.classList.toggle('stuck', want);
      }
      if (darkTop) {
        var overDark = darkTop.getBoundingClientRect().bottom > 78;
        if (overDark !== darkState) {
          darkState = overDark;
          hdr.classList.toggle('hdr--dark', overDark);
        }
      }
    };
    window.addEventListener('scroll', onHdrScroll, { passive: true });
    window.addEventListener('resize', onHdrScroll, { passive: true });
    onHdrScroll();
  }

  if (burger && hdr) {
    burger.addEventListener('click', function () {
      var open = hdr.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // a tap on any drawer link closes the drawer
    var drawer = document.querySelector('.drawer');
    if (drawer) {
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          hdr.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
    // a widened window leaves no drawer hanging open
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (e) {
      if (e.matches) {
        hdr.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------- entrance choreography */
  var revealables = document.querySelectorAll('.rv, .stag');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        revealObs.unobserve(el);
        // retire the stagger delays once the entrance has finished,
        // or every later hover on those children lags forever
        if (el.classList.contains('stag')) {
          window.setTimeout(function () { el.classList.add('done'); }, 1400);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealObs.observe(el); });

    // section-scoped ambient life: only animates while the section is on screen
    var liveObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('live', en.isIntersecting); });
    }, { rootMargin: '10% 0px 10% 0px' });
    document.querySelectorAll('.sec').forEach(function (s) { liveObs.observe(s); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in', 'done'); });
    document.querySelectorAll('.sec').forEach(function (s) { s.classList.add('live'); });
  }

  // nothing animates behind a hidden tab
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ------------------------------------------- the signature: signal line */
  var rail = document.querySelector('.rail');
  var railNodes = rail ? [].slice.call(rail.querySelectorAll('.rail__node')) : [];
  var railRaf = null;
  var railShown = -1;

  railNodes.forEach(function (n) { n.hitState = null; });

  function pageProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / h));
  }

  function drawRail() {
    railRaf = null;
    if (!rail) return;
    var p = pageProgress();
    if (Math.abs(p - railShown) < 0.002) return;   // only write on change
    railShown = p;
    rail.style.setProperty('--rail', p.toFixed(4));
    railNodes.forEach(function (n) {
      var at = parseFloat(n.dataset.at || '0');
      var hit = p >= at;
      if (hit !== n.hitState) { n.hitState = hit; n.classList.toggle('hit', hit); }
    });
  }

  function onRailScroll() {
    if (railRaf === null) railRaf = window.requestAnimationFrame(drawRail);
  }

  if (rail) {
    if (reduced()) {
      rail.style.setProperty('--rail', '1');
      railNodes.forEach(function (n) { n.classList.add('hit'); n.hitState = true; });
    } else {
      window.addEventListener('scroll', onRailScroll, { passive: true });
      window.addEventListener('resize', onRailScroll, { passive: true });
      drawRail();
    }
  }

  /* -------------------------------- the interactive moment: hold to connect */
  var holder = document.querySelector('.holder');

  if (holder) {
    var holdBtn = holder.querySelector('.holder__btn');
    var liveLine = holder.querySelector('.holder__track .live');
    var hint = holder.querySelector('.holder__hint');
    var holdV = 0;            // 0..1
    var holding = false;
    var holdRaf = null;
    var holdLast = 0;
    var holdWritten = -1;
    var RISE = 1 / 1500;      // full connect in about 1.5s of holding
    var FALL = 1 / 900;       // releasing eases back down, never snaps

    if (liveLine) holder.style.setProperty('--hlen', liveLine.getTotalLength().toFixed(1));

    function writeHold() {
      if (Math.abs(holdV - holdWritten) < 0.004 && holdV !== 0 && holdV !== 1) return;
      holdWritten = holdV;
      holder.style.setProperty('--hold', holdV.toFixed(4));
      var on = holdV >= 0.999;
      if (on !== holder.classList.contains('on')) {
        holder.classList.toggle('on', on);
        if (hint) hint.textContent = on ? 'Connected. We are in Solwezi, ready now.' : 'Press and hold';
        if (holdBtn) holdBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    }

    function holdTick(now) {
      var dt = Math.min(100, now - (holdLast || now));
      holdLast = now;
      holdV += (holding ? RISE : -FALL) * dt;
      if (holdV > 1) holdV = 1;
      if (holdV < 0) holdV = 0;
      writeHold();
      var resting = (holding && holdV === 1) || (!holding && holdV === 0);
      if (resting) { holdRaf = null; holdLast = 0; }
      else holdRaf = window.requestAnimationFrame(holdTick);
    }

    function startHold(e) {
      if (e && e.cancelable) e.preventDefault();
      if (reduced()) { holdV = 1; writeHold(); return; }
      holding = true;
      if (holdRaf === null) holdRaf = window.requestAnimationFrame(holdTick);
    }
    function endHold() {
      holding = false;
      if (holdRaf === null && holdV > 0) holdRaf = window.requestAnimationFrame(holdTick);
    }

    if (holdBtn) {
      holdBtn.addEventListener('pointerdown', startHold);
      holdBtn.addEventListener('pointerup', endHold);
      holdBtn.addEventListener('pointercancel', endHold);
      holdBtn.addEventListener('pointerleave', endHold);
      // keyboard visitors get the same moment
      holdBtn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startHold(); }
      });
      holdBtn.addEventListener('keyup', function (e) {
        if (e.key === ' ' || e.key === 'Enter') endHold();
      });
      holdBtn.addEventListener('blur', endHold);
    }

    // reduced motion gets the finished state with no holding required
    if (reduced()) { holdV = 1; writeHold(); }

    window.gtsPinHold = function () { holding = false; holdV = 1; writeHold(); };
    window.gtsUnpinHold = function () { holdWritten = -1; holdV = 0; writeHold(); };
  }

  /* --------------------------------------------------------------- the form */
  /* Where a visitor's message actually goes.
     Put your Formspree endpoint in FORM_ENDPOINT and messages land in the inbox.
     Until then the visitor's own email app opens, addressed to the business,
     so no enquiry is ever quietly lost. */
  var FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID';
  var MAIL_TO = 'dannykamalondo@gmail.com';

  var form = document.querySelector('#quote-form');

  if (form) {
    var status = form.querySelector('.fstatus');
    var submitBtn = form.querySelector('[type="submit"]');
    var endpointReady = FORM_ENDPOINT.indexOf('REPLACE_WITH_YOUR_FORM_ID') === -1;

    var say = function (kind, msg) {
      if (!status) return;
      status.className = 'fstatus show ' + kind;
      status.textContent = msg;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);

      if (!endpointReady) {
        // the honest fallback: hand the message to the visitor's own email app
        var lines = [
          'Name: ' + (data.get('name') || ''),
          'Email: ' + (data.get('email') || ''),
          'Phone: ' + (data.get('phone') || ''),
          'Service: ' + (data.get('service') || ''),
          '',
          (data.get('message') || '')
        ].join('\n');
        window.location.href = 'mailto:' + MAIL_TO
          + '?subject=' + encodeURIComponent('Website enquiry from ' + (data.get('name') || 'a visitor'))
          + '&body=' + encodeURIComponent(lines);
        say('ok', 'Your email app is opening with the message ready to send. If nothing opens, write to '
          + MAIL_TO + ' or message us on WhatsApp.');
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('bad response');
        form.reset();
        say('ok', 'Thank you. We have your message and will reply shortly. For anything urgent, call +260 571 496 842 or message us on WhatsApp.');
      }).catch(function () {
        say('bad', 'That did not send. Please call +260 571 496 842, message us on WhatsApp, or write to ' + MAIL_TO + '.');
      }).then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
      });
    });
  }

  /* ------------------------------ reduced motion, honoured in both directions */
  function pinToFinalStates() {
    document.querySelectorAll('.rv, .stag').forEach(function (el) { el.classList.add('in', 'done'); });
    if (rail) {
      rail.style.setProperty('--rail', '1');
      railNodes.forEach(function (n) { n.classList.add('hit'); n.hitState = true; });
      window.removeEventListener('scroll', onRailScroll);
      if (railRaf !== null) { window.cancelAnimationFrame(railRaf); railRaf = null; }
    }
    if (window.gtsPinHold) window.gtsPinHold();
    if (window.gtsApplyHeroMode) window.gtsApplyHeroMode();
  }

  function unpinFromFinalStates() {
    if (rail) {
      railShown = -1;
      window.addEventListener('scroll', onRailScroll, { passive: true });
      drawRail();
    }
    if (window.gtsUnpinHold) window.gtsUnpinHold();
    if (window.gtsApplyHeroMode) window.gtsApplyHeroMode();
  }

  reduceQ.addEventListener('change', function (e) {
    if (e.matches) pinToFinalStates();
    else unpinFromFinalStates();
  });

  if (reduced()) pinToFinalStates();

  /* ------------------------------------------------------- the year in the footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
