# Produse, articole de meniu și rețete

Trei lucruri DIFERITE care se confundă des. Înțelege-le corect înainte să adaugi ceva.

## 1. Produs

Lucrul fizic din gestiune: are unitate de măsură (kg, l, buc), **stoc**, **preț de achiziție**, gestiune/depozit. Exemple: „Făină 00", „Roșii", „Coca-Cola 0.5L".
- Tipuri: materie primă, semipreparat, produs finit.
- Tool: `create_product`, `update_product`, `bulk_create_products`.

## 2. Articol de meniu

Lucrul **vandabil** către client, cu **preț de vânzare**. Trăiește pe un meniu, într-o categorie. Exemplu: „Pizza Margherita — 32 lei".
- Un articol de meniu e legat de un produs finit (și, prin el, de o rețetă).
- Tool: `add_menu_item(menuId, productId, price)`, `update_menu_item`, `bulk_update_menu_item_prices`.

## 3. Rețetă

**Din ce se face** un preparat: lista de ingrediente (produse) + cantități. Dă **costul** real al preparatului și determină **consumul de stoc** la vânzare.
- Tool: `create_recipe`, `add_recipe_ingredients`, `add_recipe_outputs` (co-produse/semipreparate), `set_recipe_labels`.
- ⚠ **Unitățile contează**: 200 g ≠ 200 kg, 50 ml ≠ 50 l. O greșeală de unitate strică food cost-ul (poate ieși ×1000) și stocul. Confirmă unitatea ingredientului.

## Cum se leagă cu stocul și costul

Vânzare articol de meniu → se „explodează" rețeta → scade stocul ingredientelor → costul realizat intră în food cost și marjă.
- Dacă **stocul nu scade** după vânzare: probabil rețeta nu e legată corect de produs, sau produsul a fost redenumit. Verifică legătura rețetă↔produs.
- Dacă **food cost-ul e absurd**: aproape mereu o unitate de măsură greșită în rețetă.

## Adăugare corectă (flux recomandat)

1. Creează **produsul** (dacă nu există).
2. Creează **rețeta** + ingrediente (pentru cost/consum), dacă e preparat.
3. Adaugă-l ca **articol de meniu** cu preț pe meniul potrivit.
4. Verifică: dă link la Meniu (`gaseste_in_aplicatie("meniu")`) și confirmă prețul + TVA.

## TVA

Cote România: 0%, 11%, 21%. De regulă mâncarea preparată la 11%. Dacă nu ești sigur, întreabă sau lasă cota implicită a brandului. Nu folosi 5/9/19.
