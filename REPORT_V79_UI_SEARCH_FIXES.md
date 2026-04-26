# Report V79 — Correzioni Inizia, Mappa e Ricerca

Interventi applicati:

- `inizia-da-qui.html`: rimossi i marcatori visivi `01`, `02`, `03` e `A`, `B`, `C`; i titoli dei riquadri “Orientamento generale”, “Studio progressivo” e “Approfondimento tematico” sono stati uniformati in dimensione, peso e stile ai titoli principali delle card.
- `mappa-percorsi.html`: le tre card `01`, `02`, `03` della sezione “Tre modi di usare la mappa” ora usano una griglia interna invisibile per allineare numerazione, titolo, testo e CTA. I link sono stati trasformati in pulsanti `.btn .btn-secondary`, coerenti con il resto del sito.
- `ricerca.html`: corretta la gestione dei pulsanti di ricerca consigliata; il secondo click sostituisce sempre il testo precedente, aggiorna lo stato attivo e non concatena le query.
- Ricerca interna: rigenerato `assets/js/search-data.js` da tutte le pagine HTML disponibili e migliorato l’algoritmo di ricerca con normalizzazione accenti, stop-word essenziali, match su tutti i termini, ranking titolo/descrizione/testo e deduplicazione URL.
- Aggiornato il cache busting CSS/JS a `v79-ui-search-fixes`.

Verifiche statiche eseguite:

- `site-experience.js` controllato con `node --check`.
- ZIP creato e aperto con `testzip()`.
- Presenza dei file HTML principali e degli asset aggiornati.
- Presenza del nuovo indice di ricerca.
