---
name: gestioneaza-loialitate
description: Gestionează programul de fidelitate / loialitate prin conexiune (MCP) + navigare vizuală — niveluri (tier-uri), recompense, acordarea/răscumpărarea/expirarea punctelor, segmente RFM, alerte de scădere (win-back) și fișa de puncte a unui client. Acoperă DOUĂ programe SEPARATE: loialitatea hotel (pe nopți, /hotel/crm — cu tool-uri de scriere complete) și loialitatea POS/restaurant (pe lei cheltuiți, /loyalty — citire + configurare în pagină). Folosește la „cum stă programul de fidelitate", „câți membri am / câte puncte datorez", „câte puncte are clientul X", „adaugă un nivel Gold / Platinum", „adaugă o recompensă în catalog", „dă-i 500 de puncte clientului ca gest comercial", „scade niște puncte", „răscumpără o recompensă", „expiră punctele vechi", „recalculează RFM / segmentele", „cine sunt VIP-urii mei", „ce clienți buni au început să plece / cine pleacă / win-back", „de ce nu urcă clientul de nivel", „pornește programul de fidelitate".
---

# Gestionează loialitatea — niveluri, recompense, puncte, RFM, win-back prin MCP + navigare

Userul (proprietar/manager) vrea să-și gestioneze programul de fidelitate: să vadă cum stă, să acorde sau să răscumpere puncte, să adauge niveluri și recompense, să-și găsească VIP-urii și clienții care încep să plece. Tu faci munca prin **conexiune (tool-uri MCP)** — rapid, fără click-uri prin taburi — și îi **ARĂȚI** rezultatul deschizându-i pagina pe tab-ul potrivit (deep-link) + screenshot. Click manual doar în cele câteva locuri unde nu există tool.

## ⚠ Întâi de tot: care dintre cele DOUĂ programe?

Symbai are **două programe de fidelitate complet separate** — nu le amesteca, punctele nu se transferă:

| | Loialitate HOTEL | Loialitate POS / restaurant-retail |
|---|---|---|
| Pe ce se câștigă | **nopți de cazare** + venituri folio | **lei cheltuiți** la vânzare |
| Pagina | **`/hotel/crm`** | **`/loyalty`** (Fidelizare & Recompense) |
| Entitatea | **oaspete** (`guestProfileId`) | **client** (`customerId`) |
| Scriere prin MCP | **DA — set complet** (vezi tabelul) | **NU dedicat** — citire + configurare în pagină |

**Întreabă-te / întreabă userul:** are hotel? Vorbește despre nopți, oaspeți, camere, folio → **hotel**. Vorbește despre clienți la masă, telefon de fidelitate, lei cheltuiți, recompense la restaurant/magazin → **POS**. La dubiu, întreabă scurt. Restul skill-ului tratează separat fiecare.

## Înainte de orice
1. Citește **`knowledge/loialitate-fidelizare.md`** (concepte: punct, regulă de acumulare, nivel/tier, recompensă, RFM, alertă de scădere; cele 4 pagini; fluxurile pas-cu-pas; capcanele — mai ales „POS ≠ hotel" și „punctele doar pentru clienți identificați") și **`knowledge/condu-chrome.md`** (doctrina: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie). Pentru găsirea clienților valoroși/segmentare vezi și **`knowledge/segmentare-clienti.md`**.
2. **Context:** `list_brands` + `list_locations` → afli `brandId`/`locationId` (aproape toate tool-urile de loialitate le cer).
3. **Vizibil pentru user:** ai nevoie de extensia Chrome (`claude-in-chrome`) + user logat ca să-i arăți pagina. Dacă nu e conectată, poți tot lucra prin tool-uri „pe orb", dar spune-i clar că nu-i poți ARĂTA rezultatul; oferă-i s-o conecteze.

## A) Loialitate HOTEL — set complet prin MCP

Aici ai tool-uri de scriere reale. **Intenție → tool:**

