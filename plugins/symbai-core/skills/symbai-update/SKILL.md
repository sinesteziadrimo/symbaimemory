---
name: symbai-update
description: Actualizează (sau pornește auto-actualizarea) cunoștințelor și skill-urilor Symbai. Folosește când utilizatorul scrie /symbai-core:symbai-update sau cere „actualizează skill-urile Symbai" / „ia ultimele cunoștințe Symbai" / „de ce nu se actualizează singur pluginul" / „cum activez auto-update".
---

# Actualizează pachetul Symbai (`symbai-core`)

Pluginul `symbai-core` (skill-urile + folderul `knowledge/`) e descărcat din GitHub (marketplace `symbai`, repo `sinesteziadrimo/symbaimemory`). Claude Code îl ține într-un folder **fixat pe versiune** (`~/.claude/plugins/cache/symbai/symbai-core/<versiune>/`). Singurul mecanism corect de actualizare e **auto-update-ul nativ al marketplace-ului**, controlat de o cheie din `settings.json`.

> ⚠️ Notă pentru asistent: NU există un „self-update din interiorul pluginului". Folderul de cache nu e repo git, deci un `git pull` în el nu funcționează. Tot ce ține pluginul la zi e flag-ul `autoUpdate` de mai jos. Dacă utilizatorul spune că „nu se actualizează", cauza #1 e că flag-ul lipsește — verifică-l ÎNTÂI.

## 1. Asigură auto-update-ul (asta rezolvă „nu se actualizează" definitiv)

Verifică și, la nevoie, **editează** fișierul `settings.json` din folderul Claude al utilizatorului (Windows: `C:\Users\<nume>\.claude\settings.json`; macOS/Linux: `~/.claude/settings.json`; creează-l dacă lipsește). Trebuie să conțină, **îmbinat** cu restul fișierului (cere voie înainte de a scrie):

```json
{
  "extraKnownMarketplaces": {
    "symbai": {
      "source": { "source": "git", "url": "https://github.com/sinesteziadrimo/symbaimemory.git" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": { "symbai-core@symbai": true }
}
```

- Dacă `extraKnownMarketplaces.symbai` **există dar fără** `"autoUpdate": true` → adaugă DOAR flag-ul (asta e cazul tipic la clienții care s-au blocat pe o versiune veche).
- Dacă lipsește de tot → adaugă tot blocul.
- Păstrează restul fișierului neatins.

Cu `autoUpdate: true`, Claude Code reîmprospătează marketplace-ul ȘI upgradează pluginul la ultima versiune **la fiecare pornire**, fără nicio acțiune. (Marketplace-urile terțe au auto-update OPRIT implicit — de-aceea trebuie pus explicit.) Spune-i utilizatorului să **repornească** aplicația ca să se aplice.

## 2. Forțează ultima versiune ACUM (fără să aștepți repornirea)

Dacă utilizatorul are caseta de chat cu `/plugin`:

```
/plugin marketplace update symbai
```

(asta trage marketplace-ul la zi și upgradează pluginul instalat). Apoi repornește sesiunea.

Dacă `/plugin` **nu e disponibil** (aplicația desktop) și nici `claude` în terminal — atunci pasul 1 + repornire e tot ce trebuie: la următoarea pornire auto-update-ul aduce ultima versiune. Ca verificare, după repornire confirmă în Customize / Settings → Plugins că `symbai-core` arată versiunea nouă.

## 3. Verificare

După repornire, într-o sesiune nouă: skill-urile și cunoștințele Symbai noi sunt disponibile. (Opțional, dacă userul are `/plugin`: panoul Plugins arată versiunea curentă a `symbai-core`.)

## Note

- Toate astea actualizează DOAR cunoștințele + skill-urile (pachetul de pe GitHub). Conexiunea live la datele tale (MCP) e separată și mereu la zi — tool-urile vin direct de pe instanța ta.
- Versiuni noi dese = normal: Symbai îmbunătățește ghidurile pe măsură ce adaugă funcții.
- Un plugin **nu** își poate forța singur auto-update-ul (e o setare a clientului). De-aceea instalarea recomandată (vezi README) scrie `autoUpdate: true` din start.
