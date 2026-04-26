(function(){
  const html = document.documentElement;
  const body = document.body;
  if(!body) return;
  html.classList.add('js-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const isHome = body.classList.contains('home-page');
  const allowEnhancedMotion = isHome && !reducedMotion && !saveData && !coarsePointer && window.innerWidth >= 900;
  const allowLogoTilt = isHome && !reducedMotion && !coarsePointer && window.innerWidth >= 900;
  const currentLanguage = (function(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    const match = [...parts].reverse().find((part)=> ['en','fr','es','de','nl','hu'].includes(part));
    return match || 'it';
  })();
  const uiText = {
    it:{openMenu:'Apri il menu',closeMenu:'Chiudi il menu',backToTop:'Torna in alto',searchArchive:'Cerca nell’archivio',searchPlaceholder:'Cerca per nome o data',emptyArchive:'Nessun contenuto trovato. Prova con una parola chiave diversa.',availableOne:'contenuto disponibile',availableMany:'contenuti disponibili',readingTime:'Tempo di lettura',format:'Formato',reading:'Lettura',readingDesc:'Struttura ottimizzata per approfondire senza distrazioni.',about:'Circa',min:'min',breadcrumb:'Breadcrumb',formTooFast:'Attendi un istante e riprova.',formInvalid:'Controlla i campi richiesti prima di inviare.',openNewsletter:'Apro il tuo client email per completare l’iscrizione alla newsletter.',openMessage:'Apro il tuo client email con il messaggio già compilato.',connectEndpoint:'Collega questo modulo a un endpoint reale o a un servizio form per l’invio automatico.',showPassword:'Mostra',hidePassword:'Nascondi'},
    en:{openMenu:'Open menu',closeMenu:'Close menu',backToTop:'Back to top',searchArchive:'Search archive',searchPlaceholder:'Search by title, category or date',emptyArchive:'No content found. Try a different keyword.',availableOne:'content available',availableMany:'contents available',readingTime:'Reading time',format:'Format',reading:'Reading',readingDesc:'Structure optimised for deep reading without distractions.',about:'About',min:'min',breadcrumb:'Breadcrumb',formTooFast:'Wait a moment and try again.',formInvalid:'Check the required fields before sending.',openNewsletter:'I am opening your email app to complete the newsletter subscription.',openMessage:'I am opening your email app with the message already prepared.',connectEndpoint:'Connect this form to a real endpoint or a form service for automatic sending.',showPassword:'Show',hidePassword:'Hide'},
    fr:{openMenu:'Ouvrir le menu',closeMenu:'Fermer le menu',backToTop:'Retour en haut',searchArchive:'Rechercher dans l’archive',searchPlaceholder:'Rechercher par titre, catégorie ou date',emptyArchive:'Aucun contenu trouvé. Essayez un autre mot-clé.',availableOne:'contenu disponible',availableMany:'contenus disponibles',readingTime:'Temps de lecture',format:'Format',reading:'Lecture',readingDesc:'Structure optimisée pour approfondir sans distractions.',about:'Environ',min:'min',breadcrumb:'Fil d’Ariane',formTooFast:'Attendez un instant puis réessayez.',formInvalid:'Vérifiez les champs obligatoires avant l’envoi.',openNewsletter:'J’ouvre votre application e-mail pour finaliser l’inscription à la newsletter.',openMessage:'J’ouvre votre application e-mail avec le message déjà préparé.',connectEndpoint:'Connectez ce formulaire à un véritable endpoint ou à un service de formulaires pour l’envoi automatique.',showPassword:'Afficher',hidePassword:'Masquer'},
    es:{openMenu:'Abrir menú',closeMenu:'Cerrar menú',backToTop:'Volver arriba',searchArchive:'Buscar en el archivo',searchPlaceholder:'Buscar por título, categoría o fecha',emptyArchive:'No se ha encontrado contenido. Prueba con otra palabra clave.',availableOne:'contenido disponible',availableMany:'contenidos disponibles',readingTime:'Tiempo de lectura',format:'Formato',reading:'Lectura',readingDesc:'Estructura optimizada para profundizar sin distracciones.',about:'Aproximadamente',min:'min',breadcrumb:'Migas de pan',formTooFast:'Espera un momento y vuelve a intentarlo.',formInvalid:'Revisa los campos obligatorios antes de enviar.',openNewsletter:'Estoy abriendo tu aplicación de correo para completar la suscripción al boletín.',openMessage:'Estoy abriendo tu aplicación de correo con el mensaje ya preparado.',connectEndpoint:'Conecta este formulario a un endpoint real o a un servicio de formularios para el envío automático.',showPassword:'Mostrar',hidePassword:'Ocultar'},
    de:{openMenu:'Menü öffnen',closeMenu:'Menü schließen',backToTop:'Nach oben',searchArchive:'Im Archiv suchen',searchPlaceholder:'Nach Titel, Kategorie oder Datum suchen',emptyArchive:'Kein Inhalt gefunden. Versuche ein anderes Stichwort.',availableOne:'Inhalt verfügbar',availableMany:'Inhalte verfügbar',readingTime:'Lesezeit',format:'Format',reading:'Lektüre',readingDesc:'Struktur optimiert für vertieftes Lesen ohne Ablenkungen.',about:'Etwa',min:'Min',breadcrumb:'Brotkrumenpfad',formTooFast:'Warte einen Moment und versuche es erneut.',formInvalid:'Prüfe die Pflichtfelder vor dem Senden.',openNewsletter:'Ich öffne deine E-Mail-App, um das Newsletter-Abonnement abzuschließen.',openMessage:'Ich öffne deine E-Mail-App mit der bereits vorbereiteten Nachricht.',connectEndpoint:'Verbinde dieses Formular mit einem echten Endpoint oder einem Form-Dienst für das automatische Senden.',showPassword:'Anzeigen',hidePassword:'Verbergen'},
    ru:{openMenu:'Открыть меню',closeMenu:'Закрыть меню',backToTop:'Наверх',searchArchive:'Поиск по архиву',searchPlaceholder:'Поиск по заголовку, категории или дате',emptyArchive:'Материалы не найдены. Попробуйте другое ключевое слово.',availableOne:'материал доступен',availableMany:'материалов доступно',readingTime:'Время чтения',format:'Формат',reading:'Чтение',readingDesc:'Структура, оптимизированная для углублённого чтения без отвлечений.',about:'Около',min:'мин',breadcrumb:'Хлебные крошки',formTooFast:'Подождите немного и попробуйте снова.',formInvalid:'Проверьте обязательные поля перед отправкой.',openNewsletter:'Я открываю ваше почтовое приложение, чтобы завершить подписку на рассылку.',openMessage:'Я открываю ваше почтовое приложение с уже подготовленным сообщением.',connectEndpoint:'Подключите эту форму к реальному endpoint или сервису форм для автоматической отправки.',showPassword:'Показать',hidePassword:'Скрыть'},
    pt:{openMenu:'Abrir menu',closeMenu:'Fechar menu',backToTop:'Voltar ao topo',searchArchive:'Pesquisar no arquivo',searchPlaceholder:'Pesquisar por título, categoria ou data',emptyArchive:'Nenhum conteúdo encontrado. Tente outra palavra-chave.',availableOne:'conteúdo disponível',availableMany:'conteúdos disponíveis',readingTime:'Tempo de leitura',format:'Formato',reading:'Leitura',readingDesc:'Estrutura otimizada para aprofundar sem distrações.',about:'Cerca de',min:'min',breadcrumb:'Breadcrumb',formTooFast:'Espere um instante e tente novamente.',formInvalid:'Verifique os campos obrigatórios antes de enviar.',openNewsletter:'Estou a abrir a sua aplicação de e-mail para concluir a subscrição da newsletter.',openMessage:'Estou a abrir a sua aplicação de e-mail com a mensagem já preparada.',connectEndpoint:'Ligue este formulário a um endpoint real ou a um serviço de formulários para envio automático.',showPassword:'Mostrar',hidePassword:'Ocultar'},
    ro:{openMenu:'Deschide meniul',closeMenu:'Închide meniul',backToTop:'Înapoi sus',searchArchive:'Caută în arhivă',searchPlaceholder:'Caută după titlu, categorie sau dată',emptyArchive:'Nu a fost găsit niciun conținut. Încearcă alt cuvânt-cheie.',availableOne:'conținut disponibil',availableMany:'conținuturi disponibile',readingTime:'Timp de lectură',format:'Format',reading:'Lectură',readingDesc:'Structură optimizată pentru aprofundare fără distrageri.',about:'Aproximativ',min:'min',breadcrumb:'Navigație',formTooFast:'Așteaptă un moment și încearcă din nou.',formInvalid:'Verifică câmpurile obligatorii înainte de trimitere.',openNewsletter:'Deschid aplicația de e-mail pentru a finaliza abonarea la newsletter.',openMessage:'Deschid aplicația de e-mail cu mesajul deja pregătit.',connectEndpoint:'Conectează acest formular la un endpoint real sau la un serviciu de formulare pentru trimitere automată.',showPassword:'Arată',hidePassword:'Ascunde'},
    pl:{openMenu:'Otwórz menu',closeMenu:'Zamknij menu',backToTop:'Wróć na górę',searchArchive:'Szukaj w archiwum',searchPlaceholder:'Szukaj według tytułu, kategorii lub daty',emptyArchive:'Nie znaleziono treści. Spróbuj innego słowa kluczowego.',availableOne:'treść dostępna',availableMany:'treści dostępne',readingTime:'Czas czytania',format:'Format',reading:'Czytanie',readingDesc:'Struktura zoptymalizowana do pogłębionej lektury bez rozproszeń.',about:'Około',min:'min',breadcrumb:'Okruszki',formTooFast:'Poczekaj chwilę i spróbuj ponownie.',formInvalid:'Sprawdź wymagane pola przed wysłaniem.',openNewsletter:'Otwieram aplikację e-mail, aby dokończyć zapis do newslettera.',openMessage:'Otwieram aplikację e-mail z już przygotowaną wiadomością.',connectEndpoint:'Połącz ten formularz z prawdziwym endpointem lub usługą formularzy do automatycznej wysyłki.',showPassword:'Pokaż',hidePassword:'Ukryj'},
    nl:{openMenu:'Menu openen',closeMenu:'Menu sluiten',backToTop:'Terug naar boven',searchArchive:'Zoek in het archief',searchPlaceholder:'Zoek op titel, categorie of datum',emptyArchive:'Geen inhoud gevonden. Probeer een ander trefwoord.',availableOne:'inhoud beschikbaar',availableMany:'inhouden beschikbaar',readingTime:'Leestijd',format:'Formaat',reading:'Lezen',readingDesc:'Structuur geoptimaliseerd voor verdieping zonder afleiding.',about:'Ongeveer',min:'min',breadcrumb:'Broodkruimelpad',formTooFast:'Wacht even en probeer het opnieuw.',formInvalid:'Controleer de verplichte velden voordat je verzendt.',openNewsletter:'Ik open je e-mailapp om de nieuwsbriefinschrijving te voltooien.',openMessage:'Ik open je e-mailapp met het bericht al voorbereid.',connectEndpoint:'Verbind dit formulier met een echt endpoint of een formulierendienst voor automatisch verzenden.',showPassword:'Tonen',hidePassword:'Verbergen'},
    uk:{openMenu:'Відкрити меню',closeMenu:'Закрити меню',backToTop:'Нагору',searchArchive:'Пошук в архіві',searchPlaceholder:'Пошук за назвою, категорією або датою',emptyArchive:'Матеріалів не знайдено. Спробуйте інше ключове слово.',availableOne:'матеріал доступний',availableMany:'матеріалів доступно',readingTime:'Час читання',format:'Формат',reading:'Читання',readingDesc:'Структура, оптимізована для глибокого читання без відволікань.',about:'Близько',min:'хв',breadcrumb:'Навігаційний ланцюжок',formTooFast:'Зачекайте мить і спробуйте знову.',formInvalid:'Перевірте обов’язкові поля перед надсиланням.',openNewsletter:'Я відкриваю вашу поштову програму, щоб завершити підписку на розсилку.',openMessage:'Я відкриваю вашу поштову програму з уже підготовленим повідомленням.',connectEndpoint:'Підключіть цю форму до реального endpoint або сервісу форм для автоматичного надсилання.',showPassword:'Показати',hidePassword:'Приховати'},
    hu:{openMenu:'Menü megnyitása',closeMenu:'Menü bezárása',backToTop:'Vissza a tetejére',searchArchive:'Keresés az archívumban',searchPlaceholder:'Keresés cím, kategória vagy dátum szerint',emptyArchive:'Nem található tartalom. Próbálj másik kulcsszót.',availableOne:'elérhető tartalom',availableMany:'elérhető tartalmak',readingTime:'Olvasási idő',format:'Formátum',reading:'Olvasás',readingDesc:'A mélyebb olvasásra optimalizált, zavaró tényezők nélküli szerkezet.',about:'Kb.',min:'perc',breadcrumb:'Morzsaút',formTooFast:'Várj egy pillanatot, majd próbáld újra.',formInvalid:'Küldés előtt ellenőrizd a kötelező mezőket.',openNewsletter:'Megnyitom az e-mail alkalmazást a hírlevél-feliratkozás befejezéséhez.',openMessage:'Megnyitom az e-mail alkalmazást az előkészített üzenettel.',connectEndpoint:'Kapcsold ezt az űrlapot valódi végponthoz vagy űrlapszolgáltatáshoz az automatikus küldéshez.',showPassword:'Megjelenít',hidePassword:'Elrejt'}
  }[currentLanguage];
  const pageLabels = {
    it:{home:'Home',archive:'Archivio',premiumArchive:'Archivio premium',teachings:'Insegnamenti',lessons:'Lezioni e seminari',courses:'Corsi',seminars:'Seminari',books:'Libri',contacts:'Contatti',signup:'Iscriviti',access:'Accesso riservato',account:'Accesso e orientamento',vivian:'Vivian Del Lago',heir:'Erede del tempo sacro',privacy:'Privacy Policy',cookies:'Cookie Policy',notFound:'Pagina non trovata',article:'Articolo'},
    en:{home:'Home',archive:'Archive',premiumArchive:'Premium archive',teachings:'Teachings',lessons:'Lessons and seminars',books:'Books',contacts:'Contacts',signup:'Sign up',access:'Reserved access',account:'Access and guidance',vivian:'Vivian Del Lago',heir:'Heir of sacred time',privacy:'Privacy Policy',cookies:'Cookie Policy',notFound:'Page not found',article:'Article'},
    fr:{home:'Accueil',archive:'Archive',premiumArchive:'Archive premium',teachings:'Enseignements',lessons:'Leçons et séminaires',books:'Livres',contacts:'Contacts',signup:'Inscription',access:'Accès réservé',account:'Accès et orientation',vivian:'Vivian Del Lago',heir:'Héritier du temps sacré',privacy:'Politique de confidentialité',cookies:'Politique relative aux cookies',notFound:'Page introuvable',article:'Article'},
    es:{home:'Inicio',archive:'Archivo',premiumArchive:'Archivo premium',teachings:'Enseñanzas',lessons:'Lecciones y seminarios',books:'Libros',contacts:'Contactos',signup:'Inscripción',access:'Acceso reservado',account:'Acceso y orientación',vivian:'Vivian Del Lago',heir:'Heredero del tiempo sagrado',privacy:'Política de privacidad',cookies:'Política de cookies',notFound:'Página no encontrada',article:'Artículo'},
    de:{home:'Startseite',archive:'Archiv',premiumArchive:'Premium-Archiv',teachings:'Lehrwege',lessons:'Lektionen und Seminare',books:'Bücher',contacts:'Kontakte',signup:'Anmelden',access:'Geschützter Zugang',account:'Zugang und Orientierung',vivian:'Vivian Del Lago',heir:'Erbe der heiligen Zeit',privacy:'Datenschutzerklärung',cookies:'Cookie-Richtlinie',notFound:'Seite nicht gefunden',article:'Artikel'},
    ru:{home:'Главная',archive:'Архив',premiumArchive:'Премиум-архив',teachings:'Обучение',lessons:'Уроки и семинары',books:'Книги',contacts:'Контакты',signup:'Записаться',access:'Закрытый доступ',account:'Доступ и ориентирование',vivian:'Vivian Del Lago',heir:'Наследник священного времени',privacy:'Политика конфиденциальности',cookies:'Политика cookie',notFound:'Страница не найдена',article:'Статья'},
    pt:{home:'Início',archive:'Arquivo',premiumArchive:'Arquivo premium',teachings:'Ensinamentos',lessons:'Lições e seminários',books:'Livros',contacts:'Contactos',signup:'Inscrição',access:'Acesso reservado',account:'Acesso e orientação',vivian:'Vivian Del Lago',heir:'Herdeiro do tempo sagrado',privacy:'Política de Privacidade',cookies:'Política de Cookies',notFound:'Página não encontrada',article:'Artigo'},
    ro:{home:'Acasă',archive:'Arhivă',premiumArchive:'Arhivă premium',teachings:'Învățături',lessons:'Lecții și seminare',books:'Cărți',contacts:'Contacte',signup:'Înscriere',access:'Acces rezervat',account:'Acces și orientare',vivian:'Vivian Del Lago',heir:'Moștenitorul timpului sacru',privacy:'Politica de confidențialitate',cookies:'Politica cookie',notFound:'Pagină negăsită',article:'Articol'},
    pl:{home:'Strona główna',archive:'Archiwum',premiumArchive:'Archiwum premium',teachings:'Nauczanie',lessons:'Lekcje i seminaria',books:'Książki',contacts:'Kontakt',signup:'Zapisy',access:'Dostęp zastrzeżony',account:'Dostęp i orientacja',vivian:'Vivian Del Lago',heir:'Dziedzic świętego czasu',privacy:'Polityka prywatności',cookies:'Polityka cookie',notFound:'Strona nie została znaleziona',article:'Artykuł'},
    nl:{home:'Home',archive:'Archief',premiumArchive:'Premiumarchief',teachings:'Leerwegen',lessons:'Lessen en seminars',books:'Boeken',contacts:'Contacten',signup:'Inschrijven',access:'Besloten toegang',account:'Toegang en oriëntatie',vivian:'Vivian Del Lago',heir:'Erfgenaam van de heilige tijd',privacy:'Privacybeleid',cookies:'Cookiebeleid',notFound:'Pagina niet gevonden',article:'Artikel'},
    uk:{home:'Головна',archive:'Архів',premiumArchive:'Преміум-архів',teachings:'Навчання',lessons:'Уроки та семінари',books:'Книги',contacts:'Контакти',signup:'Запис',access:'Закритий доступ',account:'Доступ і орієнтування',vivian:'Vivian Del Lago',heir:'Спадкоємець священного часу',privacy:'Політика конфіденційності',cookies:'Політика cookie',notFound:'Сторінку не знайдено',article:'Стаття'},
    hu:{home:'Főoldal',archive:'Archívum',premiumArchive:'Prémium archívum',teachings:'Tanítások',lessons:'Leckék és szemináriumok',books:'Könyvek',contacts:'Kapcsolat',signup:'Regisztráció',access:'Zárt hozzáférés',account:'Hozzáférés és eligazítás',vivian:'Vivian Del Lago',heir:'A szent idő örököse',privacy:'Adatvédelmi szabályzat',cookies:'Cookie-szabályzat',notFound:'Az oldal nem található',article:'Cikk'}
  }[currentLanguage];

  const storage = {
    get(type, key){
      try {
        const store = type === 'session' ? window.sessionStorage : window.localStorage;
        return store.getItem(key);
      } catch (err) {
        return null;
      }
    },
    set(type, key, value){
      try {
        const store = type === 'session' ? window.sessionStorage : window.localStorage;
        store.setItem(key, value);
        return true;
      } catch (err) {
        return false;
      }
    }
  };


  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setCurrentYear(){
    document.querySelectorAll('[data-current-year]').forEach((node)=>{
      node.textContent = String(new Date().getFullYear());
    });
  }

  function manageHeroVideo(){
    document.querySelectorAll('.hero-video-wrap').forEach((wrap)=>{
      const hero = wrap.closest('.hero');
      if(!hero) return;
      const syncPlayback = (visible)=>{
        const videos = Array.from(wrap.querySelectorAll('.hero-video'));
        if(!videos.length) return;
        const isInternalHero = !isHome || wrap.closest('.hero-min');
        if(isInternalHero || reducedMotion || saveData || coarsePointer || window.innerWidth < 900){
          videos.forEach((video)=>{
            video.removeAttribute('autoplay');
            video.preload = 'none';
            try{ video.pause(); }catch(err){}
            video.setAttribute('aria-hidden','true');
          });
          wrap.dataset.mediaDisabled = 'true';
          return;
        }
        videos.forEach((video)=>{
          video.muted = true;
          video.playsInline = true;
          video.preload = 'metadata';
        });
        if(document.hidden || !visible){
          videos.forEach((video)=>{
            try{ video.pause(); }catch(err){}
          });
          return;
        }
        const activeVideo = wrap.querySelector('.hero-video[data-loop-state="active"]') || videos[0];
        const isCrossfading = wrap.dataset.loopCrossfading === 'true';
        videos.forEach((video)=>{
          if(video !== activeVideo && !isCrossfading){
            try{ video.pause(); }catch(err){}
          }
        });
        if(isCrossfading){
          videos.forEach((video)=>{
            const playPromise = video.play();
            if(playPromise && typeof playPromise.catch === 'function') playPromise.catch(()=>{});
          });
          return;
        }
        const playPromise = activeVideo.play();
        if(playPromise && typeof playPromise.catch === 'function') playPromise.catch(()=>{});
      };
      const getHeroVisibility = ()=>{
        const rect = hero.getBoundingClientRect();
        return rect.bottom > window.innerHeight * 0.2 && rect.top < window.innerHeight * 0.8;
      };
      if(typeof IntersectionObserver === 'function'){
        const observer = new IntersectionObserver((entries)=>{
          syncPlayback(entries[0] && entries[0].isIntersecting);
        }, {threshold: 0.25});
        observer.observe(hero);
      } else {
        syncPlayback(getHeroVisibility());
      }
      document.addEventListener('visibilitychange', ()=>{
        syncPlayback(getHeroVisibility());
      });
    });
  }

  function enhanceHeroMotion(){
    const stage = document.getElementById('stage');
    const logoStack = document.getElementById('logoStack');
    const hero = document.querySelector('body.home-page .hero');
    if(stage && logoStack && hero && allowLogoTilt){
      let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
      let rafId = null;
      stage.style.perspective = '1800px';
      stage.style.transformStyle = 'preserve-3d';
      logoStack.style.transformStyle = 'preserve-3d';
      logoStack.style.transformOrigin = '50% 50%';
      logoStack.style.willChange = 'transform';

      const setFromPoint = (clientX, clientY)=>{
        const rect = hero.getBoundingClientRect();
        if(!rect.width || !rect.height) return;
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        const x = Math.max(-1, Math.min(1, px * 2 - 1));
        const y = Math.max(-1, Math.min(1, py * 2 - 1));
        targetRY = x * 9;
        targetRX = y * -7;
      };

      const onMove = (event)=>{
        setFromPoint(event.clientX, event.clientY);
      };

      const resetTilt = ()=>{
        targetRX = 0;
        targetRY = 0;
      };

      hero.addEventListener('mousemove', onMove, {passive:true});
      hero.addEventListener('pointermove', onMove, {passive:true});
      hero.addEventListener('mouseleave', resetTilt, {passive:true});
      hero.addEventListener('pointerleave', resetTilt, {passive:true});
      window.addEventListener('blur', resetTilt, {passive:true});

      const animateTilt = ()=>{
        currentRX += (targetRX - currentRX) * 0.14;
        currentRY += (targetRY - currentRY) * 0.14;
        logoStack.style.transform = 'rotateX(' + currentRX.toFixed(3) + 'deg) rotateY(' + currentRY.toFixed(3) + 'deg)';
        rafId = window.requestAnimationFrame(animateTilt);
      };

      if(rafId == null) animateTilt();
    }

    const intro = document.querySelector('.intro-overlay');
    if(intro){
      const seen = storage.get('session', 'academy_mra_intro_seen');
      if(seen || !allowEnhancedMotion){
        intro.hidden = true;
      } else {
        intro.hidden = false;
        intro.setAttribute('aria-hidden', 'false');
        storage.set('session', 'academy_mra_intro_seen', '1');
        window.setTimeout(()=>{
          intro.setAttribute('aria-hidden', 'true');
          intro.hidden = true;
        }, 3000);
      }
    }

    const canvas = document.getElementById('particles');
    if(!canvas || !allowEnhancedMotion) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), particles = [], rafId = null;
    function resize(){
      width = window.innerWidth;
      height = Math.max(window.innerHeight, document.querySelector('.hero') ? document.querySelector('.hero').offsetHeight : window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const lowPower = document.documentElement.dataset.performanceTier === 'low';
      const density = lowPower ? 120000 : 42000;
      const minParticles = lowPower ? 8 : 26;
      const count = Math.max(minParticles, Math.floor((width * height) / density));
      particles = Array.from({length: count}, ()=>({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.25,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.22 + 0.04,
        o: Math.random() * 0.24 + 0.06
      }));
    }
    function draw(){
      ctx.clearRect(0, 0, width, height);
      for(const particle of particles){
        particle.a += particle.s * 0.01;
        particle.y -= particle.s;
        particle.x += Math.sin(particle.a) * 0.12;
        if(particle.y < -10){
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(216,186,72,' + particle.o + ')';
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = window.requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener('resize', resize, {passive:true});
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden && rafId){
        window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if(!document.hidden && !rafId){
        draw();
      }
    });
  }


  function applyConsentControlledScripts(choice){
    const accepted = choice === 'accept' || choice === 'all' || choice === 'analytics' || choice === 'marketing';
    document.documentElement.dataset.cookieConsent = choice || 'unset';
    if(!accepted) return;
    document.querySelectorAll('script[type="text/plain"][data-cookie-category], script[data-consent-src]').forEach((blocked)=>{
      const category = blocked.dataset.cookieCategory || 'analytics';
      if(category === 'necessary') return;
      const script = document.createElement('script');
      Array.from(blocked.attributes).forEach((attr)=>{
        if(attr.name === 'type' || attr.name === 'data-cookie-category' || attr.name === 'data-consent-src') return;
        script.setAttribute(attr.name, attr.value);
      });
      if(blocked.dataset.consentSrc) script.src = blocked.dataset.consentSrc;
      if(blocked.textContent && !script.src) script.textContent = blocked.textContent;
      script.dataset.cookieCategory = category;
      blocked.replaceWith(script);
    });
    document.querySelectorAll('iframe[data-consent-src]').forEach((frame)=>{
      const category = frame.dataset.cookieCategory || 'marketing';
      if(category === 'necessary') return;
      frame.src = frame.dataset.consentSrc;
      frame.removeAttribute('srcdoc');
      frame.classList.remove('consent-blocked-iframe');
      frame.setAttribute('data-consent-loaded','true');
    });
  }

  function ensureFieldAccessibility(form){
    form.querySelectorAll('input, textarea, select').forEach((control, index)=>{
      if(control.type === 'hidden' || control.classList.contains('hp-field')) return;
      if(!control.id){
        const base = control.name || control.type || 'field';
        control.id = (form.id || form.dataset.formType || 'form') + '-' + base.replace(/[^a-z0-9_-]/gi,'-') + '-' + index;
      }
      const escapedId = (window.CSS && CSS.escape) ? CSS.escape(control.id) : String(control.id).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
      const label = form.querySelector('label[for="' + escapedId + '"]') || control.closest('label');
      if(!label){
        const generated = document.createElement('label');
        generated.className = 'sr-only';
        generated.setAttribute('for', control.id);
        generated.textContent = control.getAttribute('aria-label') || control.getAttribute('placeholder') || control.name || 'Campo modulo';
        control.insertAdjacentElement('beforebegin', generated);
      }
      if(control.required) control.setAttribute('aria-required','true');
      let err = null;
      const described = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      err = described.map((id)=> document.getElementById(id)).find((node)=> node && node.classList.contains('field-error')) || null;
      if(!err){
        err = document.createElement('span');
        err.className = 'field-error';
        err.id = control.id + '-error';
        err.setAttribute('aria-live','polite');
        control.insertAdjacentElement('afterend', err);
        described.push(err.id);
        control.setAttribute('aria-describedby', Array.from(new Set(described)).join(' '));
      }
      const updateValidity = ()=>{
        if(control.validity && !control.validity.valid){
          control.setAttribute('aria-invalid','true');
          err.textContent = control.validationMessage || 'Campo da controllare.';
        }else{
          control.setAttribute('aria-invalid','false');
          err.textContent = '';
        }
      };
      control.addEventListener('invalid', updateValidity);
      control.addEventListener('input', updateValidity);
      control.addEventListener('change', updateValidity);
      control.setAttribute('aria-invalid','false');
    });
  }

  function enhanceCookieBanner(){
    const cookieKey = 'academy_mra_cookie_choice';
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieButtons = document.querySelectorAll('[data-cookie-choice]');
    if(!cookieBanner) return;
    const choice = storage.get('local', cookieKey);
    applyConsentControlledScripts(choice);
    const revealBanner = !choice;
    cookieBanner.hidden = !revealBanner;
    cookieBanner.setAttribute('aria-hidden', revealBanner ? 'false' : 'true');
    if(revealBanner){
      const firstAction = cookieBanner.querySelector('[data-cookie-choice]');
      if(firstAction){
        window.setTimeout(()=>{
          if(document.activeElement === document.body) firstAction.focus();
        }, 80);
      }
    }
    cookieButtons.forEach((button)=>{
      button.addEventListener('click', ()=>{
        const nextChoice = button.dataset.cookieChoice;
        storage.set('local', cookieKey, nextChoice);
        applyConsentControlledScripts(nextChoice);
        cookieBanner.hidden = true;
        cookieBanner.setAttribute('aria-hidden', 'true');
      });
    });
  }

  function showFormStatus(form, message, type){
    let status = form.querySelector('.form-status');
    if(!status){
      status = document.createElement('p');
      status.className = 'form-status';
      form.appendChild(status);
    }
    const resolvedType = type || 'success';
    status.textContent = message;
    status.dataset.type = resolvedType;
    status.setAttribute('role', resolvedType === 'error' ? 'alert' : 'status');
    status.setAttribute('aria-live', resolvedType === 'error' ? 'assertive' : 'polite');
  }

  function enhanceForms(){
    document.querySelectorAll('form').forEach((form)=>{
      ensureFieldAccessibility(form);
      if(!form.querySelector('.hp-field')){
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.autocomplete = 'off';
        honeypot.tabIndex = -1;
        honeypot.className = 'hp-field';
        honeypot.setAttribute('aria-hidden', 'true');
        form.appendChild(honeypot);
      }
      if(!form.dataset.formStart) form.dataset.formStart = String(Date.now());
      form.setAttribute('novalidate', 'novalidate');
      form.querySelectorAll('input[type="email"]').forEach((input)=>{
        input.required = true;
        if(!input.autocomplete) input.autocomplete = 'email';
      });
      form.addEventListener('submit', async (event)=>{
        const elapsed = Date.now() - Number(form.dataset.formStart || Date.now());
        const honeypot = form.querySelector('input[name="website"]');
        if(honeypot && honeypot.value.trim() !== ''){
          event.preventDefault();
          return;
        }
        if(elapsed < 900){
          event.preventDefault();
          showFormStatus(form, uiText.formTooFast, 'error');
          return;
        }
        if(!form.checkValidity()){
          event.preventDefault();
          form.reportValidity();
          showFormStatus(form, uiText.formInvalid, 'error');
          return;
        }
        if(form.dataset.authMode === 'server'){
          return;
        }

        const action = form.getAttribute('action');
        if(action && action.startsWith('/api/')){
          event.preventDefault();
          const submitter = form.querySelector('[type="submit"]');
          if(submitter) submitter.disabled = true;
          try {
            const response = await fetch(action, {
              method: (form.getAttribute('method') || 'POST').toUpperCase(),
              body: new FormData(form),
              credentials: 'same-origin',
              headers: {'Accept':'application/json'}
            });
            if(response.ok){
              showFormStatus(form, form.dataset.successMessage || 'Richiesta inviata correttamente.', 'success');
              form.reset();
              form.dataset.formStart = String(Date.now());
            } else {
              showFormStatus(form, form.dataset.backendMessage || uiText.connectEndpoint, 'error');
            }
          } catch(error) {
            showFormStatus(form, form.dataset.backendMessage || uiText.connectEndpoint, 'error');
          } finally {
            if(submitter) submitter.disabled = false;
          }
          return;
        }

        event.preventDefault();
        showFormStatus(form, uiText.connectEndpoint, 'info');
      });
    });
  }



  function enhanceRegistrationForms(){
    const forms = document.querySelectorAll('form[data-register-form="true"]');
    if(!forms.length) return;
    forms.forEach((form)=>{
      const select = form.querySelector('select[name="plan"]');
      if(select){
        const params = new URLSearchParams(window.location.search);
        const requestedPlan = (params.get('piano') || params.get('plan') || '').trim();
        if(requestedPlan){
          const requestedLower = requestedPlan.toLowerCase();
          const match = Array.from(select.options).find((option)=>{
            return String(option.value || '').toLowerCase() === requestedLower || String(option.textContent || '').toLowerCase().includes(requestedLower);
          });
          if(match) select.value = match.value;
        }
      }
    });
  }


  async function enhanceServerLogin(){
    const forms = document.querySelectorAll('form[data-auth-mode="server"], form[action="/api/login"]');
    if(!forms.length) return;
    forms.forEach((form)=>{
      form.addEventListener('submit', async (event)=>{
        event.preventDefault();
        if(!form.checkValidity()){
          form.reportValidity();
          return;
        }
        const passwordField = form.querySelector('input[name="password"]');
        const passwordConfirm = form.querySelector('input[name="password_confirm"]');
        if(passwordField && passwordConfirm && passwordField.value !== passwordConfirm.value){
          showFormStatus(form, form.dataset.passwordMismatch || 'Le password non coincidono.', 'error');
          passwordConfirm.focus();
          return;
        }
        const payload = Object.fromEntries(new FormData(form).entries());
        try{
          showFormStatus(form, form.dataset.authLoading || 'Verifica sicura in corso…', 'info');
          const response = await fetch(form.getAttribute('action') || '/api/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json', 'Accept':'application/json'},
            credentials: 'include',
            body: JSON.stringify(payload),
            cache: 'no-store'
          });
          const data = await response.json().catch(()=>({ok:false}));
          if(!response.ok || !data.ok){
            showFormStatus(form, data.message || data.error || form.dataset.authError || 'Operazione non riuscita.', 'error');
            return;
          }
          showFormStatus(form, form.dataset.authOk || 'Accesso riuscito.', 'success');
          window.setTimeout(()=>{ window.location.href = form.dataset.authSuccess || 'account.html'; }, 350);
        } catch(error){
          showFormStatus(form, 'Backend non raggiungibile. Verifica che l’endpoint ' + (form.getAttribute('action') || '/api/login') + ' sia attivo.', 'error');
        }
      });
    });
  }



  async function enhanceAccountSession(){
    const holder = document.querySelector('[data-session-card]');
    if(!holder) return;
    try{
      const response = await fetch('/api/me', {credentials:'include', headers:{'Accept':'application/json'}, cache:'no-store'});
      const data = await response.json().catch(()=>({ok:false}));
      if(!response.ok || !data.ok || !data.user){
        holder.innerHTML = '<div class="card"><h3>Accesso richiesto</h3><p>Questa area deve essere servita da un backend sicuro. Effettua l’accesso dopo aver collegato /api/login e /api/me.</p><div class="cta-row"><a class="btn btn-primary" href="login.html">Accedi</a><a class="btn btn-secondary" href="piani.html">Scegli un piano</a></div></div>';
        return;
      }
      const user = data.user;
      window.__academyMraSession = user;
      holder.innerHTML = '<div class="card"><h3>Benvenuto</h3><p><strong>' + escapeHtml(user.name || user.email || 'Account') + '</strong></p><p class="meta">Email: ' + escapeHtml(user.email || '') + '<br/>Tipo account: ' + escapeHtml(user.accountType || user.role || 'registrato') + '</p><div class="cta-row"><a class="btn btn-secondary" href="archivio-premium.html">Archivio premium</a><button class="btn btn-primary account-logout-button" type="button" data-logout-session>Esci</button></div></div>';
      const logout = holder.querySelector('[data-logout-session]');
      if(logout){
        logout.addEventListener('click', async ()=>{
          await removeAcademyMraSession();
          window.location.href = 'login.html';
        });
      }
    } catch(error){
      holder.innerHTML = '<div class="card"><h3>Backend richiesto</h3><p>La pagina account non usa più sessioni locali manipolabili. Collega /api/me a una sessione server-side prima del lancio.</p><div class="cta-row"><a class="btn btn-primary" href="login.html">Accedi</a></div></div>';
    }
  }


  async function removeAcademyMraSession(){
    try { await fetch('/api/logout', {method:'POST', credentials:'include', headers:{'Accept':'application/json'}}); } catch(error) {}
    window.__academyMraSession = null;
  }

  function getAcademyMraSession(){
    return window.__academyMraSession || null;
  }

  function hasActiveSubscription(subscription){
    if(!subscription || typeof subscription !== 'object') return false;
    const status = String(subscription.status || '').toLowerCase();
    if(status !== 'active') return false;
    const expiresAt = subscription.expiresAt || subscription.expires_at || '';
    if(!expiresAt) return true;
    const expiry = new Date(String(expiresAt));
    if(Number.isNaN(expiry.getTime())) return true;
    return expiry.getTime() >= Date.now();
  }

  function isPremiumSession(session){
    if(!session) return false;
    if(String(session.accountType || '').toLowerCase() === 'premium') return true;
    if(String(session.role || '').toLowerCase() === 'premium') return true;
    if(hasActiveSubscription(session.subscription)) return true;
    return Array.isArray(session.permissions) && session.permissions.includes('articles:premium');
  }

  function getAccountTypeLabel(session){
    return isPremiumSession(session) ? 'Premium / abbonato' : 'Registrato';
  }

  function getAuthDisplayName(session){
    if(!session) return '';
    const fullName = [session.firstName, session.lastName].map((part)=> String(part || '').trim()).filter(Boolean).join(' ');
    const name = fullName || String(session.name || '').trim() || String(session.email || '').trim();
    return name || 'Account';
  }

  function normalizeArticleAccessLevel(value){
    const level = String(value || 'public').toLowerCase();
    if(level === 'premium') return 'premium';
    if(level === 'registered' || level === 'member' || level === 'reserved') return 'registered';
    return 'public';
  }

  function canSessionAccessLevel(session, level){
    const accessLevel = normalizeArticleAccessLevel(level);
    if(accessLevel === 'public') return true;
    if(accessLevel === 'registered') return !!session;
    if(accessLevel === 'premium') return isPremiumSession(session);
    return false;
  }


  function syncAuthStateClasses(session){
    const active = !!session;
    html.classList.toggle('is-authenticated', active);
    html.classList.toggle('is-guest', !active);
    html.dataset.authState = active ? 'authenticated' : 'guest';
    body.classList.toggle('is-authenticated', active);
    body.classList.toggle('is-guest', !active);
    body.dataset.authState = active ? 'authenticated' : 'guest';
  }

  function isGuestAuthLink(link){
    if(!link) return false;
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0];
    const pageName = href.split('/').pop();
    const label = (link.textContent || '').trim().toLowerCase();
    return ['login.html','accedi.html','piani.html','registrazione.html'].includes(pageName)
      || ['accedi','accesso','registrazione','registrati','iscriviti'].includes(label);
  }

  function getAuthGuestItems(){
    const selectors = [
      '[data-auth-nav="guest"]',
      '.auth-guest-only',
      '.topbar .menu a[href$="login.html"]',
      '.topbar .menu a[href$="accedi.html"]',
      '.topbar .menu a[href$="piani.html"]',
      '.topbar .menu a[href$="registrazione.html"]'
    ];
    const items = [];
    document.querySelectorAll(selectors.join(',')).forEach((node)=>{
      const item = node.matches && node.matches('.menu-item') ? node : node.closest('.menu-item');
      if(item && !items.includes(item)) items.push(item);
    });
    document.querySelectorAll('.topbar .menu .menu-item.cta').forEach((item)=>{
      const link = item.querySelector('a[href]');
      if(isGuestAuthLink(link) && !items.includes(item)) items.push(item);
    });
    return items;
  }

  function setGuestItemVisible(item, visible){
    if(!item) return;
    item.classList.add('auth-guest-only');
    item.setAttribute('data-auth-nav', 'guest');
    item.hidden = !visible;
    item.classList.toggle('auth-hidden', !visible);
    item.setAttribute('aria-hidden', visible ? 'false' : 'true');
    if(visible){
      item.style.removeProperty('display');
      item.style.removeProperty('visibility');
    } else {
      item.style.setProperty('display', 'none', 'important');
      item.style.setProperty('visibility', 'hidden', 'important');
    }
  }

  function enhanceAuthNavigation(){
    const session = getAcademyMraSession();
    syncAuthStateClasses(session);

    const guestAuthItems = getAuthGuestItems();
    guestAuthItems.forEach((item)=> setGuestItemVisible(item, !session));

    // Hard fallback: hide every visible ACCEDI / REGISTRAZIONE / ISCRIVITI link when a session exists,
    // even if a page or wizard generated it without data-auth-nav.
    if(session){
      document.querySelectorAll('a[href]').forEach((link)=>{
        if(!isGuestAuthLink(link)) return;
        const item = link.closest('.menu-item') || link;
        if(item.classList) item.classList.add('auth-guest-only');
        item.setAttribute('data-auth-nav', 'guest');
        item.hidden = true;
        item.style.setProperty('display', 'none', 'important');
        item.style.setProperty('visibility', 'hidden', 'important');
      });
    }

    const menu = document.querySelector('.topbar .menu');
    if(!menu) return;

    // Rebuild logged-in controls every time to avoid stale duplicated buttons.
    menu.querySelectorAll('.auth-account-item, .auth-logout-item').forEach((item)=> item.remove());

    if(!session) return;

    const accountLabel = getAuthDisplayName(session);
    const accountItem = document.createElement('li');
    accountItem.className = 'menu-item cta auth-account-item';
    accountItem.setAttribute('data-auth-nav', 'account');

    const accountLink = document.createElement('a');
    accountLink.className = 'btn-link auth-account-button';
    accountLink.href = 'account.html';
    accountLink.textContent = accountLabel;
    accountLink.setAttribute('aria-label', 'Account: ' + accountLabel);
    accountItem.appendChild(accountLink);

    const labelMap = {
      it:'Esci',
      en:'Log out',
      fr:'Se déconnecter',
      es:'Cerrar sesión',
      de:'Abmelden',
      ru:'Выйти',
      pt:'Sair',
      ro:'Deconectare',
      pl:'Wyloguj',
      nl:'Uitloggen',
      uk:'Вийти',
      hu:'Kijelentkezés'
    };
    const logoutLabel = labelMap[currentLanguage] || labelMap.it;
    const logoutItem = document.createElement('li');
    logoutItem.className = 'menu-item cta auth-logout-item';
    logoutItem.setAttribute('data-auth-nav', 'logout');

    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'btn-link auth-logout-button';
    logoutButton.setAttribute('data-nav-logout-session', '');
    logoutButton.setAttribute('aria-label', logoutLabel);
    logoutButton.setAttribute('title', logoutLabel);
    logoutButton.innerHTML = '<svg aria-hidden="true" class="auth-logout-icon" viewBox="0 0 24 24" focusable="false"><path class="auth-logout-door" d="M10.5 4.75H6.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h3.75"></path><path class="auth-logout-arrow" d="M14 8.25 17.75 12 14 15.75"></path><path class="auth-logout-line" d="M8.75 12h8.75"></path></svg><span class="sr-only">' + logoutLabel + '</span>';

    logoutButton.addEventListener('click', ()=>{
      removeAcademyMraSession();
      syncAuthStateClasses(null);
      enhanceAuthNavigation();
      window.location.href = 'login.html';
    });

    logoutItem.appendChild(logoutButton);
    const languageSwitcher = menu.querySelector('.language-switcher');
    if(languageSwitcher){
      menu.insertBefore(accountItem, languageSwitcher);
      menu.insertBefore(logoutItem, languageSwitcher);
    } else {
      menu.appendChild(accountItem);
      menu.appendChild(logoutItem);
    }
  }

  function watchAuthNavigation(){
    enhanceAuthNavigation();
    window.addEventListener('pageshow', enhanceAuthNavigation);
    window.addEventListener('focus', enhanceAuthNavigation);
    window.addEventListener('storage', (event)=>{
      if(!event.key || event.key === 'academyMraSession') enhanceAuthNavigation();
    });
    const menu = document.querySelector('.topbar .menu');
    if(menu && 'MutationObserver' in window){
      let scheduled = false;
      const observer = new MutationObserver(()=>{
        if(scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(()=>{
          scheduled = false;
          window.dispatchEvent(new Event("academyMraAuthChanged"));
        });
      });
      observer.observe(menu, {childList:true, subtree:true});
    }
  }

  function ensureArticleAccessGateStyles(){
    if(document.getElementById('article-access-gate-runtime-style')) return;
    const style = document.createElement('style');
    style.id = 'article-access-gate-runtime-style';
    style.textContent = '.article-access-gate{min-height:60vh;display:flex;align-items:center;padding:clamp(36px,6vw,76px) 18px}.article-access-gate .section-inner{width:min(100%,960px);margin:0 auto}.access-gate-card{max-width:780px;margin:0 auto;text-align:center;padding:clamp(28px,5vw,54px);border:1px solid rgba(88,69,34,.14);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,255,255,.84));box-shadow:0 22px 56px rgba(39,27,10,.07)}.access-gate-card h1{font-size:clamp(34px,5vw,62px);line-height:1;margin:0 0 18px;letter-spacing:-.04em}.access-gate-card p{max-width:58ch;margin:0 auto 24px;color:#6b5d49;font-size:18px}.access-gate-card .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.access-gate-card .eyebrow{display:block;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9d7d36;margin-bottom:14px}';
    document.head.appendChild(style);
  }

  function enhanceArticleAccessGate(){
    const metaAccess = document.querySelector('meta[name="article-access"]')?.getAttribute('content');
    const metaPlan = document.querySelector('meta[name="requires-plan"]')?.getAttribute('content');
    const bodyAccess = document.body?.dataset?.accessLevel;
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const forcedPremiumPages = ['archivio-premium.html'];
    let accessLevel = normalizeArticleAccessLevel(metaAccess || bodyAccess || 'public');

    if(accessLevel === 'public' && (metaPlan === 'paid' || forcedPremiumPages.includes(pageName))){
      accessLevel = 'premium';
    }
    if(accessLevel === 'public') return;

    const session = getAcademyMraSession();
    if(canSessionAccessLevel(session, accessLevel)){
      document.documentElement.classList.add('article-access-authorized');
      return;
    }

    const main = document.querySelector('main');
    if(!main) return;
    ensureArticleAccessGateStyles();

    const loginUrl = 'login.html';
    const signupUrl = 'piani.html';
    const isPremium = accessLevel === 'premium';
    const title = isPremium ? 'Contenuto riservato agli abbonati' : 'Contenuto riservato agli utenti registrati';
    const message = isPremium
      ? 'Per leggere questo articolo devi avere effettuato l’accesso con un account registrato e un abbonamento attivo.'
      : 'Per leggere questo articolo devi effettuare l’accesso con un account registrato.';
    const secondary = isPremium
      ? '<a class="btn btn-secondary" href="' + signupUrl + '">Attiva abbonamento</a>'
      : '<a class="btn btn-secondary" href="' + signupUrl + '">Registrati</a>';

    main.innerHTML = '<section class="section article-access-gate"><div class="section-inner"><div class="card access-gate-card"><span class="eyebrow">Accesso richiesto</span><h1>' + title + '</h1><p>' + message + '</p><div class="cta-row"><a class="btn btn-primary" href="' + loginUrl + '">Accedi</a>' + secondary + '</div></div></div></section>';
    document.documentElement.classList.add('article-access-denied');
  }

  function enhancePasswordToggle(){
    document.querySelectorAll('[data-toggle-password]').forEach((button)=>{
      button.addEventListener('click', ()=>{
        const input = document.querySelector(button.dataset.togglePassword);
        if(!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const nextLabel = isPassword ? uiText.hidePassword : uiText.showPassword;
        button.textContent = nextLabel;
        button.setAttribute('aria-label', nextLabel);
        button.setAttribute('title', nextLabel);
        button.setAttribute('aria-pressed', String(isPassword));
      });
    });
  }

  function closeAllDropdowns(except){
    document.querySelectorAll('.menu-item.has-dropdown').forEach((item)=>{
      const button = item.querySelector('.dropdown-toggle');
      if(!button || button === except) return;
      button.setAttribute('aria-expanded', 'false');
      item.classList.remove('is-open');
    });
  }

  
function closeMobileNav(){
    body.classList.remove('nav-open');
    body.classList.remove('mobile-menu-open');
    document.querySelectorAll('.topbar.is-menu-open').forEach((nav)=>{
      nav.classList.remove('is-menu-open');
      const toggle = nav.querySelector('.mobile-menu-toggle');
      if(toggle){
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', uiText.openMenu);
      }
    });
    closeAllDropdowns();
  }

  function enhanceNavigation(){
    const nav = document.querySelector('.topbar');
    const menu = nav ? nav.querySelector('.menu') : null;
    if(!nav || !menu) return;

    const existingMobileToggle = nav.querySelector('.mobile-menu-toggle');
    if(existingMobileToggle){
      menu.id = menu.id || 'main-menu';
      existingMobileToggle.setAttribute('aria-controls', menu.id);
      existingMobileToggle.setAttribute('aria-expanded', 'false');
      existingMobileToggle.setAttribute('aria-label', uiText.openMenu);
    }

    document.querySelectorAll('.dropdown-toggle').forEach((button, index)=>{
      const item = button.closest('.menu-item');
      const menuPanel = item ? item.querySelector('.dropdown-menu') : null;
      if(!menuPanel) return;
      const menuId = menuPanel.id || 'dropdown-menu-' + (index + 1);
      menuPanel.id = menuId;
      button.setAttribute('aria-controls', menuId);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-haspopup', 'true');
      if(button.dataset.dropdownReady === 'true') return;
      button.dataset.dropdownReady = 'true';
      button.addEventListener('click', (event)=>{
        event.stopPropagation();
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(button);
        button.setAttribute('aria-expanded', String(!isOpen));
        item.classList.toggle('is-open', !isOpen);
      });
      button.addEventListener('keydown', (event)=>{
        if(event.key === 'Escape'){
          button.setAttribute('aria-expanded', 'false');
          item.classList.remove('is-open');
          button.focus();
        }
        if(event.key === 'ArrowDown'){
          event.preventDefault();
          button.setAttribute('aria-expanded', 'true');
          item.classList.add('is-open');
          const firstLink = menuPanel.querySelector('a');
          if(firstLink) firstLink.focus();
        }
      });
    });

    document.addEventListener('click', (event)=>{
      if(!event.target.closest('.has-dropdown')) closeAllDropdowns();
    });

    document.addEventListener('keydown', (event)=>{
      if(event.key === 'Escape') closeMobileNav();
    });

    document.querySelectorAll('.menu a.active').forEach((link)=> link.setAttribute('aria-current', 'page'));
  }


  function enhanceProgressUi(){
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.innerHTML = '<span></span>';
    document.body.appendChild(progress);
    const progressBar = progress.querySelector('span');

    const backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', uiText.backToTop);
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);
    backToTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior: reducedMotion ? 'auto' : 'smooth'}));

    const update = ()=>{
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? (window.scrollY / max) : 0;
      progressBar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
      backToTop.classList.toggle('is-visible', window.scrollY > 520);
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update, {passive:true});
  }

  function enhanceBreadcrumbs(){
    if(isHome) return;
    const main = document.getElementById('main-content');
    if(!main || main.querySelector('.breadcrumb-trail')) return;
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const map = {
      'archivio.html': [[pageLabels.home, 'index.html'], [pageLabels.archive, null]],
      'archivio-premium.html': [[pageLabels.home, 'index.html'], [pageLabels.premiumArchive, null]],
      'insegnamenti.html': [[pageLabels.home, 'index.html'], [pageLabels.teachings, null]],
      'lezioni-seminari.html': [[pageLabels.home, 'index.html'], [pageLabels.lessons, null]],
      'corsi.html': [[pageLabels.home, 'index.html'], [pageLabels.courses, null]],
      'seminari.html': [[pageLabels.home, 'index.html'], [pageLabels.seminars, null]],
      'libri.html': [[pageLabels.home, 'index.html'], [pageLabels.books, null]],
      'contatti.html': [[pageLabels.home, 'index.html'], [pageLabels.contacts, null]],
      'piani.html': [[pageLabels.home, 'index.html'], ['Piani', null]],
      'login.html': [[pageLabels.home, 'index.html'], [pageLabels.access, null]],
      'account.html': [[pageLabels.home, 'index.html'], [pageLabels.account, null]],
      'vivian-del-lago.html': [[pageLabels.home, 'index.html'], [pageLabels.vivian, null]],
      'erede-del-tempo-sacro.html': [[pageLabels.home, 'index.html'], [pageLabels.vivian, 'vivian-del-lago.html'], [pageLabels.heir, null]],
      'privacy-policy.html': [[pageLabels.home, 'index.html'], [pageLabels.privacy, null]],
      'cookie-policy.html': [[pageLabels.home, 'index.html'], [pageLabels.cookies, null]],
      '404.html': [[pageLabels.home, 'index.html'], [pageLabels.notFound, null]]
    };
    if(page.indexOf('articolo-') === 0){
      map[page] = [[pageLabels.home, 'index.html'], [pageLabels.archive, 'archivio.html'], [document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : pageLabels.article, null]];
    }
    const crumbs = map[page];
    if(!crumbs) return;
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb-trail';
    nav.setAttribute('aria-label', uiText.breadcrumb);
    const list = document.createElement('ol');
    crumbs.forEach(([label, href], index)=>{
      const item = document.createElement('li');
      if(href && index !== crumbs.length - 1){
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        item.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = label;
        if(index === crumbs.length - 1) span.setAttribute('aria-current', 'page');
        item.appendChild(span);
      }
      list.appendChild(item);
    });
    nav.appendChild(list);
    main.insertBefore(nav, main.firstElementChild);
  }

  function normalizeArchiveSearchText(value){
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function enhanceArchiveFilter(){
    if(document.body.classList.contains('home-page')) return;
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isArticleArchive = /^(archivio|articoli-(pubblici|registrati|premium))\.html$/.test(currentPage);
    if(!isArticleArchive) return;
    const cards = [...document.querySelectorAll('.article-card')];
    if(!cards.length) return;
    const anchor = cards[0].closest('.section-inner');
    if(!anchor || anchor.querySelector('.archive-tools')) return;
    const tools = document.createElement('div');
    tools.className = 'archive-tools';
    tools.innerHTML = [
      '<label class="archive-search">',
      '<span class="sr-only">' + uiText.searchArchive + '</span>',
      '<input type="search" placeholder="' + uiText.searchPlaceholder + '" autocomplete="off">',
      '</label>',
      '<div class="archive-count" aria-live="polite"></div>'
    ].join('');
    const cardsWrap = cards[0].parentElement;
    anchor.insertBefore(tools, cardsWrap);
    const count = tools.querySelector('.archive-count');
    const input = tools.querySelector('input');
    const empty = document.createElement('p');
    empty.className = 'archive-empty';
    empty.hidden = true;
    empty.textContent = uiText.emptyArchive;
    cardsWrap.after(empty);
    cards.forEach((card)=>{
      const title = card.querySelector('h1,h2,h3,a') ? card.querySelector('h1,h2,h3,a').textContent : '';
      const dateMatch = (card.textContent || '').match(/\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b/);
      const date = dateMatch ? dateMatch[0] : '';
      const searchable = [title, date, date.replace(/[\/.\-]/g, ' '), date.replace(/\D/g, '')].join(' ');
      card.dataset.searchText = normalizeArchiveSearchText(searchable);
    });
    const update = ()=>{
      const query = normalizeArchiveSearchText(input.value);
      let visible = 0;
      cards.forEach((card)=>{
        const match = !query || card.dataset.searchText.indexOf(query) !== -1;
        card.hidden = !match;
        card.style.display = match ? '' : 'none';
        if(match) visible += 1;
      });
      count.textContent = visible + ' ' + (visible === 1 ? uiText.availableOne : uiText.availableMany);
      empty.hidden = visible !== 0;
    };
    input.addEventListener('input', update);
    update();
  }

  function enhanceArticlePages(){
    const article = document.querySelector('.article-layout article.card');
    if(!article) return;
    const sideCard = document.querySelector('.article-layout aside.card');
    const paragraphs = [...article.querySelectorAll('p')].map((node)=> node.textContent.trim()).join(' ');
    const wordCount = paragraphs.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 190));
    const articleType = article.querySelector('.tag') ? article.querySelector('.tag').textContent.trim() : 'Articolo';
    const panel = document.createElement('div');
    panel.className = 'article-insight-panel';
    panel.innerHTML = [
      '<div class="list">',
      '<div class="list-item"><strong>' + uiText.readingTime + '</strong><p>' + uiText.about + ' ' + minutes + ' ' + uiText.min + '</p></div>',
      '<div class="list-item"><strong>' + uiText.format + '</strong><p>' + articleType + '</p></div>',
      '<div class="list-item"><strong>' + uiText.reading + '</strong><p>' + uiText.readingDesc + '</p></div>',
      '</div>'
    ].join('');
    if(sideCard){ sideCard.appendChild(panel); }
  }

  function detectCurrentLanguage(){
    return currentLanguage;
  }

  function buildLanguagePath(targetLang){
    const supported = ['en','fr','es','de','nl','hu'];
    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || '';
    const hasExplicitFile = !!lastPart && lastPart.includes('.');
    const rawPage = hasExplicitFile ? lastPart : 'index.html';
    const pageAliases = {
      'corsi.html': {it:'corsi.html', fallback:'insegnamenti.html'},
      'insegnamenti.html': {it:'corsi.html', fallback:'insegnamenti.html'},
      'seminari.html': {it:'seminari.html', fallback:'lezioni-seminari.html'},
      'lezioni-seminari.html': {it:'seminari.html', fallback:'lezioni-seminari.html'},
      'corso-alchimia-vegetale.html': {it:'corso-alchimia-vegetale.html', fallback:'insegnamenti.html'},
      'corso-astrologia-originale.html': {it:'corso-astrologia-originale.html', fallback:'insegnamenti.html'},
      'corso-deprogrammazione-anima.html': {it:'corso-deprogrammazione-anima.html', fallback:'insegnamenti.html'},
      'corso-geometria-sacra.html': {it:'corso-geometria-sacra.html', fallback:'insegnamenti.html'},
      'corso-magia-bruniana.html': {it:'corso-magia-bruniana.html', fallback:'insegnamenti.html'},
      'corso-magia-sintetica-trasmutatoria.html': {it:'corso-magia-sintetica-trasmutatoria.html', fallback:'insegnamenti.html'},
      'corso-scienza-della-volonta.html': {it:'corso-scienza-della-volonta.html', fallback:'insegnamenti.html'},
      'corso-splendor-solis.html': {it:'corso-splendor-solis.html', fallback:'insegnamenti.html'},
      'corso-tarocchi.html': {it:'corso-tarocchi.html', fallback:'insegnamenti.html'},
      'corso-taumaturgia.html': {it:'corso-taumaturgia.html', fallback:'insegnamenti.html'}
    };
    const alias = pageAliases[rawPage];
    const page = alias ? (targetLang === 'it' ? alias.it : (alias[targetLang] || alias.fallback || rawPage)) : rawPage;
    const baseParts = hasExplicitFile ? parts.slice(0, -1) : parts.slice();
    const currentDir = baseParts[baseParts.length - 1] || '';
    const currentLang = supported.includes(currentDir) ? currentDir : 'it';

    if(window.location.protocol === 'file:'){
      if(currentLang === 'it'){
        return (targetLang === 'it' ? '' : targetLang + '/') + page + window.location.search + window.location.hash;
      }
      return (targetLang === 'it' ? '../' : '../' + targetLang + '/') + page + window.location.search + window.location.hash;
    }

    let outputBase = baseParts.slice();
    if(supported.includes(currentDir)){
      outputBase = baseParts.slice(0, -1);
    }
    if(targetLang !== 'it') outputBase.push(targetLang);
    const path = '/' + [...outputBase, page].join('/');
    return path + window.location.search + window.location.hash;
  }


  function enhanceCustomCursor(){
    if(reducedMotion || coarsePointer || window.innerWidth <= 1023) return;
    const existingDot = document.querySelector('.cursor-dot');
    const existingRing = document.querySelector('.cursor-ring');
    if(existingDot || existingRing) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let shown = true;

    const paintDot = ()=>{
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      dot.style.opacity = '1';
      dot.style.visibility = 'visible';
    };
    const paintRing = ()=>{
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      ring.style.opacity = '1';
      ring.style.visibility = 'visible';
    };

    paintDot();
    paintRing();

    const moveCursor = (event)=>{
      mouseX = event.clientX;
      mouseY = event.clientY;
      shown = true;
      paintDot();
    };

    window.addEventListener('pointermove', moveCursor, {passive:true});
    window.addEventListener('mousemove', moveCursor, {passive:true});

    document.addEventListener('pointerdown', ()=> ring.classList.add('is-active'));
    document.addEventListener('pointerup', ()=> ring.classList.remove('is-active'));

    const interactiveSelector = 'a[href], button, input, textarea, select, label, summary, .btn, [role="button"], [tabindex]:not([tabindex="-1"])';
    const formSelector = 'input, textarea, select';
    const setCursorState = (target)=>{
      const interactive = target && target.closest ? target.closest(interactiveSelector) : null;
      ring.classList.toggle('is-hover', Boolean(interactive));
      ring.classList.toggle('is-form', Boolean(interactive && interactive.matches(formSelector)));
    };
    document.addEventListener('pointerover', (event)=> setCursorState(event.target), {passive:true});
    document.addEventListener('pointerout', (event)=>{
      if(!event.relatedTarget || !event.relatedTarget.closest || !event.relatedTarget.closest(interactiveSelector)){
        ring.classList.remove('is-hover', 'is-form');
      }
    }, {passive:true});

    const animate = ()=>{
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      if(shown) paintRing();
      window.requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mouseleave', ()=>{
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      shown = false;
    });
    document.addEventListener('mouseenter', ()=>{
      shown = true;
      paintDot();
      paintRing();
    });
  }


  function smoothHeroVideoLoops(){
    if(!isHome || reducedMotion || saveData) return;
    const minRate = 0.58;
    const edgeWindow = 1.45;
    const midpointWindow = 1.2;
    const easeInOut = (value)=>{
      const v = Math.max(0, Math.min(1, value));
      return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
    };

    document.querySelectorAll('body.home-page .hero .hero-video').forEach((video)=>{
      if(video.dataset.loopRateManaged === 'true') return;
      video.dataset.loopRateManaged = 'true';
      video.loop = true;
      video.defaultPlaybackRate = 1;

      let rafId = null;
      let disposed = false;

      const getPlaybackRate = (duration, current)=>{
        if(!(duration > edgeWindow * 2)) return 1;
        const controlPoints = [0, duration];
        if(duration > midpointWindow * 4){
          controlPoints.push(duration / 2);
        }
        let closestDistance = Infinity;
        let activeWindow = edgeWindow;
        controlPoints.forEach((point)=>{
          const distance = Math.abs(current - point);
          if(distance < closestDistance){
            closestDistance = distance;
            activeWindow = point === duration / 2 ? midpointWindow : edgeWindow;
          }
        });
        const normalized = Math.max(0, Math.min(1, closestDistance / activeWindow));
        return minRate + (1 - minRate) * easeInOut(normalized);
      };

      const applyLoopEasing = ()=>{
        if(disposed) return;
        if(document.hidden || video.paused || video.ended){
          rafId = null;
          return;
        }
        const duration = Number(video.duration) || 0;
        const current = Number(video.currentTime) || 0;
        const playbackRate = getPlaybackRate(duration, current);
        if(Math.abs((video.playbackRate || 1) - playbackRate) > 0.015){
          video.playbackRate = Number(playbackRate.toFixed(3));
        }
        rafId = requestAnimationFrame(applyLoopEasing);
      };

      const restartTicker = ()=>{
        if(rafId != null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyLoopEasing);
      };

      const normalizeWhenIdle = ()=>{
        if(document.hidden || video.paused || video.ended) video.playbackRate = 1;
      };

      video.addEventListener('loadedmetadata', restartTicker);
      video.addEventListener('play', restartTicker);
      video.addEventListener('pause', normalizeWhenIdle);
      video.addEventListener('ended', ()=>{ video.playbackRate = minRate; });
      document.addEventListener('visibilitychange', ()=>{
        if(document.hidden){
          normalizeWhenIdle();
          return;
        }
        restartTicker();
      });
      window.addEventListener('pagehide', ()=>{
        disposed = true;
        if(rafId != null) cancelAnimationFrame(rafId);
        video.playbackRate = 1;
      }, { once:true });

      restartTicker();
    });
  }

  function enhanceLanguageSwitcher(){
    const switcher = document.querySelector('.language-switcher');
    if(!switcher) return;
    const trigger = switcher.querySelector('.lang-trigger');
    const currentChoice = switcher.querySelector('.lang-choice');
    const menu = switcher.querySelector('.lang-menu');
    const items = Array.from(switcher.querySelectorAll('.lang-item[data-lang]'));
    const currentLang = detectCurrentLanguage();
    const activeItem = items.find((item)=> item.dataset.lang === currentLang) || items[0];
    const closeSwitcher = ()=>{
      switcher.classList.remove('is-open');
      if(trigger) trigger.setAttribute('aria-expanded', 'false');
    };
    const openSwitcher = ()=>{
      switcher.classList.add('is-open');
      if(trigger) trigger.setAttribute('aria-expanded', 'true');
    };

    if(menu){
      menu.id = menu.id || 'language-menu';
    }

    if(activeItem && currentChoice){
      currentChoice.innerHTML = activeItem.innerHTML;
      activeItem.classList.add('is-active');
      activeItem.setAttribute('aria-current', 'true');
    }

    if(trigger){
      trigger.setAttribute('aria-expanded', 'false');
      if(menu) trigger.setAttribute('aria-controls', menu.id);
      trigger.addEventListener('click', ()=>{
        const willOpen = !switcher.classList.contains('is-open');
        switcher.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
      trigger.addEventListener('keydown', (event)=>{
        if(event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' '){
          event.preventDefault();
          openSwitcher();
          const firstItem = items[0];
          if(firstItem) firstItem.focus();
        }
      });
    }

    items.forEach((item, index)=>{
      item.addEventListener('click', ()=>{
        const targetLang = item.dataset.lang;
        if(!targetLang) return;
        window.location.href = buildLanguagePath(targetLang);
      });
      item.addEventListener('keydown', (event)=>{
        if(event.key === 'ArrowDown'){
          event.preventDefault();
          const next = items[(index + 1) % items.length];
          if(next) next.focus();
        }
        if(event.key === 'ArrowUp'){
          event.preventDefault();
          const prev = items[(index - 1 + items.length) % items.length];
          if(prev) prev.focus();
        }
        if(event.key === 'Home'){
          event.preventDefault();
          if(items[0]) items[0].focus();
        }
        if(event.key === 'End'){
          event.preventDefault();
          if(items[items.length - 1]) items[items.length - 1].focus();
        }
        if(event.key === 'Escape'){
          closeSwitcher();
          if(trigger) trigger.focus();
        }
      });
    });

    document.addEventListener('click', (event)=>{
      if(!switcher.contains(event.target)) closeSwitcher();
    });

    document.addEventListener('keydown', (event)=>{
      if(event.key === 'Escape') closeSwitcher();
    });
  }




  function enhancePersonalAccountEditor(){
    const editor = document.querySelector('[data-personal-account-editor]');
    if(!editor) return;

    const key = 'academyMraPersonalAccountDraft';
    const defaults = {
      name:'',
      email:'',
      title:'',
      plan:'Account Free',
      bio:'',
      notes:'',
      interest:'Scienza Ammonia',
      readingMode:'Classica',
      notifications:'Aggiornamenti essenziali',
      language:'Italiano'
    };

    const fields = {
      name: editor.querySelector('#account-name'),
      email: editor.querySelector('#account-email'),
      title: editor.querySelector('#account-title'),
      plan: editor.querySelector('#account-plan'),
      bio: editor.querySelector('#account-bio'),
      notes: editor.querySelector('#account-notes')
    };

    const prefFields = [...editor.querySelectorAll('[data-account-pref]')];
    const previewName = editor.querySelector('[data-account-preview-name]');
    const previewSubtitle = editor.querySelector('[data-account-preview-subtitle]');
    const previewPlan = editor.querySelector('[data-account-preview-plan]');
    const previewStatus = editor.querySelector('[data-account-preview-status]');
    const avatar = editor.querySelector('[data-account-avatar]');
    const state = editor.querySelector('[data-account-save-state]');

    function safeParse(value){
      try{return JSON.parse(value);}catch(error){return null;}
    }

    function collect(){
      const data = Object.assign({}, defaults);
      Object.keys(fields).forEach((name)=>{
        if(fields[name]) data[name] = fields[name].value.trim();
      });
      prefFields.forEach((field)=>{
        data[field.name] = field.value;
      });
      return data;
    }

    function initials(name,email){
      const base = (name || email || 'Academy MRA').trim();
      const parts = base.split(/\s+/).filter(Boolean);
      if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return base.slice(0,2).toUpperCase();
    }

    function updatePreview(data){
      if(previewName) previewName.textContent = data.name || 'Il tuo account';
      if(previewSubtitle) previewSubtitle.textContent = data.title || data.email || 'Personalizza i dati visibili in questa pagina.';
      if(previewPlan) previewPlan.textContent = data.plan || 'Account Free';
      if(previewStatus) previewStatus.textContent = data.plan && data.plan !== 'Account Free' ? 'Da attivare / verificare' : 'Profilo libero';
      if(avatar) avatar.textContent = initials(data.name, data.email);
    }

    function fill(data){
      Object.keys(fields).forEach((name)=>{
        if(fields[name]) fields[name].value = data[name] || '';
      });
      prefFields.forEach((field)=>{
        if(data[field.name]) field.value = data[field.name];
      });
      updatePreview(data);
    }

    function setState(text, mode){
      if(!state) return;
      state.textContent = text;
      state.dataset.state = mode || '';
    }

    async function load(){
      const stored = safeParse(localStorage.getItem(key)) || {};
      const data = Object.assign({}, defaults, stored);
      try{
        const response = await fetch('/api/me', {credentials:'include', headers:{'Accept':'application/json'}, cache:'no-store'});
        const payload = await response.json().catch(()=>null);
        if(response.ok && payload && payload.user){
          data.name = data.name || payload.user.name || '';
          data.email = data.email || payload.user.email || '';
          data.plan = data.plan || payload.user.plan || payload.user.accountType || 'Account Free';
        }
      }catch(error){}
      fill(data);
      setState(localStorage.getItem(key) ? 'Salvato in locale' : 'Pronto');
    }

    async function save(){
      const data = collect();
      localStorage.setItem(key, JSON.stringify(data));
      updatePreview(data);
      setState('Salvato', 'saved');
      try{
        await fetch('/api/account', {
          method:'POST',
          credentials:'include',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(data),
          cache:'no-store'
        });
      }catch(error){}
      window.setTimeout(()=>setState('Salvato in locale','saved'), 900);
    }

    function reset(){
      localStorage.removeItem(key);
      fill(defaults);
      setState('Ripristinato');
    }

    function exportData(){
      const data = collect();
      const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'academy-mra-account.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url), 500);
    }

    [...editor.querySelectorAll('[data-account-save]')].forEach((button)=>button.addEventListener('click', save));
    const resetButton = editor.querySelector('[data-account-reset]');
    if(resetButton) resetButton.addEventListener('click', reset);
    const exportButton = editor.querySelector('[data-account-export]');
    if(exportButton) exportButton.addEventListener('click', exportData);

    [...Object.values(fields).filter(Boolean), ...prefFields].forEach((field)=>{
      field.addEventListener('input', ()=>{
        updatePreview(collect());
        setState('Modifiche non salvate', 'dirty');
      });
      field.addEventListener('change', ()=>{
        updatePreview(collect());
        setState('Modifiche non salvate', 'dirty');
      });
    });

    load();
  }

  function clearPageMotionState(){
    html.classList.remove('page-entering','page-leaving');
    html.classList.add('page-ready');
  }

  function enhancePageTransitions(){
    if(reducedMotion) return;
    html.classList.add('page-motion-enabled','page-entering');
    html.classList.remove('page-ready','page-leaving');

    const activateReadyState = ()=>{
      window.requestAnimationFrame(()=>{
        window.requestAnimationFrame(clearPageMotionState);
      });
    };

    activateReadyState();
    window.addEventListener('pageshow', clearPageMotionState);
    window.addEventListener('load', clearPageMotionState, {once:true});
    window.setTimeout(clearPageMotionState, 700);

    const shouldHandleLink = (link, event)=>{
      if(!link) return false;
      const href = link.getAttribute('href');
      if(!href || href.startsWith('#')) return false;
      if(link.target && link.target !== '_self') return false;
      if(link.hasAttribute('download')) return false;
      if(link.getAttribute('rel') === 'external') return false;
      if(event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return false;
      if(/^(mailto:|tel:|javascript:)/i.test(href)) return false;
      const url = new URL(link.href, window.location.href);
      if(url.origin !== window.location.origin) return false;
      if(url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;
      return true;
    };

    document.addEventListener('click', (event)=>{
      const link = event.target.closest('a');
      if(!shouldHandleLink(link, event)) return;
      html.classList.remove('page-entering','page-ready');
      html.classList.add('page-leaving');
      window.setTimeout(()=>{
        window.location.href = link.href;
      }, 220);
      window.setTimeout(clearPageMotionState, 700);
      event.preventDefault();
    });
  }

    enhancePageTransitions();
  enhancePersonalAccountEditor();
  setCurrentYear();
  manageHeroVideo();
  enhanceHeroMotion();
  enhanceCookieBanner();
  enhanceRegistrationForms();
  enhanceServerLogin();
  enhanceForms();
  enhanceAccountSession();
  enhancePasswordToggle();
  enhanceNavigation();
  /* auth/menu handled by assets/js/auth-clean.js */
  enhanceArticleAccessGate();
  enhanceProgressUi();
  enhanceBreadcrumbs();
  enhanceArchiveFilter();
  enhanceArticlePages();
  smoothHeroVideoLoops();
  enhanceCustomCursor();
  enhanceLanguageSwitcher();
})();




/* v54 active menu indicator + hero loop fade */
(function(){
  function normalizedPage(url){
    try{ var u = new URL(url, window.location.href); return u.pathname.split('/').pop() || 'index.html'; }catch(e){ return ''; }
  }
  function markCurrentMenu(){
    var current = normalizedPage(window.location.href);
    document.querySelectorAll('.topbar .menu a[href]').forEach(function(link){
      var href = link.getAttribute('href') || '';
      if(href.indexOf('#') === 0 || /^(mailto:|tel:|https?:)/i.test(href)) return;
      var target = normalizedPage(link.href);
      if(target && target === current){
        link.classList.add('nav-current');
        link.setAttribute('aria-current','page');
        var item = link.closest('.menu-item');
        if(item) item.classList.add('nav-current-item');
        var dropdown = link.closest('.menu-item.has-dropdown');
        if(dropdown){
          dropdown.classList.add('nav-current-parent');
          var btn = dropdown.querySelector('.dropdown-toggle');
          if(btn) btn.classList.add('nav-current');
        }
      }
    });
  }
  function fadeHeroLoop(){
    if(!document.body.classList.contains('home-page') || reducedMotion || saveData || coarsePointer || window.innerWidth < 768) return;
    var wrap = document.querySelector('.hero .hero-video-wrap');
    var video = wrap ? wrap.querySelector('.hero-video') : null;
    if(!wrap || !video || video.dataset.crossfadeReady === 'true') return;
    video.dataset.crossfadeReady = 'true';

    try{
      var clone = video.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden','true');
      clone.muted = true;
      clone.playsInline = true;
      clone.loop = false;
      video.loop = false;

      video.classList.add('hero-video-crossfade','is-active');
      clone.classList.add('hero-video-crossfade','is-standby','is-crossfade-soft');
      wrap.appendChild(clone);

      var active = video;
      var standby = clone;
      var threshold = 1.35;
      var busy = false;

      function safePlay(node){
        var p = node.play();
        if(p && typeof p.catch === 'function') p.catch(function(){});
      }

      function prepare(node){
        try{ node.currentTime = 0.001; }catch(e){}
        safePlay(node);
      }

      function swap(){
        if(busy) return;
        var d = Number(active.duration) || 0;
        var current = Number(active.currentTime) || 0;
        if(!d || !isFinite(d) || d < 3) return;
        if(d - current > threshold) return;

        busy = true;
        prepare(standby);

        window.setTimeout(function(){
          standby.classList.remove('is-standby');
          standby.classList.add('is-active');
          active.classList.remove('is-active');
          active.classList.add('is-standby');

          window.setTimeout(function(){
            try{ active.pause(); active.currentTime = 0.001; }catch(e){}
            var temp = active;
            active = standby;
            standby = temp;
            busy = false;
          }, 1180);
        }, 40);
      }

      video.addEventListener('loadedmetadata', function(){ prepare(video); }, {once:true});
      clone.addEventListener('loadedmetadata', function(){ try{ clone.currentTime = 0.001; }catch(e){} }, {once:true});
      video.addEventListener('timeupdate', swap, {passive:true});
      clone.addEventListener('timeupdate', swap, {passive:true});
      document.addEventListener('visibilitychange', function(){
        if(document.hidden){
          try{ video.pause(); clone.pause(); }catch(e){}
        }else{
          safePlay(active);
        }
      });
      prepare(video);
    }catch(err){
      var thresholdFallback = 1.05;
      var resetAt = 0.38;
      function check(){
        var d = Number(video.duration) || 0;
        if(!d || !isFinite(d)) return;
        var remaining = d - (Number(video.currentTime) || 0);
        if(remaining <= thresholdFallback || video.currentTime <= resetAt){
          video.classList.add('is-loop-fading');
        }else{
          video.classList.remove('is-loop-fading');
        }
      }
      video.addEventListener('timeupdate', check, {passive:true});
      video.addEventListener('seeked', function(){ window.setTimeout(check, 40); });
      video.addEventListener('play', check);
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ markCurrentMenu(); fadeHeroLoop(); });
  }else{ markCurrentMenu(); fadeHeroLoop(); }
})();


// V56: indicatore elegante della voce di menu corrente
(function(){
  function normalizePage(pathname){
    var clean = (pathname || "").split("?")[0].split("#")[0];
    var parts = clean.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "index.html";
  }

  document.addEventListener("DOMContentLoaded", function(){
    var current = normalizePage(window.location.pathname);
    if (!current || current === "/") current = "index.html";

    document.querySelectorAll(".topbar .nav-current, .topbar .nav-current-parent").forEach(function(el){
      el.classList.remove("nav-current", "nav-current-parent");
    });

    document.querySelectorAll(".topbar a[href]").forEach(function(link){
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch(e) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      var target = normalizePage(url.pathname);
      if (target === current) {
        link.classList.add("nav-current");
        var item = link.closest(".menu-item");
        if (item) item.classList.add("nav-current");

        var dropdown = link.closest(".has-dropdown");
        if (dropdown) dropdown.classList.add("nav-current-parent");
      }
    });
  });
})();

// V69: menu mobile accessibile e chiusura sicura
(function(){
  function getLang(){
    var lang = (document.documentElement.getAttribute('lang') || 'it').toLowerCase();
    return lang.split('-')[0] || 'it';
  }
  var labels = {
    it:{open:'Apri il menu', close:'Chiudi il menu', menu:'Menu'},
    en:{open:'Open menu', close:'Close menu', menu:'Menu'},
    fr:{open:'Ouvrir le menu', close:'Fermer le menu', menu:'Menu'},
    es:{open:'Abrir el menú', close:'Cerrar el menú', menu:'Menú'},
    de:{open:'Menü öffnen', close:'Menü schließen', menu:'Menü'},
    nl:{open:'Menu openen', close:'Menu sluiten', menu:'Menu'},
    hu:{open:'Menü megnyitása', close:'Menü bezárása', menu:'Menü'}
  };
  function closeNav(nav){
    if(!nav) return;
    var btn = nav.querySelector('.mobile-menu-toggle');
    nav.classList.remove('is-menu-open');
    document.body.classList.remove('mobile-menu-open');
    if(btn){
      var dict = labels[getLang()] || labels.it;
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label',dict.open);
      var label = btn.querySelector('.mobile-menu-toggle-label');
      if(label) label.textContent = dict.menu;
    }
  }
  function openNav(nav){
    if(!nav) return;
    var btn = nav.querySelector('.mobile-menu-toggle');
    nav.classList.add('is-menu-open');
    document.body.classList.add('mobile-menu-open');
    if(btn){
      var dict = labels[getLang()] || labels.it;
      btn.setAttribute('aria-expanded','true');
      btn.setAttribute('aria-label',dict.close);
    }
  }
  function init(){
    document.querySelectorAll('.topbar').forEach(function(nav){
      var btn = nav.querySelector('.mobile-menu-toggle');
      var menu = nav.querySelector('.menu');
      if(!btn || !menu || btn.dataset.mobileMenuReady === 'true') return;
      btn.dataset.mobileMenuReady = 'true';
      if(!menu.id){
        menu.id = 'main-menu';
      }
      btn.setAttribute('aria-controls', menu.id);
      var dict = labels[getLang()] || labels.it;
      btn.setAttribute('aria-label', dict.open);
      var label = btn.querySelector('.mobile-menu-toggle-label');
      if(label) label.textContent = dict.menu;
      btn.addEventListener('click', function(){
        if(nav.classList.contains('is-menu-open')) closeNav(nav);
        else openNav(nav);
      });
      nav.addEventListener('click', function(event){
        var target = event.target;
        var link = target && target.closest ? target.closest('a[href]') : null;
        if(!link) return;
        if(link.closest('.lang-menu')) return;
        closeNav(nav);
      });
    });
    document.addEventListener('click', function(event){
      document.querySelectorAll('.topbar.is-menu-open').forEach(function(nav){
        if(!nav.contains(event.target)) closeNav(nav);
      });
    });
    document.addEventListener('keydown', function(event){
      if(event.key !== 'Escape') return;
      document.querySelectorAll('.topbar.is-menu-open').forEach(function(nav){
        closeNav(nav);
        var btn = nav.querySelector('.mobile-menu-toggle');
        if(btn) btn.focus({preventScroll:true});
      });
    });
    var mq = window.matchMedia('(min-width: 901px)');
    function onResize(e){
      if(!e.matches) return;
      document.querySelectorAll('.topbar.is-menu-open').forEach(closeNav);
    }
    if(mq.addEventListener) mq.addEventListener('change', onResize);
    else if(mq.addListener) mq.addListener(onResize);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();

