# Academy MRA static site

Sito statico multilingua di Academy MRA, ottimizzato per performance, accessibilità, SEO tecnico, sicurezza e deploy su GitHub Pages.

## Sviluppo locale

```bash
npm install
npm run serve
```

Apri `http://localhost:8080`.

## Controlli qualità

```bash
npm run check
npm run sitemap
npm run images:webp
npm run build
```

`npm run build` genera la versione minificata in `dist/`.

## Deploy

Il workflow `.github/workflows/deploy.yml` esegue:

1. checkout del repository;
2. installazione dipendenze;
3. generazione immagini WebP responsive;
4. controllo qualità;
5. sitemap;
6. minificazione HTML/CSS/JS;
7. deploy su GitHub Pages.

## Video hero

I file in `assets/video/` devono restare:

- durata inferiore a 10 secondi;
- altezza massima 720p;
- bitrate inferiore a 1 Mbps;
- senza audio;
- poster statico in `assets/images/hero-poster.webp`.

Il file `assets/js/media-optimizer.js` disabilita il video su mobile, dispositivi a basse prestazioni, `prefers-reduced-motion` e `prefers-reduced-data`.

## Cookie consent

Gli script terzi devono restare bloccati finché non c'è consenso. Inseriscili così:

```html
<script type="text/plain" data-cookie-category="analytics" data-consent-src="https://example.com/analytics.js"></script>
```

Per iframe marketing, usa:

```html
<iframe data-cookie-category="marketing" data-consent-src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Video"></iframe>
```

Lo script principale attiva questi elementi solo dopo consenso esplicito.

## Sicurezza

Per Cloudflare Pages o Netlify è pronto il file `_headers`. Per Apache è presente `.htaccess`.
Su GitHub Pages gli header custom non sono applicabili direttamente: usa Cloudflare davanti al dominio per HSTS, CSP e policy browser.

## Note manutentive

- Non inserire CSS o JavaScript inline: usa `assets/css/pro-optimizations.css`, `assets/css/inline-extracted.css` o file JS dedicati.
- Mantieni alt descrittivi per immagini informative; usa `alt=""` solo per elementi decorativi.
- Aggiorna sitemap e canonical quando aggiungi pagine pubbliche.
- Per pagine articolo usa JSON-LD `Article`; per corsi usa `Course`; per FAQ usa `FAQPage`.
