/* Academy MRA - extracted page interactions.
   Replaces formerly inline scripts: custom cursor, clickable cards, book lightbox and email obfuscation. */
(function(){
  'use strict';

  function onReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }

  function initCursor(){
    var html=document.documentElement;
    html.classList.add('js-ready');
    var reducedMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarsePointer=window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var lowPower=html.dataset.performanceTier === 'low';
    if(reducedMotion || coarsePointer || lowPower || window.innerWidth <= 1023) return;
    if(document.querySelector('.cursor-dot') || document.querySelector('.cursor-ring')) return;

    var dot=document.createElement('div');
    dot.className='cursor-dot';
    var ring=document.createElement('div');
    ring.className='cursor-ring';
    dot.setAttribute('aria-hidden','true');
    ring.setAttribute('aria-hidden','true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var x=window.innerWidth/2, y=window.innerHeight/2, rx=x, ry=y, raf=null, shown=false;
    function paint(){
      rx += (x-rx)*0.18;
      ry += (y-ry)*0.18;
      dot.style.transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%)';
      ring.style.transform='translate3d('+rx+'px,'+ry+'px,0) translate(-50%,-50%)';
      raf=requestAnimationFrame(paint);
    }
    document.addEventListener('mousemove', function(e){
      x=e.clientX; y=e.clientY;
      if(!shown){
        shown=true;
        dot.style.opacity='1';
        ring.style.opacity='1';
      }
      if(!raf) paint();
    }, {passive:true});
    document.addEventListener('mouseleave', function(){
      shown=false;
      dot.style.opacity='0';
      ring.style.opacity='0';
    });
  }

  function initClickableCards(){
    var cards = document.querySelectorAll('.cards-repeat .article-card');
    cards.forEach(function(card) {
      var link = card.querySelector('h3 a[href]');
      if (!link) return;
      card.classList.add('is-card-link');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
      if (!card.hasAttribute('aria-label')) card.setAttribute('aria-label', (link.textContent || '').trim());

      card.addEventListener('click', function (event) {
        if (event.target.closest('a, button, input, textarea, select, label')) return;
        link.click();
      });

      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          link.click();
        }
      });
    });
  }

  function initBookLightbox(){
    var lightbox = document.getElementById('bookLightbox');
    var image = document.getElementById('bookLightboxImage');
    if(!lightbox || !image) return;
    var openLinks = document.querySelectorAll('.thumb-image-link');
    var lastTrigger = null;

    function openLightbox(link){
      var img = link.querySelector('img');
      var src = link.getAttribute('href') || (img && img.getAttribute('src')) || '';
      var alt = (img && img.getAttribute('alt')) || 'Copertina del libro';
      image.src = src;
      image.alt = alt;
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden','false');
      lastTrigger = link;
      var close = lightbox.querySelector('[data-lightbox-close]');
      if(close) close.focus();
      document.documentElement.classList.add('lightbox-open');
    }

    function closeLightbox(){
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden','true');
      image.removeAttribute('src');
      document.documentElement.classList.remove('lightbox-open');
      if(lastTrigger) lastTrigger.focus();
    }

    openLinks.forEach(function(link){
      link.addEventListener('click', function(event){
        event.preventDefault();
        openLightbox(link);
      });
    });

    lightbox.addEventListener('click', function(event){
      if(event.target === lightbox || event.target.hasAttribute('data-lightbox-close')) closeLightbox();
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }


  function initMobileFocusTrap(){
    var focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    document.addEventListener('keydown', function(event){
      if(event.key !== 'Tab') return;
      var nav = document.querySelector('.topbar.is-menu-open');
      if(!nav) return;
      var items = Array.prototype.slice.call(nav.querySelectorAll(focusableSelector))
        .filter(function(el){ return el.offsetParent !== null || el === document.activeElement; });
      if(!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        last.focus();
      } else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initObfuscatedEmail(){
    document.querySelectorAll('[data-obfuscated-email]').forEach(function(link){
      var encoded = link.getAttribute('data-obfuscated-email') || '';
      var subject = link.getAttribute('data-email-subject') || '';
      var email = '';
      try { email = atob(encoded); } catch(e) { email = ''; }
      if(!email || email.indexOf('@') === -1) return;
      link.href = 'mailto:' + email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
      link.textContent = email;
      link.setAttribute('aria-label', 'Invia email a ' + email);
    });
  }

  onReady(function(){
    initCursor();
    initClickableCards();
    initBookLightbox();
    initObfuscatedEmail();
    initMobileFocusTrap();
  });
})();
