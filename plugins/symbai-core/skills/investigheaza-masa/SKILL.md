---
name: investigheaza-masa
description: Investighează ce s-a întâmplat pe o masă, o notă, o comandă sau ce a făcut un ospătar — anulări, discount-uri, transferuri, plăți, retur, cine a aprobat. Folosește la „ce s-a întâmplat la masa 5", „de ce s-a anulat nota X", „ce a făcut ospătarul Ion azi", „cine a dat discountul".
---

# Investighează o masă / notă / ospătar

Scop: să reconstruiești **cronologic** ce s-a întâmplat și să răspunzi clar, fără a arunca date brute.

## Cu acces SQL (dacă tokenul are SQL read-only)

Folosește `execute_sql_query` (doar SELECT). Workflow:
1. `list_database_tables` apoi `describe_database_table` pe tabelele relevante (vezi safeColumns).
2. Identifică comanda: caută în `orders` după masă + interval orar (sau după numărul notei).
3. Strânge firul: `order_items` (ce s-a comandat/anulat), `operation_requests` (transferuri, discount, retur, casă — cu cine a cerut/aprobat), `payments` (cum s-a plătit), `audit_logs` (cine, ce, când).
4. Construiește un **răspuns narativ pe minute**, nu un tabel brut:
   > Masa 5, ospătar Mada — 19:12 deschisă, 19:40 adăugat 2× Pizza, 20:05 transfer la masa 8 (aprobat de manager Ana), 20:30 discount 10% (motiv: client fidel), 20:45 plată card 240 RON.

## Fără acces SQL

Folosește `list_entities` (reservations, financial_transactions) + `get_reservations_overview`. Vei avea o imagine mai limitată. Spune utilizatorului că pentru o investigație detaliată (cronologie operații/ospătari) e nevoie de **acces SQL** — se activează din portal Hub → Acces AI (comutatorul „Interogări SQL").

## Reguli

- Cronologie strictă pe oră/minut; nume de ospătar/manager, nu ID-uri.
- Pentru „cine a aprobat" / „cine a anulat" — caută aprobatorul în operații + audit, nu presupune.
- Sume în RON. Nu dump-ui rânduri brute; sintetizează.
- Dacă nu găsești comanda, cere mai multe detalii (data, ora aproximativă, numărul mesei sau al notei).
