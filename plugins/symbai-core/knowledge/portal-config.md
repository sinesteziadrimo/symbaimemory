# Portalul clienților — configurare (platforma web publică)

> Pentru linkul exact către orice pagină folosește `gaseste_in_aplicatie` — sursa autoritară de navigare (link direct pe subdomeniul tenantului). Pentru jocuri & atracții (program, prețuri, rezervări de joc) vezi `jocuri-activitati.md`; aici e doar configurarea portalului în sine.

## Pe scurt

**Portalul clienților** (sau „platforma clienților", „aplicația clienților") e site-ul/aplicația web PUBLICĂ pe care o văd vizitatorii restaurantului/parcului/hotelului: intră scanând un QR la masă, de pe website sau din parc. De acolo pot (după cum activezi tu): vedea meniul, comanda online (livrare/pickup), face rezervări, intra în programul de fidelitate, juca/rezerva atracții, vedea evenimente, folosi gamificarea (misiuni, XP, nivele), vorbi cu un chat AI. Tu controlezi TOT ce văd și ce pot face: **aspectul** (culori, font, stil), **funcționalitățile** pornite/oprite, **textele**, **ce tab-uri și secțiuni apar**, și **ce afișează meniul public** (alergeni, gramaj, filtre).

Configurarea se face în pagina **/portal-config**, care deschide un **dialog cu 5 tab-uri** (General, Texte, Funcționalități, Aspect, QR). Dialogul e fragil de operat prin mouse — de aceea preferi **tool-urile MCP**, care citesc config-ul și scriu doar ce ceri, fără click prin tab-uri.

## Concepte

