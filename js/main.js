/* DanEnergy — site interactions */
(function () {
  'use strict';

  // ---------- Year in footer ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  var menuToggle = document.getElementById('menuToggle');
  var navLinks   = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Theme toggle (dark / light, persisted) ----------
  var themeToggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('danenergy-theme'); } catch (e) {}
  if (stored) root.setAttribute('data-theme', stored);
  if (themeToggle) {
    themeToggle.textContent = (root.getAttribute('data-theme') === 'light') ? 'LIGHT' : 'DARK';
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', current);
      themeToggle.textContent = current === 'light' ? 'LIGHT' : 'DARK';
      try { localStorage.setItem('danenergy-theme', current); } catch (e) {}
    });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Active nav link on scroll ----------
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && 'IntersectionObserver' in window) {
    var navMap = {};
    navAnchors.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id) navMap[id] = a;
    });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting && navMap[id]) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          navMap[id].classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  // ---------- Contact form (Web3Forms) ----------
  var form   = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      var data = new FormData(form);
      var key = form.querySelector('input[name="access_key"]').value;

      if (!key || key === 'YOUR_ACCESS_KEY') {
        status.className = 'form-status error';
        status.textContent = 'Form is not yet configured. Please email hello@danenergy.io directly. (Owner: register a free Web3Forms key and replace YOUR_ACCESS_KEY in index.html.)';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (json) {
          if (json.success) {
            status.className = 'form-status success';
            status.textContent = 'Thanks — your message has been sent. I\'ll reply within two business days.';
            form.reset();
          } else {
            status.className = 'form-status error';
            status.textContent = (json.message || 'Something went wrong. Please try again or email hello@danenergy.io.');
          }
        })
        .catch(function () {
          status.className = 'form-status error';
          status.textContent = 'Network error. Please email hello@danenergy.io directly.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'Send message';
        });
    });
  }
})();
