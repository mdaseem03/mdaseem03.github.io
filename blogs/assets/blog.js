/* Shared blog behaviour: theme switch (same storage key as the home page), mobile menu, category filter */
(function () {
  var root = document.documentElement;
  var btn  = document.getElementById('themeBtn');
  var icon = document.getElementById('themeIcon');
  var text = document.getElementById('themeText');

  function setTheme(t) {
    var dark = t === 'dark';
    root.setAttribute('data-theme', t);
    icon.textContent = dark ? '☾' : '☀';
    text.textContent = dark ? 'Dark' : 'Light';
    btn.setAttribute('aria-checked', dark ? 'true' : 'false');
    try { localStorage.setItem('pf-theme', t); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('pf-theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved);
  } else {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  btn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  var menuBtn  = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Category filter — only on the listing page. The active category lives in the URL hash (#tools, #ai-security …)
  var filter = document.getElementById('catFilter');
  if (!filter) return;
  var cards   = Array.prototype.slice.call(document.querySelectorAll('.post-card'));
  var buttons = Array.prototype.slice.call(filter.querySelectorAll('.cat-btn'));
  var empty   = document.getElementById('emptyState');
  var emptyCat = document.getElementById('emptyCat');

  buttons.forEach(function (b) {
    var cat = b.getAttribute('data-cat');
    var n = cat === 'all' ? cards.length : cards.filter(function (c) { return c.getAttribute('data-category') === cat; }).length;
    b.querySelector('.cat-count').textContent = n;
  });

  function apply(cat) {
    if (!buttons.some(function (b) { return b.getAttribute('data-cat') === cat; })) cat = 'all';
    var shown = 0;
    cards.forEach(function (c) {
      var match = cat === 'all' || c.getAttribute('data-category') === cat;
      c.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach(function (b) {
      var active = b.getAttribute('data-cat') === cat;
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) emptyCat.textContent = cat === 'all' ? '' : ' in ' + b.firstChild.textContent.trim();
    });
    empty.hidden = shown > 0;
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var cat = b.getAttribute('data-cat');
      history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
      apply(cat);
    });
  });
  window.addEventListener('hashchange', function () { apply(location.hash.slice(1) || 'all'); });
  apply(location.hash.slice(1) || 'all');
})();
