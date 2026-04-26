/* Academy MRA - media and performance optimizer.
   Disables hero videos for mobile, reduced motion/data and low-power devices; keeps poster imagery visible. */
(function(){
  'use strict';

  var root = document.documentElement;

  function mq(query){
    return !!(window.matchMedia && window.matchMedia(query).matches);
  }

  function detectLowPower(){
    var memory = navigator.deviceMemory || 8;
    var cores = navigator.hardwareConcurrency || 8;
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var lowNetwork = !!(navigator.connection && /(^|-)2g$/.test(navigator.connection.effectiveType || ''));
    return saveData || lowNetwork || memory <= 2 || cores <= 2;
  }

  function shouldDisableHeroVideo(){
    return detectLowPower() ||
      mq('(prefers-reduced-motion: reduce)') ||
      mq('(prefers-reduced-data: reduce)') ||
      mq('(pointer: coarse)') ||
      window.innerWidth < 900;
  }

  function disableVideo(video){
    if(!video || video.dataset.mediaDisabled === 'true') return;
    video.dataset.mediaDisabled = 'true';
    video.preload = 'none';
    video.removeAttribute('autoplay');
    try { video.pause(); } catch(e) {}
    video.querySelectorAll('source[src]').forEach(function(source){
      source.dataset.src = source.getAttribute('src');
      source.removeAttribute('src');
    });
    video.removeAttribute('src');
    try { video.load(); } catch(e) {}
    video.setAttribute('aria-hidden','true');
  }

  function optimizeHeroVideos(){
    var disable = shouldDisableHeroVideo();
    root.dataset.performanceTier = detectLowPower() ? 'low' : 'standard';
    root.classList.toggle('is-media-reduced', disable);

    document.querySelectorAll('.hero-video-wrap').forEach(function(wrap){
      var video = wrap.querySelector('video');
      var poster = video && video.getAttribute('poster');
      if(poster){
        wrap.style.backgroundImage = 'url("' + poster + '")';
        wrap.style.backgroundSize = 'cover';
        wrap.style.backgroundPosition = 'center';
      }
      if(disable){
        disableVideo(video);
        wrap.classList.add('hero-video-wrap--poster');
        wrap.setAttribute('data-media-disabled','true');
      }
    });
  }

  optimizeHeroVideos();
  window.addEventListener('resize', function(){
    window.clearTimeout(window.__mraMediaResizeTimer);
    window.__mraMediaResizeTimer = window.setTimeout(optimizeHeroVideos, 160);
  }, {passive:true});
})();
