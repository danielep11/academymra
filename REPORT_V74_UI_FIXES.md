# Report V74 UI fixes

Interventi applicati:

- Menu principale: invertito l’ordine delle voci HOME e PERCORSI su tutte le pagine HTML.
- Header: rinforzato il comportamento sticky del menu superiore, con z-index più alto e scroll-margin coerente.
- archivio-vivente.html: sistemato l’allineamento del testo nei pulsanti “Apri”.
- corsi.html: centrato il pulsante “MAGGIORI INFORMAZIONI” in ogni riquadro.
- corsi.html: disattivata l’iniezione automatica dei due tag per-card generati da site-experience.js e aggiunto fallback CSS.
- contatti.html: ridotto lo spazio superiore usando selettori :first-of-type, così la correzione funziona anche dopo l’inserimento dinamico del breadcrumb.
- Aggiornato il query-string degli asset a v=20260426-v74-ui-fix per evitare cache del CSS/JS precedente.
