# Academy MRA — Manutenibilità V78

## Obiettivo
Questa versione mantiene il sito statico ma aggiunge una base più scalabile per audit, SEO, accessibilità, consenso cookie e performance.

## Checklist prima della pubblicazione
1. Eseguire Lighthouse mobile su homepage, corsi, mappa-percorsi e contatti.
2. Eseguire test manuale con tastiera: Tab, Shift+Tab, Enter, Spazio, Escape.
3. Testare con NVDA o VoiceOver almeno: menu, selettore lingua, form contatti, card corsi.
4. Prima di introdurre analytics, embed video o CRM, inserirli come script bloccati da consenso (`type="text/plain" data-cookie-category="analytics"`).
5. Aggiornare Privacy Policy e Cookie Policy con dati reali del titolare e fornitori effettivi.

## Crescita futura
Per un sito vivo con molti articoli/corsi conviene passare a un generatore statico come Astro, Hugo o Jekyll, con contenuti in Markdown/JSON e layout condivisi.

## File chiave
- `assets/css/style.css`: stile base.
- `assets/css/enhancements.css`: rifiniture progressive e fix V78.
- `assets/js/script.js`: comportamento UI, consenso, form, video e accessibilità.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`: SEO/PWA.
