# Codex + MCP Symbai - Model de operare

Acest fisier adapteaza pluginul `symbai-core` pentru Codex. Pluginul a fost construit initial pentru Claude Code, dar principiul ramane acelasi: skill -> knowledge -> MCP live -> verificare prin citire.

## Surse de adevar

1. Skill-ul potrivit din `skills/`.
2. Knowledge-ul potrivit din `knowledge/`.
3. Tool-urile MCP `symbai`, care citesc sau modifica date reale.
4. Browserul Codex, doar pentru navigare vizuala sau actiuni fara tool.

Pentru task-uri complexe, citeste si `agent-operare-avansata.md` si `claude-code-mcp-operare.md`.

## Cum apar tool-urile in Codex

Cand pluginul este instalat si serverul MCP este conectat, Codex expune tool-urile serverului `symbai` in sesiune. Numele concrete pot fi prefixate de host, dar sursa lor este serverul MCP `symbai`.

Daca tool-urile lipsesc:
- verifica instalarea pluginului;
- verifica daca threadul a fost pornit dupa instalare;
- verifica prezenta variabilei `SYMBAI_MCP_TOKEN` fara sa afisezi valoarea;
- verifica URL-ul din `.mcp.json`;
- porneste un thread nou dupa orice schimbare de plugin sau mediu.

## Autentificare

Tokenul vine din Hub -> Acces AI si are forma `symbai_mcp_*`. Nu il copia in fisierele pluginului. `.mcp.json` foloseste `bearer_token_env_var`:

```json
{
  "bearer_token_env_var": "SYMBAI_MCP_TOKEN"
}
```

Pentru alta instanta Symbai, schimba URL-ul MCP din `.mcp.json`.

## Lucru sigur

- Read tools merg de obicei fara permisiuni speciale.
- Write tools cer module bifate pe token.
- SQL este doar fallback read-only cand nu exista tool semantic.
- Actiunile externe sau cu impact real cer confirmare explicita: bani, email/WhatsApp/push, ANAF, eMAG, refund, GDPR, stergeri, modificari in masa.
- Dupa write, verifica prin read tool si inchide cu dovada.

## Browser in Codex

Documentatia veche poate mentiona `Claude_in_Chrome`. In Codex, foloseste browserul disponibil in mediul Codex sau in-app browserul, daca este activ. Daca browserul nu este disponibil, foloseste MCP pentru date si da linkul exact primit de la `gaseste_in_aplicatie`.
