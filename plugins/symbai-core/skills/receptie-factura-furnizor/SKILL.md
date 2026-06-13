---
name: receptie-factura-furnizor
description: Procesează facturile de la furnizori (Intrări Marfă) — mapează liniile la produse + conturi, factor de pachet, deductibilitate, recepție/NIR, reconciliere aviz/poză cu eFactura. Folosește la „mapează factura de la X", „recepție marfă", „de ce nu intră pe stoc", „leagă avizul de factură", „factură furnizor fără recepție", „reconciliază facturile", „intrări marfă", „NIR".
---

# Recepție factură furnizor (Intrări Marfă) — corect și complet

Citește întâi `knowledge/intrari-marfa-receptie.md` (fluxul + ce e fiecare câmp) și secțiunea „⚠ De știut la scrieri prin MCP" din `knowledge/tools-mcp.md`. Regula de aur: **stocul se mișcă DOAR la NIR postat** — nimic mai devreme.

## Principii (nu greși astea)
- **Nu inventa** produse, conturi sau prețuri. Ce nu se potrivește clar → întreabă userul sau lasă pentru mapare manuală.
- **Caută înainte de a mapa** (`search_products_db`), **verifică prin citire după** (`get_received_efactura_details`). UI-ul se actualizează la refresh.
- **Contul vine din tipul produsului** — leagă linia de produsul corect și contul se rezolvă singur. Nu forța 371 pe servicii.
- **Crearea NIR-ului (intrarea pe stoc) se face din aplicație** — dă userului linkul (`gaseste_in_aplicatie`). Tool MCP de NIR vine separat.

## Faza 1 — Context
`list_brands` + `list_locations` (pentru brandId/locationId/magazii). `list_suppliers` dacă lucrezi pe un furnizor anume.

## Faza 2 — Vezi ce e de procesat
`list_received_efactura({ hasNir: false })` — facturile FĂRĂ recepție (de procesat). Filtrează după `status` (`new`/`mapped`), `mappingStatus` (`unmapped`/`partially_mapped`/`ai_mapped`), `supplierId`, interval de date. Arată-i userului lista (furnizor, număr, dată, total, câte linii / câte acceptate) și confirmă pe care le procesăm.

## Faza 3 — Pe fiecare factură: mapează liniile
1. `get_received_efactura_details({ invoiceId })` — vezi liniile + starea (produs mapat, cont, acceptat, factor pachet).
2. Pentru fiecare linie **nemapată / neacceptată**:
   - `search_products_db` pe descrierea liniei → găsește produsul intern. Dacă nu există, întreabă userul dacă să-l creezi (`create_product`, modul `produse_meniu`) sau dacă e altul existent (typo/diacritice).
   - `map_invoice_line({ invoiceId, lineId, productId })` — leagă + acceptă + învață regula. Contul se rezolvă automat din tipul produsului; dă `accountCode` doar dacă userul vrea altul.
   - **Factor de pachet**: dacă furnizorul facturează în bax/cutie și tu ții la bucată, adaugă `packMultiplier` (ex. 24) + `packKeyword` („bax"). Recalculează cantitatea/prețul, păstrând originalul.
3. Dacă mai multe linii sunt deja mapate de AI cu încredere bună: `accept_all_invoice_mappings({ invoiceId })` (acceptă în bloc cele ≥ 0.5; nu creează produse noi).

## Faza 4 — Context factură (opțional)
`set_invoice_context({ invoiceId, ... })`:
- `warehouseId` / `warehouseIds` — magazia de recepție.
- `brandId` / `locationId` — unitatea.
- `invoiceType` — marfuri / materii_prime / servicii / utilitati / ambalaje / imobilizari.
- `vatDeductibility` / `expenseDeductibility` / prepaid 471 — **etichetă pentru contabil** (azi nu schimbă nota contabilă; spune-i userului).

## Faza 5 — Recepția (NIR) = intrarea pe stoc
Când TOATE liniile sunt mapate + acceptate (verifică cu `get_received_efactura_details` → `mappingStatus: "fully_mapped"`): trimite userul în aplicație, Intrări Marfă → tab Recepții (NIR) → „Recepție Nouă" (alege factura sursă + magazia) → Creează NIR. Dă-i linkul cu `gaseste_in_aplicatie("recepție marfă / NIR")`. La postare intră marfa pe stoc + se generează notele contabile.

## Faza 6 — Reconciliere (aviz/poză ↔ eFactura) — ca să nu pierzi/dublezi facturi
Caz tipic: a venit marfa cu aviz / s-a făcut recepție din poză, iar eFactura oficială vine mai târziu.
- Dacă ciorna din poză e **neaprobată** și sumele se potrivesc → eFactura o **înlocuiește automat** la import (nimic de făcut).
- Altfel, trimite userul în Intrări Marfă → tab **Reconciliere** → „Leagă" documentul de eFactura candidată. **Avertizează-l să verifice numărul + suma** înainte de „Leagă" (legarea se face doar pe furnizor, nu verifică suma — risc de a lega două facturi diferite).
- Verifică „igiena" în `/inventory/inbox-quality` (eFacturi fără NIR, NIR-uri ciornă vechi, mapări slabe).

## Faza 7 — Verifică prin citire
- `get_received_efactura_details` — `mappingStatus` + ce linii mai sunt nemapate.
- `list_received_efactura({ hasNir: true })` — confirmă că factura a primit NIR.
- `list_pending_nirs` — NIR-uri ciornă nepostate.
- `get_stock_levels` pe 1-2 produse — confirmă că stocul a crescut după NIR.

## Capcane (spune-le userului când apar)
- **„De ce nu intră pe stoc după poză?"** Recepția din poză = doar ciornă. Mapare → Aprobă → Creează NIR cu magazie.
- **„Permisiune insuficientă"** la map_invoice_line / set_invoice_context → tokenul n-are modulul `inventar` („Stocuri & Recepție"). Portal Hub → Acces AI.
- **Factură deja cu NIR** → `map_invoice_line` și câmpurile structurale din `set_invoice_context` se blochează (ar dezalinia stocul). Modificarea se face din aplicație („Modificare NIR").
- **Serviciu pe cont de marfă (371)** → tip produs greșit. Leagă-l de un produs de tip serviciu (contul devine 628 automat) sau schimbă tipul.
- **Preț recepție / deductibilitate** nu se reflectă în notele contabile → e normal azi (informativ). Stocul se valorează la cost.
- **NIR dublu** pe aceeași factură = stoc dublat → caută în Recepții (NIR) după furnizor+dată, raportează cu `trimite_ticket_symbai` dacă pare bug.
- Dacă lovești un perete (ceva ce se poate doar din aplicație) → `trimite_ticket_symbai` (tip „sugestie", cu `dedupeKey`).
