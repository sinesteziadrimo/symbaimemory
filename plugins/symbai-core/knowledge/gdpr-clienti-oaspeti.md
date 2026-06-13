# GDPR & date clienți

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Symbai te ajută să respecți GDPR pentru datele clienților și oaspeților: poți exporta toate datele unui client (dreptul la portabilitate), îl poți anonimiza (păstrezi istoricul de vânzări fără date personale), poți fuziona duplicate (fără să pierzi istoricul) și poți verifica jurnalul de consimțăminte (cine a acceptat email/SMS/WhatsApp). Înainte de orice campanie de marketing, sistemul verifică automat consimțământul pe canalul respectiv. Acest ghid e despre **conformitate și igiena bazei de clienți** — operațiuni rare dar importante.

## Concepte

- **Dreptul de a fi uitat** — la cererea clientului, datele lui personale se șterg/anonimizează. În Symbai se face prin **anonimizare** (păstrezi tranzacțiile pentru contabilitate, dar fără nume/telefon/email) sau prin „forget" pentru ștergere completă a datelor personale.
- **Portabilitatea datelor** — clientul poate cere o copie a tuturor datelor lui; o exporți într-un fișier.
- **Consimțământ per canal** — un client poate accepta email dar refuza SMS. Fiecare canal se verifică separat înainte de trimitere.
- **Fuziune de duplicate** — același client introdus de două ori (typo la telefon, nume scris diferit) → îi unești, păstrând tot istoricul, cu urmă de audit. NU se pierde nimic.
- **Anonimizare vs ștergere** — anonimizarea păstrează rândul de vânzare (pentru rapoarte/contabilitate) dar scoate datele personale; ștergerea („forget") elimină datele personale complet. Alegi în funcție de cerința legală.
- **Jurnal de consimțăminte** — istoricul: cine a dat/retras consimțământ, când, pe ce canal.

## Pagini

- **Clienți** (`/customers`) — baza de clienți; de aici vezi un client, istoricul, tagurile, și inițiezi operații GDPR.
- **Oaspeți hotel** (`/hotel/guests`) — profiluri de oaspeți (VIP, preferințe, marcaje GDPR) pentru proprietățile cu cazare.
- Setările de consimțământ și colectare apar în setările de feedback/marketing și în formularele publice (rezervare, recenzie) — clientul bifează acolo acordul.

## Fluxuri pas-cu-pas

1. **Clientul cere o copie a datelor lui (portabilitate)**: `export_customer_gdpr_data` (sau `export_guest_gdpr_data` pentru un oaspete hotel) → primești un pachet cu toate datele lui, pe care i-l trimiți.
2. **Clientul cere ștergerea („să fiu uitat")**: dacă trebuie păstrat istoricul contabil → `anonymize_guest` (scoate datele personale, păstrează tranzacțiile); dacă trebuie șters complet → `forget_customer_gdpr`. Explică-i clientului că vânzările rămân anonime pentru evidența fiscală.
3. **Cureți duplicatele din bază**: `find_duplicate_guests` îți arată perechile suspecte → verifici → `merge_guests` le unește, păstrând istoricul.
4. **Verifici ce consimțăminte are un client** înainte de o campanie: `list_gdpr_consent_log` → vezi pe ce canale poate fi contactat.
5. **Trimiți o campanie**: nu trebuie să verifici manual fiecare client — la trimitere, sistemul sare automat peste cei care au opt-out pe canalul respectiv (vezi și `check_marketing_allowed` în ghidul de comunicare).

## Tool-uri MCP utile

- Citire: `list_gdpr_consent_log`, `find_duplicate_guests`, `export_customer_gdpr_data`, `export_guest_gdpr_data`.
- Scriere (modulul **Rezervări & Clienți** pe token): `anonymize_guest`, `merge_guests`, `forget_customer_gdpr`.
- ⚠ Ștergerea de entități întregi NU se face prin conexiune ca operație obișnuită — operațiile GDPR de mai sus sunt special concepute pentru asta (cu audit). Pentru altceva, îndrumă utilizatorul să șteargă din aplicație.
- Permisiunea exactă: vezi `tools-mcp.md`.

## Întrebări frecvente

- **De ce nu pot pur și simplu să șterg un client?** Pentru conformitate + integritatea istoricului, ștergerea trece prin anonimizare/„forget" (cu audit). Așa rapoartele fiscale rămân corecte fără date personale.
- **Anonimizare sau ștergere — ce aleg?** Dacă există tranzacții (facturi, vânzări) de păstrat pentru contabilitate → anonimizare. Dacă e doar un contact fără istoric relevant → ștergere completă.
- **Fuziunea pierde istoricul?** Nu — unirea păstrează toate comenzile/punctele și lasă urmă de audit.
- **De ce nu primește clientul email/SMS de la campanii?** Probabil are opt-out pe acel canal. Verifică `list_gdpr_consent_log`. Sistemul respectă opt-out-ul automat.
- **Cât timp păstrez datele?** Conform politicii tale de retenție și legislației aplicabile; Symbai îți dă uneltele, decizia de retenție e a ta.

## Capcane

- **Anonimizarea e ireversibilă** — confirmă întâi identitatea clientului și cererea. Nu o rula „de test".
- **Caută duplicate ÎNAINTE de a fuziona** — `merge_guests` unește doi clienți specifici; verifică cu `find_duplicate_guests` că sunt chiar aceeași persoană.
- **Consimțământul se verifică pe canal, nu global** — un client poate fi OK pe email și opt-out pe SMS.
- **Oaspeții hotel au profil separat** de clienții POS (`/hotel/guests` vs `/customers`); folosește tool-ul potrivit (`export_guest_gdpr_data` vs `export_customer_gdpr_data`).
