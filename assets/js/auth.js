/* Academy MRA - auth state shell.
   Adds a safe guest baseline without inline JavaScript, then updates the UI after /api/session. */
document.documentElement.classList.add('is-guest');
/* Academy MRA - secure static shell
   This file intentionally avoids localStorage authentication and demo credentials.
   Real authentication must be provided by server endpoints:
   GET /api/session, POST /api/login, POST /api/logout. */
(function(){
  'use strict';
  var SUPPORTED_LANGS = ['it','en','fr','es','de','nl','hu'];
  var session = null;
  var checked = false;

  function isLangSubdir(){
    return new RegExp('^/(' + SUPPORTED_LANGS.filter(function(l){return l !== 'it';}).join('|') + ')(/|$)').test(location.pathname);
  }
  function prefix(){ return isLangSubdir() ? '../' : ''; }
  function norm(v){ return String(v || '').trim().toLowerCase(); }
  function clearLegacySession(){
    try { localStorage.removeItem('academyMraSession'); } catch(e) {}
    try { sessionStorage.removeItem('academyMraSession'); } catch(e) {}
  }
  function isPremium(s){
    if(!s) return false;
    if(norm(s.accountType || s.account_type || s.role) === 'premium') return true;
    if(Array.isArray(s.permissions) && s.permissions.indexOf('articles:premium') !== -1) return true;
    return false;
  }
  function accessLevel(v){
    v = norm(v || 'public');
    if(v === 'paid') return 'premium';
    if(v === 'premium') return 'premium';
    if(v === 'registered' || v === 'registrato' || v === 'reserved' || v === 'member') return 'registered';
    return 'public';
  }
  function currentAccessLevel(){
    var meta = document.querySelector('meta[name="article-access"]');
    var plan = document.querySelector('meta[name="requires-plan"]');
    var bodyLevel = document.body && (document.body.getAttribute('data-access-level') || document.body.getAttribute('data-requires-plan'));
    var file = norm(location.pathname.split('/').pop());
    var level = accessLevel((meta && meta.content) || bodyLevel || 'public');
    if(level === 'public' && plan && accessLevel(plan.content) === 'premium') level = 'premium';
    if(file === 'archivio-premium.html') level = 'premium';
    return level;
  }
  function canRead(level, s){
    level = accessLevel(level);
    if(level === 'public') return true;
    if(level === 'registered') return !!s;
    if(level === 'premium') return isPremium(s);
    return false;
  }
  function displayName(s){
    if(!s) return 'Account';
    return [s.firstName || s.first_name, s.lastName || s.last_name].filter(Boolean).join(' ').trim() || s.name || s.email || 'Account';
  }
  function setClasses(){
    var active = !!session;
    document.documentElement.classList.toggle('is-authenticated', active);
    document.documentElement.classList.toggle('is-guest', !active);
    document.documentElement.setAttribute('data-auth-state', active ? 'authenticated' : 'guest');
    if(document.body){
      document.body.classList.toggle('is-authenticated', active);
      document.body.classList.toggle('is-guest', !active);
      document.body.setAttribute('data-auth-state', active ? 'authenticated' : 'guest');
    }
  }
  function ensureStyle(){
    if(document.getElementById('academy-secure-auth-style')) return;
    var st = document.createElement('style');
    st.id = 'academy-secure-auth-style';
    st.textContent = [
      'html.is-authenticated .auth-guest-only,html.is-authenticated [data-auth-nav="guest"]{display:none!important;visibility:hidden!important}',
      'html.is-guest [data-auth-clean="account"],html.is-guest [data-auth-clean="logout"]{display:none!important;visibility:hidden!important}',
      '.article-access-gate{min-height:58vh;display:flex;align-items:center;padding:clamp(36px,6vw,76px) 18px}',
      '.article-access-gate .section-inner{width:min(100%,960px);margin:0 auto}',
      '.access-gate-card{max-width:780px;margin:0 auto;text-align:center;padding:clamp(28px,5vw,54px);border:1px solid rgba(88,69,34,.14);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,255,255,.84));box-shadow:0 22px 56px rgba(39,27,10,.07)}',
      '.access-gate-card h1{font-size:clamp(34px,5vw,62px);line-height:1;margin:0 0 18px;letter-spacing:-.04em}',
      '.access-gate-card p{max-width:58ch;margin:0 auto 24px;color:#6b5d49;font-size:18px}',
      '.access-gate-card .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}'
    ].join('\n');
    document.head.appendChild(st);
  }
  function isGuestLink(a){
    var href = norm(String(a && a.getAttribute('href') || '').split('?')[0].split('#')[0].split('/').pop());
    var txt = norm(a && a.textContent);
    return ['login.html','accedi.html','piani.html','registrazione.html'].indexOf(href) !== -1 ||
           ['accedi','accesso','registrazione','registrati','iscriviti','sign in','registration','join'].indexOf(txt) !== -1;
  }
  function updateNav(){
    document.querySelectorAll('.topbar a[href]').forEach(function(a){
      if(!isGuestLink(a)) return;
      var item = a.closest('li') || a;
      item.classList.add('auth-guest-only');
      item.setAttribute('data-auth-nav','guest');
      item.hidden = !!session;
    });
    document.querySelectorAll('.topbar [data-auth-clean="account"],.topbar [data-auth-clean="logout"]').forEach(function(n){ n.remove(); });
    if(!session) return;
    document.querySelectorAll('.topbar .menu').forEach(function(menu){
      var switcher = menu.querySelector('.language-switcher');
      var li = document.createElement('li');
      li.className = 'menu-item cta auth-user-item';
      li.setAttribute('data-auth-clean','account');
      var a = document.createElement('a');
      a.className = 'btn-link auth-account-button';
      a.href = prefix() + 'account.html';
      a.textContent = 'Account';
      a.setAttribute('aria-label','Account: ' + displayName(session));
      li.appendChild(a);
      var lo = document.createElement('li');
      lo.className = 'menu-item cta auth-logout-item';
      lo.setAttribute('data-auth-clean','logout');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-link auth-logout-button';
      b.textContent = 'Logout';
      b.addEventListener('click', function(ev){
        ev.preventDefault();
        fetch('/api/logout', {method:'POST', credentials:'include'}).finally(function(){ location.href = prefix() + 'index.html'; });
      });
      lo.appendChild(b);
      if(switcher){ menu.insertBefore(li, switcher); menu.insertBefore(lo, switcher); }
      else { menu.appendChild(li); menu.appendChild(lo); }
    });
  }
  function enforceGate(){
    var level = currentAccessLevel();
    if(level === 'public') return;
    var main = document.querySelector('main');
    if(!main) return;
    if(checked && canRead(level, session)){
      document.documentElement.classList.add('article-access-authorized');
      return;
    }
    var premium = level === 'premium';
    var title = premium ? 'Contenuto servito dall’area premium' : 'Contenuto riservato agli utenti registrati';
    var message = premium
      ? 'Per non esporre materiale riservato nel codice statico, questo contenuto deve essere caricato dal backend solo dopo verifica dell’abbonamento.'
      : 'Per non esporre materiale riservato nel codice statico, questo contenuto deve essere caricato dal backend solo dopo autenticazione.';
    main.innerHTML = '<section class="section article-access-gate"><div class="section-inner"><div class="card access-gate-card"><span class="eyebrow">Accesso richiesto</span><h1>' + title + '</h1><p>' + message + '</p><div class="cta-row"><a class="btn btn-primary" href="' + prefix() + 'login.html">Accedi</a><a class="btn btn-secondary" href="' + prefix() + 'piani.html">Scegli un piano</a></div></div></div></section>';
    document.documentElement.classList.add('article-access-denied');
  }
  async function loadSession(){
    clearLegacySession();
    try{
      var r = await fetch('/api/session', {credentials:'include', headers:{'Accept':'application/json'}, cache:'no-store'});
      var data = await r.json().catch(function(){ return {}; });
      session = r.ok && data && data.authenticated && data.user ? data.user : null;
      window.__academyMraSession = session;
    } catch(e){
      session = null;
      window.__academyMraSession = null;
    }
    checked = true;
    setClasses();
    updateNav();
    enforceGate();
  }
  function init(){
    ensureStyle();
    setClasses();
    updateNav();
    enforceGate();
    loadSession();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
