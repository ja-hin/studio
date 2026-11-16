/* Sparsh K. Enterprises - shared behaviour: mobile nav, hero waveform, counters, testimonial slider */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Hero waveform ---------- */
  var canvas = document.getElementById('waveform');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w, h, t = 0, raf;
    var bars = 140;
    var mouse = { x: 0.5, active: false };

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var mid = h * 0.55;
      var gap = w / bars;
      for (var i = 0; i < bars; i++) {
        var x = i * gap + gap / 2;
        var n = i / bars;
        var env = Math.sin(n * Math.PI);                         // taper at edges
        var a = Math.sin(n * 18 + t * 1.1) * 0.5 + Math.sin(n * 7 - t * 0.7) * 0.35 + Math.sin(n * 41 + t * 2.3) * 0.15;
        var boost = mouse.active ? Math.max(0, 1 - Math.abs(n - mouse.x) * 6) : 0;
        var amp = (Math.abs(a) * 0.5 + 0.08 + boost * 0.4) * env * h * 0.42;
        var alpha = 0.08 + env * 0.22 + boost * 0.3;
        ctx.fillStyle = 'rgba(4,107,210,' + alpha.toFixed(3) + ')';
        var bw = Math.max(2, gap * 0.45);
        roundRect(x - bw / 2, mid - amp, bw, amp * 2, bw / 2);
      }
      t += reduceMotion ? 0 : 0.012;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    function roundRect(x, y, bw, bh, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + bw, y, x + bw, y + bh, r);
      ctx.arcTo(x + bw, y + bh, x, y + bh, r);
      ctx.arcTo(x, y + bh, x, y, r);
      ctx.arcTo(x, y, x + bw, y, r);
      ctx.closePath();
      ctx.fill();
    }

    var hero = canvas.parentElement;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width; mouse.active = true;
    });
    hero.addEventListener('pointerleave', function () { mouse.active = false; });

    window.addEventListener('resize', function () { size(); if (reduceMotion) draw(); });
    size();
    draw();

    // pause when hero is out of view
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }).observe(canvas);
    }
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Testimonial slider ---------- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var track = slider.querySelector('.slider-track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById('sliderDots');
    var prev = document.getElementById('prevSlide');
    var next = document.getElementById('nextSlide');
    var index = 0;

    function perView() {
      var vw = window.innerWidth;
      return vw <= 860 ? 1 : vw <= 1024 ? 2 : 3;
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Testimonial ' + (i + 1));
        b.addEventListener('click', (function (n) { return function () { go(n); }; })(i));
        dotsWrap.appendChild(b);
      }
    }
    function go(n) {
      index = Math.max(0, Math.min(n, maxIndex()));
      var gap = 24;
      var slideW = slides[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(' + (-(slideW + gap) * index) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.setAttribute('aria-selected', String(i === index));
      });
      prev.disabled = index === 0;
      next.disabled = index === maxIndex();
    }

    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });

    var startX = null;
    slider.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    slider.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
      startX = null;
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); go(index); }, 120);
    });

    buildDots();
    go(0);
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
