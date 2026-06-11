# Symbai pentru Claude Code

Acest repo e un **plugin Claude Code** care învață asistentul AI cum să lucreze cu platforma **Symbai** (sistem de management pentru restaurante și hoteluri). Conține:

- **skills/** — workflow-uri pas-cu-pas (găsește o pagină, investighează o masă, adaugă un produs/rețetă, programează o postare, rapoarte & prețuri).
- **knowledge/** — ghiduri client-facing despre fiecare modul Symbai (ce face, cum se leagă, ce înseamnă rapoartele, regulile de TVA).

Pluginul se folosește **împreună cu conexiunea MCP** la instanța ta Symbai (date live + acțiuni reale). Conexiunea o adaugi separat din portalul Hub.

## Instalare (clientul rulează o singură dată)

În Claude Code:

```
/plugin marketplace add sinesteziadrimo/symbaimemory
/plugin install symbai-core@symbai
```

Sau din terminal:

```bash
claude plugin marketplace add sinesteziadrimo/symbaimemory
```

Apoi, din portalul tău Symbai Hub → **Acces AI**, copiază comanda de conectare (`claude mcp add ...`) ca să legi asistentul la datele instanței tale.

## Actualizare

Când Symbai publică ghiduri sau funcții noi:

```
/plugin marketplace update symbai
```

(sau scrie în chat „actualizează skill-urile Symbai" — skill-ul `symbai-update` te ghidează.)

## Cum se livrează conținut nou

Echipa Symbai urcă fișiere noi de skill/knowledge în acest repo (pe `main`). Clienții le iau cu `/plugin marketplace update symbai`. Versiunea pluginului se bumpează în `plugins/symbai-core/.claude-plugin/plugin.json` + intrarea din `.claude-plugin/marketplace.json`.

## Structură

```
.claude-plugin/marketplace.json     # marketplace (listează pluginul symbai-core)
plugins/symbai-core/
  .claude-plugin/plugin.json        # manifestul pluginului
  skills/<nume>/SKILL.md            # workflow-uri
  knowledge/*.md                    # cunoștințe pe module
```

## Compatibilitate

Skill-urile urmează standardul deschis Agent Skills (SKILL.md), deci funcționează în Claude Code. Pentru alte unelte (ex. Codex) suportul poate diferi — conexiunea MCP funcționează oricum cross-tool.