- **Portal / platformă clienți** — instanța web publică a brandului (un „device" de tip canal, intern `parc-distractii`). Configurarea e per **brand** (opțional diferită per **locație**).
- **Tip business** (`businessType`) — restaurant / cafe / bar / qsr (fast-food) / amusement_park (parc de distracții). Schimbă layout-ul implicit și secțiunile sugerate (ex. parcul are accent pe atracții/jocuri).
- **Aspect (temă)** — identitatea vizuală: culoare principală/secundară/accent/fundal/text (hex), font (Inter, Poppins, Roboto, Montserrat, Playfair Display etc.), colțuri (ascuțite/rotunjite/capsule), stil butoane (plin/contur/pastel), stil carduri (umbră/bordură/flat), stil navigare (solid/transparent/minimal).
- **Funcționalități** — module pornite/oprite: meniu, comenzi, rezervări, QR la masă, profil, atracții, jocuri, evenimente, gamificare, fidelitate, grupuri sociale, chat AI, notificări push, prieteni, mesagerie. Oprit = clientul nu-l vede deloc.
- **Texte** — copywriting-ul paginii de bun venit: titlu, subtitlu, textul butonului principal („Vezi Meniul"/„Comandă acum"), text de descoperire, butonul + descrierea de înregistrare.
- **Afișare (display)** — ce **tab-uri** apar în navigare (home, menu, attractions, games, events, gamification, qrCode, profile) și cu ce **etichete** (poți redenumi „Menu" → „Meniul Nostru"); ce **secțiuni home** apar (hero de bun venit, statistici gamificare, widget rezervări, rezervările mele, CTA meniu, preview atracții, evenimente private/publice, carduri copii, program fidelitate, CTA înregistrare); ce **secțiuni profil** apar (portofel familie, grupuri, gestionare copii, istoric comenzi, progres gamificare, notificări).
- **Setări meniu public** — ce arată meniul din portal: gramaj/porție, alergeni, descrieri, info nutriționale, header-uri de categorii, imagine hero (banner sus), filtre dietetice active (vegetarian, vegan, fără gluten/lactoză/nuci/zahăr, picant, halal, kosher).
- **Autentificare** — `requireLogin` (cere cont pentru acces) și `requireDate` (cere data nașterii la prima logare — util pentru bar/alcool sau evenimente cu vârstă).
- **Livrare / pickup** — `allowDelivery` / `allowPickup`: dacă portalul acceptă comenzi cu livrare și/sau ridicare personală (modulul de comenzi trebuie și el pornit).

## Cele 7 tool-uri de configurare

Toate iau `brandId` (și opțional `locationId`). Citirea merge mereu; scrierile cer modulul **Setări & Configurare** (`setari`). Fiecare `configure_portal_*` scrie DOAR câmpurile pe care le dai — restul rămân neatinse (merge server-side).

- **`get_portal_config(brandId, locationId?)`** — citește TOATĂ configurarea (tip business, culori, texte, funcționalități, afișare, QR). **Citește ÎNTÂI**, înainte de orice scriere.
- **`configure_portal_general`** — tip business, nume platformă, autentificare (requireLogin/requireDate), livrare/pickup.
- **`configure_portal_appearance`** — culori (hex), font, borderRadius, buttonStyle, cardStyle, navStyle.
- **`configure_portal_texts`** — titlu/subtitlu bun venit, butoane, texte de înregistrare.
- **`configure_portal_features`** — pornește/oprește modulele (boolean): menu, orders, reservations, qrCode, profile, attractions, games, events, gamification, loyalty, social, chat, notifications, friends, messages.
- **`configure_portal_display`** — `tabs{}` (vizibilitate tab-uri), `tabLabels{}` (etichete custom), `homeSections{}` (secțiuni home), `profileSections{}` (secțiuni profil).
- **`configure_portal_menu_config`** — showWeight, showAllergens, showDescription, showNutrition, showCategoryHeaders, menuHeroImage (URL), dietaryFilters[].

## Pagini

- **Configurare Portal** (`/portal-config`) — cardul „Configurare Platformă Clienți" deschide dialogul cu 5 tab-uri (General / Texte / Funcționalități / Aspect / QR). ⚠ Dialogul e o **modală în pagină — NU adresabilă prin `?tab=`**. De aceea modificările le faci prin MCP; pagina o deschizi doar ca să ARĂȚI userului rezultatul. Are și selector de unitate (sus dreapta) dacă brandul are mai multe locații.
- **Jocuri** (`/portal-games`) — gestionarea atracțiilor/jocurilor (liste, programe pe zile, prețuri, excepții de dată). Detaliu joc: `/portal-games/:gameId`. → vezi `jocuri-activitati.md`.
- **Atracții** (`/portal-attractions`) — vizualizarea publică a atracțiilor (ce văd clienții).
- **Misiuni & Recompense** (`/portal-missions`) — gamificarea (misiuni, insigne, XP); din MCP doar pornești modulul (`gamification: true`), configurarea fină e în pagină.
- **Portalul public** — site-ul efectiv pe care-l vede clientul (deschis din QR/link). Acolo se reflectă tot ce configurezi.

## Fluxuri pas-cu-pas

1. **Schimbi aspectul** („pune portalul pe verde, font Poppins, butoane rotunjite"): `get_portal_config` (vezi ce e acum) → `configure_portal_appearance(brandId, primaryColor:"#059669", fontFamily:"Poppins", borderRadius:"rounded")` → deschizi portalul în Chrome, screenshot, arăți userului.
2. **Pornești/oprești un modul** („activează rezervările și jocurile, oprește comenzile online"): `configure_portal_features(brandId, reservations:true, games:true, orders:false)`. Pentru ca jocurile să aibă conținut, configurează apoi atracțiile (`jocuri-activitati.md`).
3. **Schimbi textele de întâmpinare**: `configure_portal_texts(brandId, welcomeTitle:"Bun venit la noi!", exploreButton:"Vezi Meniul")`.
4. **Ascunzi/redenumești un tab** („scoate tab-ul Evenimente, redenumește Meniu în «Meniul Nostru»"): `configure_portal_display(brandId, tabs:{events:false}, tabLabels:{menu:"Meniul Nostru"})`.
5. **Configurezi meniul public** („arată alergenii și gramajul, pune filtru vegan și fără gluten"): `configure_portal_menu_config(brandId, showAllergens:true, showWeight:true, dietaryFilters:["vegan","gluten_free"])`.
6. **Setezi tipul de business + livrare** („e parc de distracții, vreau și pickup"): `configure_portal_general(brandId, businessType:"amusement_park", allowPickup:true)`.
7. **Verifici cum e configurat acum**: `get_portal_config(brandId)` — răspunzi userului ce e pornit/oprit, ce culori, ce texte.

## Întrebări frecvente

- **De ce nu apare X în aplicația clienților?** Cel mai des: modulul e oprit în Funcționalități (ex. `reservations:false`) SAU tab-ul e ascuns în Afișare (`tabs.reservations:false`). Verifică ambele cu `get_portal_config`. A doua cauză: secțiunea home e dezactivată (`homeSections`). A treia: lipsesc datele (ex. „Jocuri" pornit, dar niciun joc configurat).
- **Schimbarea nu se vede în portal.** Datele sunt corecte după ce tool-ul a întors `success`; portalul poate arăta valoarea veche până la refresh (cache browser). Confirmă cu `get_portal_config`, nu repeta scrierea — spune-i clientului să dea refresh.
- **Vreau alt aspect doar pe o locație.** Dă `locationId` la `configure_portal_*`; fără el, schimbarea e pe tot brandul.
- **Diferența dintre „oprit modul" și „ascuns tab"?** Modul oprit (`features`) = funcția nu există deloc pentru client. Tab ascuns (`display.tabs`) = funcția merge, dar nu e în meniul de navigare (poate fi accesibilă din altă parte). Pentru a ascunde complet, oprește modulul.
- **Cum pun banner-ul de sus la meniu?** `configure_portal_menu_config(menuHeroImage:"<url>")` — ai nevoie de URL-ul imaginii. Dacă n-ai URL, încarci poza din pagină (upload) și apoi iei URL-ul.
- **Cum cer cont obligatoriu / verificare vârstă?** `configure_portal_general(requireLogin:true)` și/sau `requireDate:true` (data nașterii la prima logare).

## Capcane

- **Default-uri scrise peste setări existente** — trimite la `configure_portal_*` DOAR câmpurile pe care le schimbi. Dacă trimiți un câmp gol/default pe care nu l-ai citit întâi, poți suprascrie ce era deja bun. Citește cu `get_portal_config` înainte.
- **Modul pornit fără date** — pornești „Jocuri" sau „Fidelitate" dar clientul vede gol, fiindcă nu există atracții/recompense configurate. Pornește modulul ȘI populează-l.
- **Dialogul cu 5 tab-uri nu e `?tab=`** — nu încerca să-l deschizi direct pe un tab prin URL; e o modală. Operează prin MCP, deschide pagina doar pentru screenshot.
- **Culori ca text, nu hex** — tool-ul cere hex (`#059669`), nu „verde". Tradu și confirmă cu userul.
- **Confuzie cu meniul tipărit** — „meniul public din portal" (ce afișează site-ul: alergeni/gramaj/filtre) ≠ „meniul fizic tipăribil" (PDF de printat, alt modul, skill `meniu-fizic`). Întreabă care.
- **Brand vs. locație greșit** — config pe alt `brandId` decât cel al portalului pe care-l vede clientul = „nu se schimbă nimic". Confirmă brandId cu `list_brands`.

## Tool-uri MCP utile

- **Citire (fără permisiune de modul):** `get_portal_config`, `list_portal_games`, `get_game_details`, `check_game_availability`, `get_game_slots`. Plus `gaseste_in_aplicatie` (link direct) și `jurnal_activitate` (cine a schimbat ce).
- **Scriere — modul «Setări & Configurare» (`setari`):** `configure_portal_general`, `configure_portal_appearance`, `configure_portal_texts`, `configure_portal_features`, `configure_portal_display`, `configure_portal_menu_config`, plus jocuri: `update_game_config`, `update_game_schedule`, `update_game_pricing`, `set_game_date_override`.
- **Scriere — modul «Rezervări & Clienți» (`rezervari_clienti`):** `create_game_reservation`.
- „Permisiune insuficientă" → modulul nu e bifat pe token → portal Hub → Acces AI. Catalogul complet de tool-uri + permisiuni: `tools-mcp.md`.
