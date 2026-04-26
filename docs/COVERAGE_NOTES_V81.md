# Coverage e rimozione CSS/JS inutilizzato — V81

La rimozione aggressiva di CSS/JS non è stata automatizzata nel sorgente perché il sito usa molte classi dinamiche, stati di autenticazione, lingue e componenti aperti via JavaScript. Un purge cieco potrebbe rompere menu, card, auth state, cookie banner e pagine multilingua.

## Procedura consigliata in Chrome DevTools

1. Avvia il sito con `npm run serve`.
2. Apri Chrome DevTools.
3. Menu `More tools` → `Coverage`.
4. Ricarica la pagina con registrazione attiva.
5. Testa almeno:
   - homepage desktop e mobile;
   - menu mobile aperto;
   - dropdown percorsi/articoli;
   - pagina corsi;
   - pagina libri;
   - pagina articolo;
   - registrazione/login;
   - cookie banner;
   - lingua in sottocartelle.
6. Esporta i risultati.
7. Rimuovi solo selettori confermati inutilizzati in tutte le pagine.

## File già ridotti o razionalizzati

- CSS inline spostato in `assets/css/inline-extracted.css`.
- Stili di ottimizzazione e utility in `assets/css/pro-optimizations.css`.
- JS inline spostato in `assets/js/page-interactions.js`.
- Auth client isolato in `assets/js/auth.js`.
- Media/video optimizer isolato in `assets/js/media-optimizer.js`.

## Possibile step successivo

Aggiungere PurgeCSS in modalità report-only, con safelist per:

- `is-*`
- `auth-*`
- `page-*`
- `menu-*`
- `hero-*`
- `lang-*`
- `cookie-*`
- `article-*`
- `corsi-*`
- `seminari-*`
- `mappa-*`
- classi generate dal backend o da search-data.
