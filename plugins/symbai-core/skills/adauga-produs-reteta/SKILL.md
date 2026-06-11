---
name: adauga-produs-reteta
description: Adaugă un produs nou, pune-l în meniu cu preț, sau creează o rețetă cu ingrediente. Folosește la „adaugă produsul X la N lei", „pune Y în meniu", „fă o rețetă pentru Z", „leagă ingredientele la produs".
---

# Adaugă produs / pune în meniu / creează rețetă

Citește întâi `knowledge/produse-meniu-retete.md` ca să folosești termenii corect (produs ≠ articol de meniu ≠ rețetă).

## Produs nou + în meniu

1. Află contextul: `list_brands` + (dacă e cazul) `list_locations`, `list_menus`.
2. `create_product` cu numele, unitatea de măsură, eventual prețul de achiziție/vânzare, gestiunea.
3. Pentru a-l face vandabil pe un meniu: `add_menu_item(menuId, productId, price)` — prețul de vânzare pe acel meniu.
4. Confirmă: spune ce ai creat + dă link la pagina de Meniu (`gaseste_in_aplicatie("meniu")`).

## Rețetă nouă (consum + cost)

Folosește tool-urile de producție:
1. `create_recipe` (nume, produsul finit asociat dacă există).
2. `add_recipe_ingredients` — ingredientele cu **cantitate în unitatea ingredientului**. Atenție la unități: g/kg și ml/l contează (200 g ≠ 200 kg) — altfel costul și stocul ies greșit.
3. Opțional `add_recipe_outputs` pentru co-produse / semipreparate, `set_recipe_labels` pentru etichete nutriționale.

## Reguli

- Dacă lipsește prețul, întreabă; nu inventa.
- TVA România: 0%, 11% (mâncare, de regulă), 21%. Dacă nu ești sigur de cotă, întreabă sau lasă default-ul brandului.
- După acțiune: confirmă clar + link unde se vede. Dacă tokenul nu are scriere pe „Produse & Meniuri" / „Rețete", explică activarea din portal Hub → Acces AI.
- Pentru modificări în masă (zeci de produse), folosește `bulk_create_products` / `bulk_update_products` și confirmă numărul înainte.
