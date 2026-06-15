---
name: configureaza-portal
description: Configurează portalul/aplicația clienților (platforma web publică) — ce văd și ce pot face vizitatorii: aspectul (culori, font, butoane, carduri), funcționalitățile (meniu, comenzi, rezervări, fidelitate, jocuri, gamificare, chat), textele de bun venit, ce tab-uri și secțiuni apar, setările meniului public (alergeni, gramaj, filtre dietetice), plus jocurile/atracțiile parcului (program, prețuri, excepții de dată) și rezervările de joc. Le faci prin conexiune (MCP), nu prin click pe dialogul cu 5 tab-uri. Folosește la „configurează portalul clienților", „schimbă culorile/aspectul portalului", „pune verde/violet pe portal", „schimbă numele platformei", „activează rezervările/jocurile/fidelitatea pe portal", „ascunde meniul/comenzile din portal", „schimbă textul de bun venit", „arată alergenii/gramajul în meniul public", „ce tab-uri văd clienții", „adaugă un joc/atracție", „pune program/preț la jocul X", „închide jocul pe 25 decembrie", „rezervă un joc pentru un client", „de ce nu apare X în aplicația clienților".
---

# Configurează portalul clienților — prin conexiune, nu prin click pe dialog

Userul vrea să schimbe **platforma/portalul clienților** — aplicația web publică pe care o văd vizitatorii lui (scanează un QR la masă, intră de pe site, din parc): cum arată (culori, font), ce module sunt pornite (meniu, comenzi, rezervări, fidelitate, jocuri, gamificare, chat), ce scrie pe pagina de bun venit, ce tab-uri și secțiuni apar, ce afișează meniul public, plus jocurile/atracțiile (program, prețuri, rezervări). Pagina de configurare din aplicație e un **dialog cu 5 tab-uri** (General, Texte, Funcționalități, Aspect, QR) — fragil de operat prin mouse. **Tot ce contează are tool MCP**: citești config-ul, scrii doar ce ceri, fără să te chinui prin tab-uri. Apoi îi arăți userului rezultatul.

