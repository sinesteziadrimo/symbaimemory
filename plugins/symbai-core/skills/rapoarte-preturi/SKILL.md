---
name: rapoarte-preturi
description: Răspunde la întrebări despre rapoarte, vânzări, KPI, food cost, marjă, prețuri. Folosește la „cât am vândut", „top produse", „care e food cost-ul", „ce marjă am la X", „de ce scade profitul", „cât datorez furnizorului".
---

# Rapoarte, cifre și prețuri

Citește `knowledge/rapoarte-preturi.md` pentru ce înseamnă fiecare indicator + regulile de TVA.

## Cum răspunzi la cifre

- Cifre standard (vânzări azi/perioadă, top produse, clienți): folosește tool-urile dedicate întâi — `generate_report`, `analyze_food_costs`, `analyze_recipes`, `get_accounting_overview`, `get_staff_overview` — sunt mai rapide și mai sigure decât SQL.
- Analize ad-hoc fără raport dedicat (ex. „clienți distincți luna trecută", „produse nevândute niciodată"): `execute_sql_query` dacă tokenul are SQL (workflow: list_tables → describe → SELECT cu coloane + WHERE + LIMIT).
- **Dacă tokenul NU are acces SQL**: rămâi pe tool-urile dedicate (`generate_report`, `analyze_food_costs`, `analyze_recipes`, `get_accounting_overview`, `list_entities`). Pentru o analiză care chiar cere SQL, spune-i utilizatorului că poate activa „Interogări SQL" din portal Hub → Acces AI.
- Întotdeauna **etichetează clar** sumele: „total facturat", „de plătit", „încasat", „de încasat" — niciodată „total" gol pe o sumă cu sens dublu.

## Prețuri și marjă

- Prețul de vânzare e pe articolul de meniu (`add_menu_item` / `update_menu_item`). Costul vine din rețetă (ingrediente × preț achiziție).
- „Ce marjă am la X" = preț vânzare − cost rețetă. Pentru recomandări de preț folosește `analyze_food_costs` / `analyze_recipes`.
- Modificare preț în masă: `bulk_update_menu_item_prices` (confirmă numărul de articole întâi).

## Reguli

- Nu inventa cifre. Dacă un tool nu întoarce datele, spune ce lipsește și ce raport/pagină ar ajuta (dă link).
- RON peste tot; TVA România 0/11/21.
- Pentru „de ce scade profitul / vânzările" — combină 2-3 surse (vânzări pe perioadă, food cost, manoperă) și dă o interpretare scurtă, onestă, cu cifre.
