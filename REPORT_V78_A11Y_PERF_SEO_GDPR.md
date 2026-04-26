# REPORT V78 — Accessibilità, performance, SEO, GDPR e manutenibilità

## Accessibilità
- Rafforzati contrasto e leggibilità di hero, card e sezioni trasparenti.
- Focus ring visibile e uniforme su link, pulsanti, campi, card interattive e menu.
- Selettore lingua con `aria-label` e menu con label descrittiva.
- Form rafforzati con label, `aria-describedby`, `aria-invalid`, messaggi errore e validazione assistiva.
- Pagina `accessibilita.html` aggiornata con checklist V78.

## Performance
- Video hero con un solo `<video>` e sorgenti WebM/MP4: ora senza `autoplay` e con `preload="none"` in markup; lo script attiva il preload/play solo desktop quando visibile.
- Video disattivato su mobile, puntatori touch, `prefers-reduced-motion` e `saveData`.
- Particellare e logo tilt disattivati su mobile/touch e ridotti tramite media query.
- Ciclo RAF del video corretto per non continuare quando il video è in pausa/nascosto.
- Immagini completate con `loading` e `decoding` quando mancanti.

## SEO tecnica
- `site.webmanifest` ampliato con icone maskable, scorciatoie e metadati PWA.
- `sitemap.xml` rigenerata e `robots.txt` aggiornato.
- Canonical, Open Graph e Twitter card garantiti su tutte le pagine HTML.
- JSON-LD già presente per BreadcrumbList, Article e Course; aggiunto WebSite sulla homepage.

## GDPR e cookie
- Banner cookie più chiaro.
- Meccanismo tecnico di blocco preventivo per futuri script non essenziali: `type="text/plain"` + `data-cookie-category`.
- `cookie-policy.html` aggiornata con sezione “blocco preventivo”.
- `privacy-policy.html` aggiornata con sezione sui moduli e consenso.

## Manutenibilità
- Aggiunto `package.json` con script base `check`, `serve`, `build`.
- Aggiunto `tools/quality-check.py` per controllo statico di meta, canonical, label, aria e immagini.
- Aggiunto `docs/MAINTENANCE_V78.md` con checklist e proposta di migrazione futura a generatori statici.

## Nota sui test esterni
In questa consegna sono stati applicati controlli e verifiche statiche locali. Lighthouse mobile e test reali NVDA/VoiceOver vanno eseguiti sul dominio pubblicato o in locale con browser reale.
