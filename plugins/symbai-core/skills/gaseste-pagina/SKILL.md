---
name: gaseste-pagina
description: Ajută utilizatorul care întreabă unde se află ceva în Symbai sau cum ajunge la o pagină — „sunt pe pagina X, cum ajung la Y", „unde văd rapoartele", „unde adaug un produs", „dă-mi link la setări imprimante". Întoarce pagina + link direct + pașii.
---

# Găsește o pagină / dă link

Când utilizatorul întreabă **unde** e ceva sau **cum ajunge** undeva:

1. Apelează tool-ul MCP **`gaseste_in_aplicatie`** cu întrebarea lui în cuvintele lui (ex: „rapoarte vânzări", „adaugă imprimantă", „setări TVA"). Tool-ul citește harta LIVE a aplicației, deci e mereu corect chiar dacă meniul s-a schimbat.
2. Tool-ul întoarce: pagina potrivită, un **link direct** (ex: `https://restaurantultau.symbai.app/analytics`) și, uneori, pașii de navigare.
3. Dă utilizatorului **link-ul direct** + o frază scurtă „cum ajungi din meniu" dacă e disponibilă.
4. Dacă sunt mai multe potriviri (`data.matches`), oferă top 2-3 ca să aleagă.

## Exemple

- „Sunt pe pagina de comenzi, unde văd cât am vândut azi?" → `gaseste_in_aplicatie("rapoarte vânzări azi")` → dă link la Rapoarte/Analytics + „din meniul stâng → Rapoarte".
- „Unde schimb prețul la un produs?" → `gaseste_in_aplicatie("editare preț produs meniu")` → link la Meniu.
- „Cum ajung la setările de imprimantă?" → `gaseste_in_aplicatie("setări imprimante")`.

## Reguli

- NU ghici rute din memorie — folosește mereu `gaseste_in_aplicatie` (harta reală a instanței LUI, cu paginile lui).
- Dacă tool-ul nu găsește nimic, întreabă utilizatorul ce vrea să **facă** acolo (intenția), apoi reîncearcă cu alți termeni.
- Pentru „ce face pagina asta / ce înseamnă", după ce dai link-ul, completează din `knowledge/` (vezi `navigare.md` și fișierul modulului).