| Userul vrea | Tool MCP | Tab unde i-l arăți |
|---|---|---|
| „cum stă programul / câți membri / câte puncte datorez" | `get_hotel_loyalty_overview` | `?tab=overview` |
| „câte puncte are oaspetele X / istoricul lui" | `get_guest_loyalty_detail(guestProfileId)` | `?tab=overview` |
| „adaugă un nivel Gold / Platinum" | `create_loyalty_tier(name, pointsThreshold?, nightsThreshold?, earnMultiplier?, benefits[]…)` | `?tab=tiers` |
| „adaugă o recompensă în catalog" (noapte gratis, credit F&B, upgrade) | `create_loyalty_reward(name, pointsCost, rewardType?, rewardValue?, minTierKey?…)` | `?tab=redemptions` |
| „dă-i N puncte / scade-i puncte (gest comercial, corecție)" | `award_loyalty_points(guestProfileId, points, reason)` — pozitiv acordă, **negativ scade** (≠0); recalculează tier-ul automat | `?tab=overview` |
| „răscumpără recompensa Y pentru oaspete" (generează voucher) | `redeem_loyalty_points(guestProfileId, redemptionId, folioId?…)` | `?tab=redemptions` |
| „expiră punctele vechi / ajunse la termen" | `expire_loyalty_points()` (global; întoarce câte s-au expirat) | `?tab=overview` |
| „recalculează tier-ul/statisticile unui oaspete" | `recompute_guest_loyalty(guestProfileId)` (mentenanță, idempotent) | — |
| „recalculează RFM / segmentele" (după import sau periodic) | `recompute_loyalty_rfm()` (toți oaspeții locației) | `?tab=segments` |
| „cine pleacă / clienți buni care s-au răcit / win-back" | `evaluate_loyalty_drop_alerts()` (întoarce nr. alerte; apoi le faci ofertă) | `?tab=campaigns` |

**Navigare (deep-link, fără click prin taburi):** `navigate("/hotel/crm?tab=<tab>")`. Tab-urile reale: `overview`, `tiers`, `rules` (reguli de acumulare puncte), `redemptions` (catalog recompense), `segments` (RFM), `campaigns`, `journeys`, `dsar` (GDPR). Link live = `gaseste_in_aplicatie("loialitate hotel")` sau `gaseste_in_aplicatie("CRM hotel")`. După o scriere prin MCP, deschide-i tab-ul relevant + **screenshot** = dovada rezultatului.

**Câteva precizări:**
- `create_loyalty_tier`: pragul poate fi pe **puncte lifetime** (`pointsThreshold`) SAU pe **nopți** (`nightsThreshold`); `earnMultiplier` (ex. 1.25 = +25% puncte la nivelul ăsta); `benefits[]` = listă de text.
- `create_loyalty_reward`: `pointsCost` > 0 obligatoriu; `rewardType` (ex. `free_night`, `fb_credit`, `room_upgrade`), `rewardValue` (EUR la credit/noapte gratis), `minTierKey` (ex. `silver`) dacă vrei recompensa doar de la un nivel în sus.
- `award_loyalty_points`: **pune mereu `reason`** — rămâne în ledger și e auditat. `expiresAt`: lipsă = expirare implicită (2 ani), `null` = fără expirare.
- Reguli de acumulare puncte (câte puncte / noapte / leu, multiplicatori) = tab `rules` — **se editează în pagină** (nu există tool dedicat de scriere a regulii). Ghidează userul acolo.

## B) Loialitate POS / restaurant — citire prin MCP, configurare în pagină

⚠ **NU există tool-uri MCP dedicate de scriere pentru programul POS** (`create_loyalty_tier`/`award_loyalty_points` etc. sunt **doar pentru hotel**). Aici lucrezi astfel:

**Ce ARĂȚI / CITEȘTI prin MCP:**
- Cine sunt clienții valoroși / cine merită contactat acum → `list_nba_suggestions` (coada Next-Best-Action: hot lead, `win_back`, `upsell`, `review_request`, birthday — cu scor 0-100 și motivul). Asta e răspunsul tău la „cine pleacă / pe cine reactivez / cine-s VIP-urii".
- Ce s-a întâmplat cu un client (inclusiv puncte/comunicări) → `get_customer_timeline(customerId)`.
- Cum merge conversia per surse → `get_crm_funnel`.
- Soldul/segmentele unui client în general → `execute_sql_query` (SELECT-only) pe `guest_profiles`/`loyalty_transactions` dacă userul vrea o cifră exactă care nu iese din tool-urile de mai sus.

**Ce CONFIGUREZI (în pagină — ghidezi userul sau apeși tu prin Chrome):**
- `navigate("/loyalty?tab=settings")` — **Setări**: regula de acumulare (ex. 1 punct/leu), valoarea de răscumpărare (ex. 100 pct = 5 lei), **nivelurile** cu praguri + beneficii, **recompensele**, bonus de zi de naștere / înscriere.
- `navigate("/loyalty?tab=customers")` — **Clienți cu puncte**: soldul fiecăruia, istoric, filtrare pe nivel.
- `navigate("/loyalty?tab=overview")` — **Privire de ansamblu**: puncte emise/răscumpărate, top clienți.
- Link live: `gaseste_in_aplicatie("fidelizare")` sau `gaseste_in_aplicatie("loialitate")` → întoarce `/loyalty`.

