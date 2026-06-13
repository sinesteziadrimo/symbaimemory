---
name: rapoarte-preturi
description: Răspunde la întrebări despre rapoarte, vânzări, KPI, food cost, marjă, prețuri, ȘI despre configurarea P&L (categorii, KPI, praguri, grupări venituri, template-uri industrie) + P&L salvat (snapshot peste care adaugi cheltuieli/venituri/angajați/evenimente suplimentare). Folosește la „cât am vândut", „top produse", „care e food cost-ul", „ce marjă am la X", „de ce scade profitul", „cât datorez furnizorului", „cum îmi configurez P&L-ul", „categorii P&L", „de ce apare la Nealocate", „salvează P&L", „închidere de lună", „adaugă o cheltuială/un venit/un angajat în P&L".
---

# Rapoarte, cifre și prețuri

Citește `knowledge/rapoarte-preturi.md` pentru ce înseamnă fiecare indicator + regulile de TVA.
Pentru **configurarea P&L-ului** (categorii, KPI, praguri, grupări de venituri, template-uri de industrie) și pentru **P&L-ul salvat cu ajustări manuale** (cheltuieli/venituri/angajați/evenimente suplimentare), citește `knowledge/setari-pnl.md`.

## Cum răspunzi la cifre

Folosește ÎNTÂI tool-urile dedicate de raport (funcționează FĂRĂ acces SQL, sunt rapide, sigure și compară automat cu perioada anterioară). Toate acceptă `perioada` (azi, ieri, saptamana_aceasta, luna_aceasta, ultimele_7_zile, ultimele_30_zile, custom + startDate/endDate) și opțional `brandId`/`locationId`:

- „cât am vândut / cum merg vânzările / cash vs card / cresc sau scad" → **`raport_vanzari`** (total, bon mediu, bacșiș, reduceri, pe metodă de plată + % vs perioada anterioară).
- „ce se vinde cel mai bine / top produse / best sellers" → **`top_produse`** (cantitate, venituri, pondere; `ordine: venituri|cantitate`).
- „când am cei mai mulți clienți / la ce oră e vârf / ce zi merge" → **`vanzari_in_timp`** (`grupare: zi|ora|zi_saptamana`).
- „cum merg ospătarii / cine vinde cel mai mult / cine a luat cel mai mult bacșiș" → **`performanta_ospatari`**.

Pentru alte analize: `analyze_food_costs`, `analyze_recipes` (food cost, marjă), `get_accounting_overview`, `generate_report`.
- Analize ad-hoc fără tool dedicat (ex. „clienți distincți luna trecută", „produse nevândute niciodată"): `execute_sql_query` DOAR dacă tokenul are SQL (workflow: list_tables → describe → SELECT cu coloane + WHERE + LIMIT). Dacă nu are SQL, rămâi pe tool-urile dedicate de mai sus — acoperă marea majoritate.
- Întotdeauna **etichetează clar** sumele: „total facturat", „de plătit", „încasat", „de încasat" — niciodată „total" gol pe o sumă cu sens dublu.

## Prețuri și marjă

- Prețul de vânzare e pe articolul de meniu (`add_menu_item` / `update_menu_item`). Costul vine din rețetă (ingrediente × preț achiziție).
- „Ce marjă am la X" = preț vânzare − cost rețetă. Pentru recomandări de preț folosește `analyze_food_costs` / `analyze_recipes`.
- Modificare preț în masă: `bulk_update_menu_item_prices` (confirmă numărul de articole întâi).

## Configurare P&L + P&L salvat

Detalii complete în `knowledge/setari-pnl.md` — citește-l ÎNTÂI la orice cerere de configurare sau salvare P&L. Pe scurt:

**Cum se construiește P&L-ul** (explică-i clientului): fiecare produs/cheltuială are un **tip de produs** → fiecare tip aparține unei **categorie P&L** → fiecare categorie stă într-o **secțiune** (Venituri / COGS / Personal / OpEx / Taxe). Deci raportul se modelează din *tipurile de produs* + *categoriile P&L*, nu cifră cu cifră.

**Configurarea** (pagina „Setări P&L", `/settings/pnl-categories`, 4 tab-uri) — ghidează în aplicație cu `gaseste_in_aplicatie`:
1. **Template-uri industrie** (1 click → KPI + grupări gata; idempotent) — PRIMUL pas pt. un client nou.
2. **Categorii P&L** — creezi/asignezi ce tipuri de produs (și, în mod avansat, ce conturi) intră în fiecare categorie.
3. **Grupări venituri** — sub-secțiunile din „Venituri" (pe canal, ospătar, brand, locație, oră…).
4. **Setări** — pragurile semafor (food cost / personal / prime cost / marjă).
Rețeta: domenii business (Setări→General) → aplică template → pune fiecare tip de produs pe categoria corectă → leagă conturile OpEx (avansat) → setează pragurile.

**P&L salvat** (`/reports/pnl` → „Salvează P&L" → `/analytics/saved-pnl`): îngheață raportul; peste el adaugi **ajustări manuale** — venituri/cheltuieli suplimentare, angajați, evenimente, override-uri — fără să atingi datele live. Util la închiderea de lună (ex. o cheltuială plătită cash care nu e în sistem). Poate fi blocat cu parolă.

**⚠ Ce poți face prin conexiune (MCP) vs. în aplicație:** configurarea P&L și P&L-ul salvat se fac **în aplicație** (nu există tool MCP — ghidează-l + dă link). Prin conexiune POȚI regla *manela* — tipurile de produs și conturile lor (`create_product_type`, `update_product_type`, `update_product_type_accounts_per_unit`) — și poți citi/calcula (`raport_vanzari`, `analyze_food_costs`, `get_accounting_overview`, SQL read-only).

## Reguli

- Nu inventa cifre. Dacă un tool nu întoarce datele, spune ce lipsește și ce raport/pagină ar ajuta (dă link).
- RON peste tot; TVA România 0/11/21.
- Pentru „de ce scade profitul / vânzările" — combină 2-3 surse (vânzări pe perioadă, food cost, manoperă) și dă o interpretare scurtă, onestă, cu cifre.
- Configurarea P&L / P&L salvat = în aplicație (zero tool MCP); tipuri de produs = se pot face prin conexiune. Nu promite că modifici categorii/snapshot prin conexiune.
