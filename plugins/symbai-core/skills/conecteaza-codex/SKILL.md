---
name: conecteaza-codex
description: Configureaza sau verifica pluginul Codex Symbai si conexiunea MCP la serverul "symbai". Foloseste cand userul vrea Codex direct in Symbai, cand tool-urile Symbai nu apar in Codex, la erori 401/token lipsa, sau cand trebuie migrata configurarea Claude Code catre Codex.
---

# Conecteaza Codex la Symbai

Scop: Codex trebuie sa vada pluginul `symbai-core`, skill-urile lui si serverul MCP `symbai`, astfel incat sa poata folosi tool-uri live precum `list_brands`, `gaseste_in_aplicatie`, `raport_vanzari`, `jurnal_activitate` si tool-urile de scriere permise pe token.

Citeste si:
- `knowledge/codex-mcp-operare.md`
- `knowledge/claude-code-mcp-operare.md` pentru regulile generale MCP-first
- `knowledge/tools-mcp.md` pentru catalogul orientativ al tool-urilor

## Configurare

> Pluginul **NU** mai contine un fisier `.mcp.json` propriu. Conexiunea live se configureaza per-client, **in afara pluginului** — altfel fiecare client ar fi trimis spre instanta gresita (un URL hardcodat), iar auto-update-ul pluginului ar suprascrie orice ajustare. Fiecare instanta are subdomeniul ei: `https://<subdomeniu>.symbai.app/mcp`.

Creeaza un fisier `.mcp.json` in **folderul tau de lucru** (radacina proiectului din care pornesti Codex — NU in folderul pluginului), cu subdomeniul TAU si tokenul citit dintr-o variabila de mediu (nu scrie tokenul direct in fisier):

```json
{
  "mcpServers": {
    "symbai": {
      "type": "http",
      "url": "https://<subdomeniu>.symbai.app/mcp",
      "bearer_token_env_var": "SYMBAI_MCP_TOKEN"
    }
  }
}
```

Pe Windows, seteaza tokenul o singura data cu PowerShell (tokenul `symbai_mcp_*` vine din Hub → Acces AI, se afiseaza o singura data la creare):

```powershell
[Environment]::SetEnvironmentVariable("SYMBAI_MCP_TOKEN", "<tokenul-symbai_mcp>", "User")
```

Dupa setare, porneste Codex din nou (sau un thread nou) ca sa vada mediul si fisierul actualizat. Nu scrie tokenul in fisierele pluginului, in git, in raspunsuri sau in memorii.

## Verificare

1. Verifica daca pluginul este instalat/activ in Codex.
2. Porneste o sesiune noua dupa instalare.
3. Cauta tool-uri cu prefixul serverului `symbai`.
4. Apeleaza intai `list_brands`.
5. Daca `list_brands` merge, conexiunea este buna. Daca un tool de scriere spune "permisiune insuficienta", tokenul este valid, dar modulul de scriere nu este bifat in Hub -> Acces AI.

## Reguli

- MCP-first: foloseste tool semantic dedicat inainte de SQL sau click manual.
- Pentru actiuni cu efect real, cere confirmare clara inainte de `confirm:true`.
- Dupa orice scriere, verifica prin tool de citire, nu doar prin UI.
- Daca un skill mentioneaza `Claude_in_Chrome`, in Codex foloseste browserul disponibil in Codex sau da linkul exact din `gaseste_in_aplicatie`.
- Daca lista live de tool-uri difera de `tools-mcp.md`, lista live castiga.
