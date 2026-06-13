---
name: symbai-update
description: Actualizează (sau explică auto-actualizarea) cunoștințelor și skill-urilor Symbai. Folosește când utilizatorul scrie /symbai-core:symbai-update sau cere „actualizează skill-urile Symbai" / „ia ultimele cunoștințe Symbai" / „de ce nu se actualizează singur pluginul" / „cum activez auto-update".
---

# Actualizează pachetul Symbai (`symbai-core`)

Pluginul `symbai-core` (skill-urile + folderul `knowledge/`) e descărcat din GitHub (marketplace `symbai`, repo `sinesteziadrimo/symbaimemory`). Când Symbai publică ghiduri sau funcții noi, le iei astfel:

## 1. Auto-actualizare (deja activă — de regulă nu faci nimic)

Pluginul se **actualizează singur ~o dată pe zi**: are un hook `SessionStart` (`hooks/hooks.json` → `scripts/self-update.mjs`) care face `git pull --ff-only` pe clona pluginului, throttle-uit la ~20h. Efectul se vede la **următoarea sesiune** (pluginul se încarcă înainte ca hook-ul să ruleze). Hook-ul e fail-safe: dacă nu merge (fără rețea/git), iese silențios — nu blochează și nu întârzie pornirea.

→ Practic, clientul primește automat ghidurile noi fără să facă nimic. Spune-i userului asta dacă întreabă „de ce nu se actualizează".

## 2. Forțează ACUM (on-demand)

Dacă vrei ultima versiune imediat (fără să aștepți fereastra de ~20h), userul rulează în Claude Code (în **caseta de chat**, NU în terminal):

```
/plugin marketplace update symbai
```

Apoi închide și redeschide sesiunea (sau `/plugin`) ca să confirme versiunea nouă a `symbai-core`.

## 3. (Opțional) Auto-update „oficial" al marketplace-ului

Alternativă la hook-ul din plugin — mecanismul nativ Claude Code: activează auto-update pentru marketplace-ul `symbai` din `/plugin` → tab **Marketplaces** → „Enable auto-update". SAU în `~/.claude/settings.json`:

```json
{ "extraKnownMarketplaces": { "symbai": { "source": { "source": "github", "repo": "sinesteziadrimo/symbaimemory" }, "autoUpdate": true } } }
```

Cu asta, Claude Code reîmprospătează pluginul **la fiecare pornire** (marketplace-urile terțe au auto-update OPRIT implicit; doar cele oficiale Anthropic sunt pornite). Hook-ul din plugin (pasul 1) face deja acest lucru zilnic, deci pasul 3 e doar pentru cine vrea update la fiecare sesiune.

## Note

- Toate astea actualizează DOAR cunoștințele + skill-urile (pachetul de pe GitHub). Conexiunea live la datele tale (MCP) e separată și mereu la zi — tool-urile vin direct de pe instanța ta.
- Versiuni noi dese = normal: Symbai îmbunătățește ghidurile pe măsură ce adaugă funcții.
- Dacă o comandă nu merge, verifică întâi că marketplace-ul e adăugat: `/plugin marketplace add sinesteziadrimo/symbaimemory`.