Pentru „pornește programul de fidelitate" la POS: du-l pe `/loyalty?tab=settings`, ajută-l să seteze regula + valoarea + nivelurile + bonusurile; de acolo punctele se acumulează automat la fiecare vânzare către un client **identificat** (telefon / card de fidelitate — vânzările anonime NU acumulează).

## Cele câteva locuri cu click (nu există tool)
- **Regulile de acumulare** (puncte/leu sau puncte/noapte, multiplicatori, bonus zi de naștere/înscriere) — atât la POS (`/loyalty?tab=settings`) cât și la hotel (`/hotel/crm?tab=rules`): se editează în pagină. Conduci tu prin Chrome sau dictezi userului.
- **Configurarea POS-loialitate în întregime** (nivele/recompense restaurant) — pagină, vezi secțiunea B.
- **Ștergerea** unui nivel/recompense/client — nu prin conexiune; ghidează userul să șteargă din aplicație.

## Reguli (cele care contează)
- **POS ≠ hotel.** Nu căuta punctele de cazare în `/loyalty` și nici clienții de restaurant în `/hotel/crm`. Tool-urile `create_loyalty_*`/`award`/`redeem`/`expire`/`recompute_*`/`drop_alerts` operează pe **oaspeți hotel** (`guestProfileId`). Dacă userul cere „adaugă un nivel" și are restaurant fără hotel → e configurare în `/loyalty?tab=settings`, NU `create_loyalty_tier`.
- **`award_loyalty_points` cu motiv, mereu.** Rămâne auditat în ledger. Folosește valori negative pentru corecții/scăderi.
- **Confirmă cu citire, nu repeta scrierea.** După o scriere, interfața poate arăta valori vechi până la refresh (cache browser). Re-citește cu `get_hotel_loyalty_overview`/`get_guest_loyalty_detail`, nu da scrierea din nou.
- **„De ce nu urcă clientul de nivel?"** Verifică pragul nivelului (tab Tier-uri / Setări) vs soldul clientului. La hotel, după modificări de date rulează `recompute_guest_loyalty(guestProfileId)`; segmentele RFM se reîmprospătează cu `recompute_loyalty_rfm`.
- **GDPR înainte de campanii.** Înainte să trimiți oferte/win-back către segmente de loialitate, respectă opt-out-ul per canal (email/SMS/WhatsApp). Vezi `knowledge/gdpr-clienti-oaspeti.md`.
- **Arată, nu doar fă.** După fiecare acțiune, deschide pagina pe tab-ul potrivit (`?tab=`) + screenshot. Limbaj de restaurant/hotel cu userul („i-am dat 500 de puncte", „am adăugat nivelul Gold de la 2000 de puncte"), nu jargon (`earnMultiplier`, `guestProfileId`).
- **Permisiune:** scrierile cer modulul **Rezervări & Clienți** (`rezervari_clienti`) pe token. Citirile (overview/detaliu/NBA/funnel) merg oricum. „Permisiune insuficientă" → portal Hub → Acces AI → bifează modulul. Catalogul complet de tool-uri + permisiuni e în `knowledge/tools-mcp.md`.
- **Nu inventa** solduri, praguri sau valori de recompensă. Ce nu știi → citești cu un tool sau întrebi userul.

## Legături
- Concepte + fluxuri + FAQ + capcane loialitate → `knowledge/loialitate-fidelizare.md`.
- Cum conduci Chrome (deep-link `?tab=`, screenshot = livrabil, click doar la nevoie, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Găsirea VIP-urilor / clienților care pleacă, segmente → `knowledge/segmentare-clienti.md` + skill-ul `gestioneaza-crm`.
- Trimiterea ofertei de reactivare după win-back → `knowledge/email-marketing.md` / `knowledge/marketing-social.md` + skill-ul `programeaza-postare`.
- Respectarea consimțământului înainte de campanii → `knowledge/gdpr-clienti-oaspeti.md`.
- Unde e o pagină / link direct → tool-ul `gaseste_in_aplicatie` sau skill-ul `gaseste-pagina`.
- Blocaj (ceva ce nu se poate prin conexiune — ex. regulă de acumulare prin MCP) → `trimite_ticket_symbai` (sugestie) + ghidează în aplicație.
