# REPORT V77 – Fix globali richiesti

## Correzioni specifiche
- `ricerca.html`: eliminato dall’indice di ricerca il risultato “Pagina non trovata / 404”.
- Menu principale: invertito l’ordine, ora `HOME` viene prima di `PERCORSI` su tutte le pagine e in tutte le cartelle lingua.
- Header: il menu superiore è ora fisso (`position: fixed`) e resta visibile durante lo scroll su tutte le pagine.
- Corsi e seminari: ripristinate tutte le immagini mancanti e verificati i riferimenti locali.
- Seminari: generate le immagini SVG mancanti in `assets/images/seminari-generated/`.
- Libri/Seminari: aggiunti alias immagini mancanti per le copertine in inglese usate nelle card.

## Accessibilità
- Aggiunto `aria-label` al selettore lingua.
- Aggiunti focus ring visibili e uniformi per link, pulsanti, input, textarea, select e card.
- Verificata la presenza di `<label for="">` per tutti gli input/select/textarea.
- Aggiunti `aria-required`, `aria-invalid` e messaggi errore associati ai campi obbligatori.
- Migliorati contrasto e leggibilità di testi in hero, card e sezioni scure/trasparenti.

## Performance
- Video hero già unificato con sorgenti WebM + MP4 nello stesso tag `<video>`.
- Disabilitazione/pausa del video hero su mobile, puntatori touch, `saveData` e `prefers-reduced-motion`.
- Aggiunto fallback poster su mobile/riduzione dati.
- Tutte le immagini mantengono `loading="lazy"` e `decoding="async"` quando appropriato.

## SEO tecnica
- Rigenerata `sitemap.xml`.
- Aggiornato `robots.txt` con riferimento alla sitemap.
- Corrette canonical URL, Open Graph URL e hreflang per le pagine HTML.
- Aggiunti dati strutturati `BreadcrumbList`.
- Aggiunti dati strutturati `Course` per i corsi e `Article` per gli articoli.

## GDPR e moduli
- Mantenuto banner cookie con link a Cookie Policy.
- Rafforzata la struttura form con label, consenso privacy nominato e messaggi di errore chiari.
- Le policy dedicate sono presenti: `privacy-policy.html` e `cookie-policy.html`.

## Verifiche statiche eseguite
- Riferimenti locali mancanti: 0.
- Voci 404 nell’indice di ricerca: 0.
- Selettore lingua senza aria-label: 0.
- Controlli form senza label associata: 0.
