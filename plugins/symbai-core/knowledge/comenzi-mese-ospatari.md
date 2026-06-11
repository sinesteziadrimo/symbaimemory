# Comenzi, mese și operații ospătari

## Conceptele

- **Masă** — o poziție în planul de sală. Poate fi liberă, ocupată, sau cu notă deschisă.
- **Comandă / Notă** — ce a comandat masa: articole de meniu, cu cantități, preț, eventual discount. O masă poate avea o notă deschisă până la plată.
- **Ospătar** — angajatul care deschide nota, adaugă produse, încasează. Fiecare acțiune e atribuită lui.
- **Operații** — acțiuni speciale pe notă: **transfer** (mutarea notei pe altă masă/ospătar), **discount**, **retur**, **trimite la casă**, **split** (împărțirea notei), **share** (notă comună). Multe cer **aprobare** de la un manager.

## Ce poți investiga (cu acces SQL)

Firul unei mese/note se reconstituie din:
- `orders` — antetul comenzii (masă, ospătar, status, total, când s-a deschis/închis).
- `order_items` — produsele de pe notă (adăugate, anulate, cantități).
- `operation_requests` — operațiile cerute și cine le-a aprobat (transfer, discount, retur, casă).
- `payments` — cum s-a plătit (cash, card, Viva, mixt).
- `audit_logs` — jurnalul „cine a făcut ce, când" — sursa pentru „cine a anulat / cine a aprobat".

Răspunde **cronologic, narativ**, cu nume de oameni, nu cu ID-uri sau tabele brute. (Vezi skill-ul `investigheaza-masa`.)

## Plăți

- Metode: numerar, card (terminal sau Viva/Global Payments), mixt (split pe metode).
- O notă plătită nu se mai poate anula simplu — pentru corecții se folosesc stornări / retururi (rămâne urmă, nu se șterge).
- „Plăți duble" / „lipsă în Viva" sunt situații cunoscute de reconciliere — dacă utilizatorul întreabă, îndrumă-l spre pagina de Operațiuni/Plăți (dă link) și verifică plățile comenzii.

## Întrebări tipice

- „Ce s-a întâmplat la masa 5 azi?" → skill `investigheaza-masa`.
- „Ce a făcut ospătarul Ion?" → comenzile lui + operațiile cerute/aprobate + ore (audit).
- „De ce s-a aplicat discount la nota X?" → caută în `operation_requests` motivul + aprobatorul.
- „Cât a încasat masa / ospătarul?" → din `payments` legate de comenzile lor.

## Reguli

- Nu confunda „anulat un produs de pe notă" cu „anulat nota întreagă" — sunt evenimente diferite.
- Sume în RON. Cronologie pe ore/minute.
