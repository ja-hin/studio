/* Sparsh K. Enterprises - inner page behaviour: gallery filter, lightbox, forms */
(function () {
  'use strict';

  /* ---------- Gallery filters ---------- */
  var filters = document.querySelector('.gallery-filters');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (filters && items.length) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filters.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-cat') === f;
        it.classList.toggle('is-hidden', !show);
      });
    });
  }

  /* ---------- Lightbox (gallery grid and studio photo strips) ---------- */
  var zoomables = Array.prototype.slice.call(document.querySelectorAll('.gallery-item, .studio-strip figure'));
  if (zoomables.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox-prev" aria-label="Previous image"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img alt="">' +
      '<button class="lightbox-next" aria-label="Next image"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    var img = lb.querySelector('img');
    var cap = lb.querySelector('.lightbox-caption');
    var current = 0;
    var lastFocus = null;

    function visible() {
      return zoomables.filter(function (z) { return !z.classList.contains('is-hidden'); });
    }
    function show(i) {
      var list = visible();
      if (!list.length) return;
      current = (i + list.length) % list.length;
      var el = list[current];
      var src = el.querySelector('img');
      img.src = src.getAttribute('data-full') || src.src;
      img.alt = src.alt || '';
      var c = el.querySelector('figcaption');
      cap.textContent = c ? c.textContent : (src.alt || '');
    }
    function open(el) {
      lastFocus = document.activeElement;
      show(visible().indexOf(el));
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox-close').focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    zoomables.forEach(function (z) {
      z.setAttribute('tabindex', '0');
      z.setAttribute('role', 'button');
      z.addEventListener('click', function () { open(z); });
      z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(z); } });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Forms ----------
     Forms post to the URL in their action attribute. Until a real endpoint
     (for example Formspree or Web3Forms) replaces FORM_ENDPOINT_NOT_SET,
     the page shows a notice instead of sending. */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-form]'), function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      if (form.action.indexOf('FORM_ENDPOINT_NOT_SET') !== -1) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status warn';
          status.textContent = 'This form is not connected yet. Please call or email us using the details on this page.';
        }
        return;
      }
      e.preventDefault();
      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return r; })
        .then(function () {
          form.reset();
          if (status) { status.className = 'form-status ok'; status.textContent = 'Thanks, your message has been sent. We will reply shortly.'; }
        })
        .catch(function () {
          if (status) { status.className = 'form-status warn'; status.textContent = 'Something went wrong. Please try again or email us directly.'; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Send message'; } });
    });
  });
})();
