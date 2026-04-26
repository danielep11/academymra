/* Academy MRA V71 - ricerca interna, filtri catalogo e rifiniture esperienza */
(function(){
  'use strict';

  var LANG_LABELS = {
    it:{all:'Tutto',course:'Corsi',seminar:'Seminari',book:'Libri',article:'Articoli',page:'Pagine',search:'Cerca',placeholder:'Cerca in questa pagina…',results:'risultati',noResults:'Nessun risultato trovato.',open:'Apri',filters:'Filtri rapidi',level:'Livello',theme:'Tema'},
    en:{all:'All',course:'Paths',seminar:'Seminars',book:'Books',article:'Articles',page:'Pages',search:'Search',placeholder:'Search this page…',results:'results',noResults:'No results found.',open:'Open',filters:'Quick filters',level:'Level',theme:'Theme'},
    fr:{all:'Tout',course:'Parcours',seminar:'Séminaires',book:'Livres',article:'Articles',page:'Pages',search:'Recherche',placeholder:'Rechercher dans cette page…',results:'résultats',noResults:'Aucun résultat trouvé.',open:'Ouvrir',filters:'Filtres rapides',level:'Niveau',theme:'Thème'},
    es:{all:'Todo',course:'Recorridos',seminar:'Seminarios',book:'Libros',article:'Artículos',page:'Páginas',search:'Buscar',placeholder:'Buscar en esta página…',results:'resultados',noResults:'Sin resultados.',open:'Abrir',filters:'Filtros rápidos',level:'Nivel',theme:'Tema'},
    de:{all:'Alle',course:'Wege',seminar:'Seminare',book:'Bücher',article:'Artikel',page:'Seiten',search:'Suche',placeholder:'Auf dieser Seite suchen…',results:'Ergebnisse',noResults:'Keine Ergebnisse gefunden.',open:'Öffnen',filters:'Schnellfilter',level:'Niveau',theme:'Thema'},
    nl:{all:'Alles',course:'Trajecten',seminar:'Seminars',book:'Boeken',article:'Artikelen',page:'Pagina’s',search:'Zoeken',placeholder:'Zoek op deze pagina…',results:'resultaten',noResults:'Geen resultaten gevonden.',open:'Open',filters:'Snelfilters',level:'Niveau',theme:'Thema'},
    hu:{all:'Mind',course:'Utak',seminar:'Szemináriumok',book:'Könyvek',article:'Cikkek',page:'Oldalak',search:'Keresés',placeholder:'Keresés ezen az oldalon…',results:'találat',noResults:'Nincs találat.',open:'Megnyitás',filters:'Gyors szűrők',level:'Szint',theme:'Téma'}
  };

  function lang(){
    var l = (document.documentElement.getAttribute('lang') || 'it').toLowerCase().split('-')[0];
    return LANG_LABELS[l] ? l : 'it';
  }
  function L(key){ return (LANG_LABELS[lang()] || LANG_LABELS.it)[key] || LANG_LABELS.it[key] || key; }
  function strip(value){
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  }
  function currentLangFromPath(){
    var parts = location.pathname.split('/').filter(Boolean);
    var known = ['en','fr','es','de','nl','hu'];
    for(var i=0;i<parts.length;i++){ if(known.indexOf(parts[i]) !== -1) return parts[i]; }
    return 'it';
  }
  function pageName(){
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }
  function createEl(tag, cls, text){
    var el = document.createElement(tag);
    if(cls) el.className = cls;
    if(text !== undefined) el.textContent = text;
    return el;
  }

  function initSearchPage(){
    var input = document.getElementById('site-search-input');
    var results = document.getElementById('site-search-results');
    if(!input || !results || !window.AcademyMRASearchIndex) return;
    if(input.dataset.mraSearchReady === 'true') return;
    input.dataset.mraSearchReady = 'true';

    var count = document.getElementById('site-search-count');
    var activeFilter = 'all';
    var params = new URLSearchParams(location.search);
    var initialQ = params.get('q');
    if(initialQ) input.value = initialQ;

    var STOP_WORDS = {
      it:'di a da in con su per tra fra il lo la i gli le un una uno e o del della dello dei degli delle al alla allo ai agli alle che nel nella nello nei negli nelle'.split(' '),
      en:'the a an and or of to in for with on by from is are be'.split(' '),
      fr:'le la les un une des de du et ou a au aux en dans pour avec sur par'.split(' '),
      es:'el la los las un una unos unas de del y o a en para con sobre por'.split(' '),
      de:'der die das ein eine und oder von zu in mit auf fuer für'.split(' '),
      nl:'de het een en of van naar in met op voor'.split(' '),
      hu:'a az es és vagy hogy van volt meg'.split(' ')
    };

    function termsFrom(value){
      var stop = STOP_WORDS[lang()] || STOP_WORDS.it;
      return strip(value).split(' ').filter(function(term){
        return term && term.length > 1 && stop.indexOf(term) === -1;
      });
    }
    function itemText(item){
      return item._hay || (item._hay = strip([item.title, item.description, item.text, item.category].join(' ')));
    }
    function itemTitle(item){ return item._title || (item._title = strip(item.title || '')); }
    function itemDescription(item){ return item._description || (item._description = strip(item.description || '')); }
    function matches(item, terms, phrase){
      if(!terms.length) return true;
      var hay = itemText(item);
      if(phrase && hay.indexOf(phrase) !== -1) return true;
      return terms.every(function(term){ return hay.indexOf(term) !== -1; });
    }
    function score(item, terms, phrase){
      if(!terms.length) return 1;
      var title = itemTitle(item), desc = itemDescription(item), hay = itemText(item);
      var s = 0;
      if(phrase){
        if(title.indexOf(phrase) !== -1) s += 60;
        else if(desc.indexOf(phrase) !== -1) s += 35;
        else if(hay.indexOf(phrase) !== -1) s += 18;
      }
      terms.forEach(function(term){
        if(title === term) s += 40;
        if(title.indexOf(term) !== -1) s += 24;
        if(desc.indexOf(term) !== -1) s += 10;
        if(hay.indexOf(term) !== -1) s += 3;
      });
      if(item.category === activeFilter) s += 6;
      return s;
    }
    function highlight(text, terms){
      var safe = String(text || '');
      if(!terms.length) return safe;
      var pattern = terms.slice(0,6).map(function(t){ return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
      if(!pattern) return safe;
      return safe.replace(new RegExp('('+pattern+')','ig'), '<mark>$1</mark>');
    }
    function setPressed(group, active){
      group.forEach(function(btn){
        var on = btn === active;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    function setSuggestion(value, activeButton){
      input.value = String(value || '').trim();
      var suggestions = Array.prototype.slice.call(document.querySelectorAll('[data-search-suggestion]'));
      setPressed(suggestions, activeButton || null);
      input.dispatchEvent(new Event('input', {bubbles:true}));
      input.focus();
    }

    function buildCard(item, terms){
      var card = createEl('article','card academy-search-result');
      card.dataset.url = item.url || '';
      var tag = createEl('span','tag', L(item.category || 'page') || item.category);
      var title = createEl('h2');
      var link = document.createElement('a');
      link.href = item.url;
      link.innerHTML = highlight(item.title || item.url, terms);
      title.appendChild(link);
      var p = createEl('p');
      p.innerHTML = highlight(item.description || '', terms);
      var footer = createEl('div','cta-row');
      var cta = createEl('a','btn btn-secondary', L('open'));
      cta.href = item.url;
      footer.appendChild(cta);
      card.appendChild(tag); card.appendChild(title); card.appendChild(p); card.appendChild(footer);
      return card;
    }

    function render(){
      var qRaw = input.value || '';
      var q = strip(qRaw);
      var terms = termsFrom(qRaw);
      var phrase = terms.length > 1 ? terms.join(' ') : q;
      var langCode = currentLangFromPath();
      var seen = Object.create(null);
      var rows = [];
      window.AcademyMRASearchIndex.forEach(function(item){
        if(item.lang !== langCode) return;
        if(!item.url || /404\.html$/.test(item.url)) return;
        if(activeFilter !== 'all' && item.category !== activeFilter) return;
        if(seen[item.url]) return;
        if(!matches(item, terms, phrase)) return;
        seen[item.url] = true;
        rows.push({item:item, rank:score(item, terms, phrase)});
      });
      var data = rows.sort(function(a,b){
        return b.rank - a.rank || String(a.item.title).localeCompare(String(b.item.title));
      }).slice(0, 80).map(function(row){ return row.item; });

      results.replaceChildren();
      if(count){
        count.textContent = data.length + ' ' + L('results') + (qRaw.trim() ? ' · “' + qRaw.trim() + '”' : '');
      }
      if(!data.length){
        results.appendChild(createEl('p','card academy-empty-state',L('noResults')));
        return;
      }
      data.forEach(function(item){ results.appendChild(buildCard(item, terms)); });
    }

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-search-filter]'));
    filterButtons.forEach(function(btn){
      btn.addEventListener('click', function(event){
        event.preventDefault();
        setPressed(filterButtons, btn);
        activeFilter = btn.getAttribute('data-search-filter') || 'all';
        render();
      });
    });
    input.addEventListener('input', function(){
      var current = strip(input.value);
      document.querySelectorAll('[data-search-suggestion]').forEach(function(btn){
        var isActive = current && current === strip(btn.getAttribute('data-search-suggestion') || btn.textContent || '');
        btn.classList.toggle('is-active', !!isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      render();
    });
    document.querySelectorAll('[data-search-suggestion]').forEach(function(btn){
      btn.addEventListener('click', function(event){
        event.preventDefault();
        setSuggestion(btn.getAttribute('data-search-suggestion') || btn.textContent || '', btn);
      });
    });
    render();
  }

  function cardTheme(text){
    var t = strip(text);
    var themes = [];
    if(/alchimi|mercur|zolfo|vegetal|solve|coagula/.test(t)) themes.push('alchimia');
    if(/taroc|arcani|chiavi|simbol|geometri/.test(t)) themes.push('simboli');
    if(/magia|magico|brunian|enoch|teurg|taumaturg/.test(t)) themes.push('magia');
    if(/astrolog|zodiac|planet/.test(t)) themes.push('astrologia');
    if(/volont|will|pratic|ritmo|metodo/.test(t)) themes.push('pratica');
    if(/anima|sogno|ombra|tempo|coscienza/.test(t)) themes.push('interiore');
    return themes.length ? themes : ['generale'];
  }
  function cardLevel(text){
    var t = strip(text);
    if(/base|inizial|introdutt|principiant/.test(t)) return 'base';
    if(/annual|12 lezioni|percorso|corso/.test(t)) return 'strutturato';
    if(/premium|avanz|profond|mistero|pratica/.test(t)) return 'avanzato';
    return 'aperto';
  }
  function humanTag(value){
    return value.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
  }

  function enhanceCatalogCards(){
    var name = pageName();
    var isCatalog = /^(corsi|seminari|libri|insegnamenti|lezioni-seminari)\.html$/.test(name);
    if(!isCatalog) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.article-card, .corsi-card, .seminari-card'));
    if(cards.length < 3) return;
    cards.forEach(function(card){
      var text = card.textContent || '';
      var themes = cardTheme(text);
      var level = cardLevel(text);
      card.dataset.mraThemes = themes.join(' ');
      card.dataset.mraLevel = level;
      var shouldShowCardMeta = name !== 'corsi.html';
      if(shouldShowCardMeta && !card.querySelector('.academy-card-meta')){
        var meta = createEl('div','academy-card-meta');
        var primary = createEl('span','academy-pill', humanTag(themes[0]));
        var secondary = createEl('span','academy-pill academy-pill-soft', humanTag(level));
        meta.appendChild(primary); meta.appendChild(secondary);
        var heading = card.querySelector('h3, h2');
        if(heading) heading.insertAdjacentElement('afterend', meta);
        else card.insertBefore(meta, card.firstChild);
      }
    });
  }

  function initCatalogFilters(){
    var name = pageName();
    var isCatalog = /^(corsi|seminari|libri|insegnamenti|lezioni-seminari)\.html$/.test(name);
    if(!isCatalog) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.article-card, .corsi-card, .seminari-card'));
    if(cards.length < 5) return;
    var anchor = cards[0].closest('.section-inner') || document.querySelector('.section-inner');
    if(!anchor || anchor.querySelector('.academy-catalog-tools')) return;

    enhanceCatalogCards();

    var tools = createEl('div','academy-catalog-tools card');
    var label = createEl('label','academy-catalog-search');
    var sr = createEl('span','sr-only', L('search'));
    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = L('placeholder');
    input.autocomplete = 'off';
    label.appendChild(sr); label.appendChild(input);

    var filters = createEl('div','academy-filter-row');
    filters.setAttribute('aria-label', L('filters'));
    var values = ['all','alchimia','simboli','magia','astrologia','pratica','interiore','base','strutturato','avanzato'];
    values.forEach(function(value, index){
      var btn = createEl('button','academy-filter' + (index===0 ? ' is-active' : ''), value === 'all' ? L('all') : humanTag(value));
      btn.type = 'button';
      btn.dataset.catalogFilter = value;
      filters.appendChild(btn);
    });
    var count = createEl('p','meta academy-catalog-count');
    tools.appendChild(label); tools.appendChild(filters); tools.appendChild(count);
    var insertion = cards[0].parentElement;
    anchor.insertBefore(tools, insertion);

    var active = 'all';
    function render(){
      var q = strip(input.value);
      var visible = 0;
      cards.forEach(function(card){
        var t = strip(card.textContent || '');
        var okQuery = !q || t.indexOf(q) !== -1;
        var data = (card.dataset.mraThemes || '') + ' ' + (card.dataset.mraLevel || '');
        var okFilter = active === 'all' || data.indexOf(active) !== -1;
        var show = okQuery && okFilter;
        card.hidden = !show;
        visible += show ? 1 : 0;
      });
      count.textContent = visible + ' ' + L('results');
    }
    filters.addEventListener('click', function(event){
      var btn = event.target.closest('[data-catalog-filter]');
      if(!btn) return;
      filters.querySelectorAll('[data-catalog-filter]').forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      active = btn.dataset.catalogFilter || 'all';
      render();
    });
    input.addEventListener('input', render);
    document.querySelectorAll('[data-search-suggestion]').forEach(function(btn){
      btn.addEventListener('click', function(){
        input.value = btn.getAttribute('data-search-suggestion') || btn.textContent || '';
        input.focus();
        render();
      });
    });
    render();
  }

  function initAnchorCards(){
    document.querySelectorAll('.academy-map-node, .academy-tool-card, .academy-path-card, .living-card, .glossary-card').forEach(function(card){
      card.addEventListener('mousemove', function(event){
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      });
    });
  }

  function init(){
    initSearchPage();
    enhanceCatalogCards();
    initCatalogFilters();
    initAnchorCards();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* V72 - cursore e luce hover uniformi su tutto il sito */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    var html=document.documentElement;
    html.classList.add('js-ready');
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;
    var fine=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var spotlightSelector='.card, .article-card, .offer-card, .corsi-card, .seminari-card, .book-card, .archive-card, .faq-card, .plan-card, .access-card, .legal-card, .academy-tool-card, .academy-path-card, .living-card, .glossary-card, .academy-search-result, .academy-map-node, .faq-item';
    document.querySelectorAll(spotlightSelector).forEach(function(card){
      if(card.dataset.mraSpotlightReady==='true')return;
      card.dataset.mraSpotlightReady='true';
      card.addEventListener('pointermove',function(event){
        var rect=card.getBoundingClientRect();
        if(!rect.width||!rect.height)return;
        card.style.setProperty('--mx',((event.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((event.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
      },{passive:true});
    });
    if(reduced||coarse||!fine||window.innerWidth<=1023)return;
    if(document.querySelector('.cursor-dot')||document.querySelector('.cursor-ring'))return;
    var style=document.createElement('style');
    style.id='mra-v72-global-cursor-style';
    style.textContent='.cursor-dot,.cursor-ring{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483645;opacity:0;visibility:hidden;will-change:left,top,opacity,transform}.cursor-dot{z-index:2147483646;width:8px;height:8px;border-radius:999px;background:rgba(92,68,10,.96);box-shadow:0 0 0 2px rgba(255,255,255,.78),0 8px 18px rgba(92,68,10,.22);transform:translate(-50%,-50%)}.cursor-ring{width:34px;height:34px;border-radius:999px;border:1.5px solid rgba(111,84,0,.42);background:rgba(255,255,255,.20);backdrop-filter:blur(2px);box-shadow:0 8px 20px rgba(59,51,33,.10);transform:translate(-50%,-50%);transition:width .22s ease,height .22s ease,border-color .22s ease,background .22s ease,box-shadow .22s ease}.cursor-ring.is-hover{width:42px;height:42px;border-color:rgba(111,84,0,.55);background:rgba(255,255,255,.26);box-shadow:0 10px 24px rgba(111,84,0,.13)}.cursor-ring.is-active{width:28px;height:28px}';
    document.head.appendChild(style);
    var dot=document.createElement('div');
    dot.className='cursor-dot';
    var ring=document.createElement('div');
    ring.className='cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mouseX=window.innerWidth/2,mouseY=window.innerHeight/2,ringX=mouseX,ringY=mouseY,visible=true;
    function show(){dot.style.opacity='1';dot.style.visibility='visible';ring.style.opacity='1';ring.style.visibility='visible';}
    function move(event){mouseX=event.clientX;mouseY=event.clientY;dot.style.left=mouseX+'px';dot.style.top=mouseY+'px';visible=true;show();}
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('mousemove',move,{passive:true});
    document.addEventListener('pointerdown',function(){ring.classList.add('is-active');});
    document.addEventListener('pointerup',function(){ring.classList.remove('is-active');});
    document.addEventListener('pointerover',function(event){
      var target=event.target&&event.target.closest?event.target.closest('a[href], button, input, textarea, select, label, summary, .btn, [role="button"], [tabindex]:not([tabindex="-1"])'):null;
      ring.classList.toggle('is-hover',Boolean(target));
    },{passive:true});
    document.addEventListener('pointerout',function(event){
      if(!event.relatedTarget||!event.relatedTarget.closest||!event.relatedTarget.closest('a[href], button, input, textarea, select, label, summary, .btn, [role="button"], [tabindex]:not([tabindex="-1"])')) ring.classList.remove('is-hover');
    },{passive:true});
    (function animate(){
      ringX+=(mouseX-ringX)*0.2;
      ringY+=(mouseY-ringY)*0.2;
      if(visible){ring.style.left=ringX+'px';ring.style.top=ringY+'px';}
      window.requestAnimationFrame(animate);
    })();
    document.addEventListener('mouseleave',function(){dot.style.opacity='0';ring.style.opacity='0';visible=false;});
    document.addEventListener('mouseenter',function(){visible=true;show();});
    dot.style.left=mouseX+'px';dot.style.top=mouseY+'px';show();
  });
})();


/* V73 - cursore FAQ e rifiniture: fallback globale se il primo inizializzatore è bloccato */
(function(){
  'use strict';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  ready(function(){
    document.documentElement.classList.add('js-ready');
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;
    var fine=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if(reduced||coarse||!fine||window.innerWidth<=1023)return;
    document.body.classList.add('mra-custom-cursor-enabled');
  });
})();


/* v77 - accessibilità moduli, stato focus e performance mobile */
(function(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  ready(function(){
    document.querySelectorAll('form').forEach(function(form){
      form.setAttribute('novalidate','novalidate');
      form.querySelectorAll('input, textarea, select').forEach(function(field){
        var id = field.getAttribute('id');
        if(!id) return;
        var error = document.getElementById(id + '-error');
        function labelText(){
          var label = document.querySelector('label[for="'+ CSS.escape(id) +'"]');
          return label ? label.textContent.replace(/\s+/g,' ').trim() : (field.getAttribute('name') || 'campo');
        }
        function message(){
          if(field.validity.valueMissing) return 'Compila il campo ' + labelText() + '.';
          if(field.validity.typeMismatch) return 'Inserisci un valore valido per ' + labelText() + '.';
          if(field.validity.patternMismatch) return 'Controlla il formato del campo ' + labelText() + '.';
          return '';
        }
        function validate(show){
          var msg = message();
          field.setAttribute('aria-invalid', msg ? 'true' : 'false');
          if(error) error.textContent = show ? msg : '';
          return !msg;
        }
        field.addEventListener('input', function(){ validate(false); });
        field.addEventListener('blur', function(){ validate(true); });
      });
      form.addEventListener('submit', function(event){
        var firstInvalid = null;
        form.querySelectorAll('input, textarea, select').forEach(function(field){
          if(!field.checkValidity() && !firstInvalid) firstInvalid = field;
          var id = field.getAttribute('id');
          var error = id ? document.getElementById(id + '-error') : null;
          var msg = '';
          if(field.validity.valueMissing) msg = 'Compila questo campo.';
          else if(field.validity.typeMismatch) msg = 'Inserisci un valore valido.';
          else if(field.validity.patternMismatch) msg = 'Controlla il formato.';
          field.setAttribute('aria-invalid', msg ? 'true' : 'false');
          if(error) error.textContent = msg;
        });
        if(firstInvalid){
          event.preventDefault();
          firstInvalid.focus({preventScroll:false});
        }
      });
    });

    var reducedData = false;
    try{ reducedData = !!(navigator.connection && navigator.connection.saveData); }catch(e){}
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var small = window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reducedData || coarse || small || reduceMotion){
      document.querySelectorAll('body.home-page video.hero-video').forEach(function(video){
        try{
          video.removeAttribute('autoplay');
          video.preload = 'none';
          video.pause();
        }catch(e){}
      });
    }
  });
})();