## Înainte de orice
1. Citește **`knowledge/portal-config.md`** (ce e portalul, cele 7 tool-uri de config + modelul lor, ce înseamnă fiecare grup de setări — aspect/funcționalități/texte/afișare/meniu — și ce e „doar din pagină"), **`knowledge/jocuri-activitati.md`** (jocuri & atracții: program pe zile, sloturi, prețuri, excepții de dată, rezervări de joc — toate tool-urile de jocuri sunt detaliate acolo) și **`knowledge/condu-chrome.md`** (cum conduci Chrome: MCP întâi, deep-link, screenshot = livrabil, click doar la nevoie).
2. **Context**: `list_brands` + `list_locations` → afli `brandId` (și `locationId` dacă userul vrea un portal diferit pe o locație). Aproape toate tool-urile cer `brandId`.
3. **Citește ÎNTÂI starea curentă**: `get_portal_config(brandId)` întoarce TOATĂ configurarea (tip business, culori, texte, funcționalități, afișare, QR). Citește înainte de orice scriere — ca să nu strici ce e deja setat și ca să-i spui userului ce e acum vs. ce schimbi.

## Fluxul hibrid — ce tool pentru ce intenție

Scrierile merg prin tool-ul dedicat (scriu DOAR câmpurile pe care le dai — merge server-side, nu șterg restul). Tabel intenție → tool:

| Userul cere… | Tool MCP |
|---|---|
| „schimbă culorile / pune violet / alt font / butoane rotunjite / carduri cu umbră" | `configure_portal_appearance` (primaryColor/secondary/accent/background/text hex, fontFamily, borderRadius, buttonStyle, cardStyle, navStyle) |
| „activează/oprește rezervările / comenzile / jocurile / fidelitatea / gamificarea / chatul AI / notificările / meniul" | `configure_portal_features` (menu, orders, reservations, qrCode, attractions, games, events, gamification, loyalty, social, chat, notifications, friends, messages — toate boolean) |
| „schimbă titlul de bun venit / subtitlul / textul butonului / textul de înregistrare" | `configure_portal_texts` (welcomeTitle, welcomeSubtitle, exploreButton, discoverText, signupButton, signupDescription) |
| „schimbă numele platformei / tipul de business / cere autentificare / permite livrare-pickup" | `configure_portal_general` (portalName, businessType: restaurant/cafe/bar/qsr/amusement_park, requireLogin, requireDate, allowDelivery, allowPickup) |
| „ce tab-uri văd clienții / ascunde tab-ul X / redenumește tab-ul / ce secțiuni apar pe home / pe profil" | `configure_portal_display` (tabs{}, tabLabels{}, homeSections{}, profileSections{}) |
| „arată/ascunde alergenii / gramajul / descrierile / nutriția în meniul public / pune filtre dietetice / banner meniu" | `configure_portal_menu_config` (showAllergens, showWeight, showDescription, showNutrition, showCategoryHeaders, dietaryFilters[], menuHeroImage) |
| „ce am acum pe portal / cum e configurat" | `get_portal_config` (citire) |

**Jocuri & atracții** (când portalul e un parc/escape room/terenuri — `attractions`/`games` pornite în Funcționalități):

| Userul cere… | Tool MCP |
|---|---|
| „ce jocuri/atracții am" | `list_portal_games(brandId)` |
| „detalii la jocul X / program / prețuri / recenzii" | `get_game_details(gameId, date?)` |
| „avem loc pe data X ora Y pentru N persoane?" | `check_game_availability(gameId, date, time, partySize, exclusive?)` |
| „ce ore libere am pe data X" | `get_game_slots(gameId, date, partySize?)` |
| „rezervă jocul pentru un client" | `create_game_reservation(gameId, date, startTime, endTime, partySize, contactName, …)` — **întâi** `check_game_availability` ca să nu suprapui |
| „modifică jocul / nume / capacitate / vârstă / acceptă rezervări" | `update_game_config(gameId, …)` |
| „pune/schimbă program pe o zi (ore, durată slot, capacitate)" | `update_game_schedule(gameId, dayOfWeek, openTime, closeTime, …)` |
| „adaugă/schimbă prețul (per persoană/grup/exclusiv)" | `update_game_pricing(gameId, type, pricePerSession, …)` |
| „închide jocul pe 25 dec / program special într-o zi" | `set_game_date_override(gameId, date, closed?, customOpen?, …)` |

> Pentru jocuri, conceptele complete (slot, prep, label, exclusivitate, excepții care se „bat", overbooking) sunt în `jocuri-activitati.md` — nu le repeta, citește-le acolo. Aici e doar harta intenție→tool.

## Cum NAVIGHEZI (pentru a arăta userului)
- **Config portal** → `navigate("/portal-config")`. ⚠ Pagina are un **dialog cu 5 tab-uri** (General / Texte / Funcționalități / Aspect / QR) care se deschide la apăsarea cardului „Configurare Platformă Clienți" — **NU e adresabil prin `?tab=`** (e o modală în pagină). De-aia faci modificările prin MCP și deschizi pagina doar ca să ARĂȚI. (Display-ul de tab-uri/secțiuni și setările de meniu public sunt acoperite tot de tool-uri, deși în UI sunt în alt loc.)
- **Jocuri / atracții** → `navigate("/portal-games")` (gestionare: liste, programe, prețuri, excepții) și `/portal-attractions` (ce văd clienții). Un joc anume: `/portal-games/:gameId`.
- **Portalul public** (ce vede clientul) — userul îl deschide din QR/link; tu poți deschide pagina lui publică ca să-i arăți rezultatul aspectului.
- Linkul live exact: `gaseste_in_aplicatie("configurare portal")` / `gaseste_in_aplicatie("jocuri")` — sursa autoritară de navigare. **Nu inventa URL-uri.**

## Cum ARĂȚI rezultatul
Userul nu vede conexiunea ta. După o schimbare (mai ales de aspect — culori, font), deschide portalul în Chrome și **fă screenshot** ca dovadă „uite cum arată acum" (ai nevoie de extensia `claude-in-chrome` + user logat). Schimbarea de aspect/texte e VIZUALĂ — un screenshot convinge mai mult decât o confirmare în text. Fără extensie: faci tot prin MCP, dar spune-i clar „am schimbat prin conexiune, dă refresh la portal ca să vezi" + dă-i link (vezi `condu-chrome.md`, fallback).

## Cazurile rare care cer click (în pagină, nu prin MCP)
- **Upload de imagini** (logo portal, banner hero al meniului dacă nu ai deja un URL) — încarci fișierul în dialog/pagină; tool-ul ia doar URL-ul (`menuHeroImage`). Dacă ai deja URL-ul imaginii, mergi pe MCP.
- **QR-ul portalului** (tab-ul „QR" din dialog) — generare/descărcare cod QR e o acțiune de pagină.
- **Misiuni & recompense / gamificare avansată** (`/portal-missions`) — configurarea fină a misiunilor e în pagină; din MCP doar PORNEȘTI modulul (`gamification: true`).
- Pentru orice click: citește pagina întâi, găsește elementul după text/`data-testid`, click pe ELEMENT, nu pe pixeli (vezi `condu-chrome.md`).

## Reguli (cele care contează)
- **MCP întâi, dialogul cu 5 tab-uri = ultima soluție.** Operatul prin mouse al dialogului e fragil; tool-urile scriu doar ce ceri și nu strică restul. Citește cu `get_portal_config` înainte, scrie cu tool-ul potrivit, confirmă re-citind.
- **Scrii doar ce-ți cere userul.** Fiecare `configure_portal_*` ia doar câmpurile date — restul rămân neatinse. Nu trimite valori pe care nu le-ai confirmat (ai pune default-uri peste setări existente).
- **Culorile = hex.** `#7c3aed` violet, `#2563eb` albastru, `#059669` verde, `#dc2626` roșu. Dacă userul zice „pune verde", propune un hex concret și confirmă.
- **Per brand (sau per locație).** Config-ul e pe `brandId`; dă `locationId` doar dacă userul vrea un portal diferit pe o anumită locație. Întreabă dacă are mai multe locații.
- **Confirmă prin re-citire, nu prin „pare bine pe ecran".** Tool-ul a întors `success` = salvat; verifică cu `get_portal_config` și spune-i userului să dea refresh dacă portalul arată încă vechiul (cache browser). Nu repeta scrierea.
- **Jocuri: verifică ÎNAINTE de a rezerva.** `check_game_availability` înainte de `create_game_reservation` — altfel suprapui două grupe pe același slot.
- **Limbaj de business**, nu jargon de editor: „pun rezervările pe portal", „schimb culoarea în verde", „arăt alergenii în meniul public" — nu `configure_portal_features({reservations:true})`.
- **Permisiune (modul pe token):**
  - Config portal + jocuri (config/program/preț/excepție) → **Setări & Configurare** (`setari`).
  - Rezervare de joc (`create_game_reservation`) → **Rezervări & Clienți** (`rezervari_clienti`).
  - „Permisiune insuficientă" → modulul nu e bifat pe token → portal Hub → Acces AI.
- **Nu inventa.** Imagini, texte de brand, prețuri — ce nu știi, întrebi userul.

## Legături
- Conceptele portalului (cele 7 tool-uri + ce înseamnă aspect/funcționalități/texte/afișare/meniu public, dialogul cu 5 tab-uri, ce e „doar din pagină") → `knowledge/portal-config.md`.
- Jocuri & atracții complet (slot, prep, label, exclusivitate, excepții, prețuri pe label, FAQ + capcane) → `knowledge/jocuri-activitati.md`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element nu pe pixel, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Rezervări de masă, contracte, avansuri, evenimente/petreceri legate de portal → `knowledge/rezervari-clienti-evenimente.md` + skill-ul `gestioneaza-crm`.
- Meniul public arată produsele din meniul tău → produse/prețuri/categorii prin skill-ul `adauga-produs-reteta`; meniul TIPĂRIT (alt lucru) → skill-ul `meniu-fizic`.
- E pasul de onboarding „Website & portal clienți" — vezi `onboarding/12-website-portal-livrari.md` + `onboarding/harta-pasi-wizard.md`.
- Ceva ce nu se poate prin conexiune → `trimite_ticket_symbai` (sugestie) + ghidează userul în app.
