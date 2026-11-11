// ─────────────────────────────────────────────────────────────
// Artist links. Each act has a short link, its "slug":
//   /the-doorknobs         fan landing page (qr/index.html)
//   /the-doorknobs/songs   fan song list   (request/index.html)
// Firebase Hosting rewrites those addresses to the two pages
// (see firebase.json). A local server can't rewrite, so the
// pages also accept /qr/?a=the-doorknobs and /request/?a=...
//
// The slug rules here must match database.rules.json.
// ─────────────────────────────────────────────────────────────
(function () {
  var RESERVED = ['qr','request','requests','songs','setup','signup','stage','login','signin','logout','admin','api','app','demo','help','about','terms','privacy','settings','account','images','docs','venue','venues','tip','tips','pay','live','www','static','assets','artist','artists','index','tests'];
  var SLUG_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  // "The Doorknobs" -> "the-doorknobs", "Beyoncé & Co." -> "beyonce-and-co"
  function slugify(name) {
    return String(name || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+/, '').slice(0, 30).replace(/-+$/, '');
  }

  // Returns '' if the slug is fine, otherwise a short reason to show the artist.
  function slugProblem(slug) {
    if (!slug) return 'Add a link name.';
    if (slug.length < 3) return 'Use at least 3 characters.';
    if (slug.length > 30) return 'Use 30 characters or fewer.';
    if (!SLUG_RE.test(slug) || slug.indexOf('--') !== -1) return 'Use lowercase letters, numbers and single hyphens.';
    if (RESERVED.indexOf(slug) !== -1) return 'That link is reserved. Try another.';
    return '';
  }

  // The slug this page was opened with, or '' if none.
  function currentSlug() {
    var parts = location.pathname.split('/').filter(Boolean);
    var first = (parts[0] || '').toLowerCase();
    var raw = (first === 'qr' || first === 'request' || first === '')
      ? (new URLSearchParams(location.search).get('a') || '')
      : first;
    try { raw = decodeURIComponent(raw); } catch (e) {}
    return raw.toLowerCase();
  }

  // Fan pages keep using whichever form they were opened with. The stage view (at /)
  // and the setup page (at /setup) use the short form, except on a local server,
  // which can't rewrite addresses.
  function useQueryForm() {
    var first = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
    if (first === 'qr' || first === 'request') return true;
    if (first && first !== 'setup') return false;
    return LOCAL;
  }

  function fanHref(slug) {
    if (!slug) return '/qr';
    return useQueryForm() ? '/qr/?a=' + encodeURIComponent(slug) : '/' + slug;
  }
  function songsHref(slug) {
    if (!slug) return '/request';
    return useQueryForm() ? '/request/?a=' + encodeURIComponent(slug) : '/' + slug + '/songs';
  }
  // The link an artist shares and prints. Always the short form.
  function shareUrl(slug) { return location.origin + '/' + slug; }

  // Look up an act by slug. Resolves to {artistId, settings} or null.
  // If the slug is an old link for an act that has since changed its link,
  // `moved` holds the current slug so the page can redirect.
  function resolve(db, slug) {
    if (slugProblem(slug)) return Promise.resolve(null);
    return db.ref('slugs/' + slug).once('value').then(function (s) {
      var artistId = s.val();
      if (!artistId) return null;
      return db.ref('artists/' + artistId + '/settings').once('value').then(function (st) {
        var settings = st.val();
        if (!settings) return null;
        return { artistId: artistId, settings: settings, moved: settings.slug && settings.slug !== slug ? settings.slug : '' };
      });
    });
  }

  window.ArtistLink = { slugify: slugify, slugProblem: slugProblem, currentSlug: currentSlug, fanHref: fanHref, songsHref: songsHref, shareUrl: shareUrl, resolve: resolve };
})();
