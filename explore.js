(function () {
  'use strict';
  // Sample listings shown until the live API (/api/rewards/public/vendors) is reachable.
  var SAMPLE = [
    { name: 'Brew & Bean Café', cat: 'food', tag: 'Specialty coffee & bakes', rewards: { cashback: '5%', stamps: '6 stamps = free coffee' } },
    { name: 'Spice Route Kitchen', cat: 'food', tag: 'South Indian meals', rewards: { coupon: '₹100 off', stamps: '5 stamps = free dessert' } },
    { name: 'Glow Studio', cat: 'salon_beauty', tag: 'Hair, skin & nails', rewards: { cashback: '8%', coupon: '₹150 off' } },
    { name: 'Urban Cuts', cat: 'salon_beauty', tag: "Men's grooming", rewards: { stamps: '8 stamps = free haircut' } },
    { name: 'Style Lane', cat: 'shopping', tag: 'Everyday fashion', rewards: { cashback: '4%', coupon: '10% off' } },
    { name: 'Daily Basket', cat: 'shopping', tag: 'Neighbourhood grocery', rewards: { cashback: '2%' } },
    { name: 'Gadget Hub', cat: 'electronics', tag: 'Phones & accessories', rewards: { coupon: '₹200 off', cashback: '3%' } },
    { name: 'PowerFit Gym', cat: 'fitness', tag: 'Strength & cardio', rewards: { coupon: '1 week free', stamps: '10 visits = free session' } },
    { name: 'Zen Yoga Studio', cat: 'fitness', tag: 'Yoga & meditation', rewards: { stamps: '6 classes = 1 free' } },
    { name: 'CarePlus Pharmacy', cat: 'health', tag: 'Medicines & wellness', rewards: { cashback: '3%' } },
    { name: 'Smile Dental', cat: 'health', tag: 'Family dentistry', rewards: { coupon: '₹300 off cleaning' } },
    { name: 'Pet Pals', cat: 'other', tag: 'Pet food & grooming', rewards: { cashback: '5%', stamps: '5 stamps = free wash' } }
  ];
  var LOGO = [['#f4dfc1', '#7a5a2c'], ['#111111', '#fff'], ['#f8dce4', '#8a3f57'], ['#dcefe4', '#1f6b45'], ['#e6f0fd', '#1f5fbf'], ['#efe8fd', '#6d3fd6']];
  var HERO = ['#9c6b5c', '#5d6a8f', '#2f6b4f', '#9c5a73', '#7a5236'];
  var LABEL = { cashback: 'cashback', coupon: 'coupon', stamps: 'Stamp card' };

  var stores = SAMPLE, state = { category: '', type: '', q: '' };
  var params = new URLSearchParams(location.search);
  state.category = params.get('category') || '';
  state.type = params.get('type') || '';
  state.q = params.get('q') || '';

  var $ = function (id) { return document.getElementById(id); };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function initials(n) { var p = n.trim().split(/\s+/); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  function earn(s) {
    var r = s.rewards, out = [];
    if (r.cashback) out.push(r.cashback + ' cashback');
    if (r.coupon) out.push(r.coupon);
    if (r.stamps) out.push('Stamp card');
    return out.join(' · ');
  }

  function render() {
    var q = state.q.toLowerCase();
    var list = stores.filter(function (s) {
      return (!state.category || s.cat === state.category) &&
        (!state.type || s.rewards[state.type]) &&
        (!q || (s.name + ' ' + s.tag).toLowerCase().indexOf(q) !== -1);
    });
    var grid = $('grid'); grid.innerHTML = '';
    list.forEach(function (s) {
      var a = document.createElement('a'); a.className = 'store'; a.href = '#';
      var c = LOGO[hash(s.name) % LOGO.length];
      var cover = document.createElement('div'); cover.className = 'store-cover';
      cover.style.background = 'linear-gradient(150deg,#2a2a2a,' + HERO[hash(s.name) % HERO.length] + ')';
      var logo = document.createElement('div'); logo.className = 'store-logo';
      logo.style.background = c[0]; logo.style.color = c[1]; logo.textContent = initials(s.name);
      cover.appendChild(logo);
      var body = document.createElement('div'); body.className = 'store-body';
      var n = document.createElement('strong'); n.textContent = s.name;
      var t = document.createElement('span'); t.className = 'muted'; t.textContent = s.tag;
      var e = document.createElement('span'); e.className = 'earn'; e.textContent = earn(s);
      body.appendChild(n); body.appendChild(t); body.appendChild(e);
      a.appendChild(cover); a.appendChild(body);
      a.addEventListener('click', function (ev) { ev.preventDefault(); openStore(s); });
      grid.appendChild(a);
    });
    $('count').textContent = list.length + (list.length === 1 ? ' store' : ' stores');
    $('empty').hidden = list.length > 0;
    document.querySelectorAll('[data-cat]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-cat') === state.category); });
    document.querySelectorAll('[data-type]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-type') === state.type); });
    $('q').value = state.q;
  }

  function sync() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.category) p.set('category', state.category);
    if (state.type) p.set('type', state.type);
    try { history.replaceState(null, '', 'explore.html' + (p.toString() ? '?' + p : '')); } catch (e) {}
    render();
  }

  function openStore(s) {
    $('m-name').textContent = s.name; $('m-tag').textContent = s.tag;
    var ul = $('m-list'); ul.innerHTML = '';
    Object.keys(s.rewards).forEach(function (k) {
      var li = document.createElement('li');
      li.textContent = k === 'cashback' ? s.rewards[k] + ' cashback on every visit' : k === 'coupon' ? 'Coupon: ' + s.rewards[k] : 'Stamp card: ' + s.rewards[k];
      ul.appendChild(li);
    });
    $('modal').hidden = false;
  }
  function close() { $('modal').hidden = true; }
  $('mx').addEventListener('click', close);
  $('modal').addEventListener('click', function (e) { if (e.target === this) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  document.querySelectorAll('[data-cat]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); state.category = a.getAttribute('data-cat'); sync(); });
  });
  document.querySelectorAll('[data-type]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); state.type = a.getAttribute('data-type'); sync(); });
  });
  $('finder').addEventListener('submit', function (e) { e.preventDefault(); state.q = $('q').value.trim(); sync(); });
  $('q').addEventListener('input', function () { state.q = this.value.trim(); sync(); });

  render();

  // Prefer live data when the API is available.
  if (/^https?:$/.test(location.protocol)) {
    fetch('/api/rewards/public/vendors', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var d = j && j.data ? j.data : j, v = d && d.vendors;
        if (!v || !v.length) return;
        stores = v.map(function (x) {
          var er = x.earn_rules || {}, p = x.profile || {};
          var val = function (r) { return r.type === 'percent' ? r.value + '%' : '₹' + r.value; };
          var rw = {};
          if (er.cashback) rw.cashback = val(er.cashback);
          if (er.coupon) rw.coupon = val(er.coupon) + ' off';
          if (er.stamps) rw.stamps = 'Collect stamps for free rewards';
          return { name: x.organization_name || '', cat: p.category || x.category || 'other', tag: p.tagline || '', rewards: rw };
        });
        render();
      }).catch(function () {});
  }
})();
