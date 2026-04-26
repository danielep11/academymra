#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
import sys
root = Path(__file__).resolve().parents[1]
errors = []
for page in root.rglob('*.html'):
    soup = BeautifulSoup(page.read_text(encoding='utf-8', errors='ignore'), 'html.parser')
    rel = page.relative_to(root)
    if not soup.find('meta', attrs={'name':'description'}): errors.append(f'{rel}: meta description mancante')
    if not soup.find('link', rel=lambda v: v and 'canonical' in (v if isinstance(v,list) else str(v).split())): errors.append(f'{rel}: canonical mancante')
    for btn in soup.select('.lang-trigger'):
        if not btn.get('aria-label'): errors.append(f'{rel}: lang trigger senza aria-label')
    for control in soup.select('input, textarea, select'):
        if control.get('type') in ('hidden','submit','button','reset'): continue
        cid = control.get('id')
        if not cid: errors.append(f'{rel}: controllo senza id')
        if cid and not (soup.find('label', attrs={'for':cid}) or control.find_parent('label')):
            errors.append(f'{rel}: controllo #{cid} senza label')
        if control.has_attr('required') and not control.get('aria-describedby'):
            errors.append(f'{rel}: controllo #{cid} required senza aria-describedby')
    for img in soup.find_all('img'):
        if not img.has_attr('alt'): errors.append(f'{rel}: immagine senza alt {img.get("src","")}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('Quality check statico OK')
