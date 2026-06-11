---
name: symbai-update
description: Actualizează cunoștințele și skill-urile Symbai la ultima versiune. Folosește când utilizatorul scrie /symbai-core:symbai-update sau cere „actualizează skill-urile Symbai" / „ia ultimele cunoștințe Symbai".
---

# Actualizează pachetul Symbai

Pluginul `symbai-core` (skill-urile + folderul `knowledge/`) e descărcat din GitHub. Când Symbai publică ghiduri sau funcții noi, le iei cu o singură comandă.

Spune-i utilizatorului să ruleze în Claude Code:

```
/plugin marketplace update symbai
```

Apoi (dacă e nevoie) repornește sesiunea sau rulează `/plugin` ca să confirme versiunea nouă a pluginului `symbai-core`.

## Note

- Asta actualizează DOAR cunoștințele + skill-urile (pachetul de pe GitHub). Conexiunea live la datele tale (MCP) e separată și nu necesită update — tool-urile vin direct de pe instanța ta și sunt mereu la zi.
- Dacă vezi versiuni noi des, e normal: Symbai îmbunătățește ghidurile pe măsură ce adaugă funcții.
- Dacă comanda nu merge, verifică întâi că marketplace-ul e adăugat: `/plugin marketplace add sinesteziadrimo/symbaimemory`.
