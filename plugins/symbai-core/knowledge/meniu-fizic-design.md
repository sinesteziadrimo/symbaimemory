# Meniul fizic — design prin MCP (Claude ca grafician senior)

> Cum citești, înțelegi și modifici meniul fizic tipăribil (`/menu/physical`) prin conexiune. Fluxul complet + finalizarea produselor: skill-ul `meniu-fizic` + `meniu-fizic-pricing.md`. Acest fișier = grammar-ul config-ului (ce poți schimba și cum).

## Cum funcționează (mecanica reală)

Meniul fizic e un **config JSON** salvat în tabela `menu_display_configs` (un rând per meniu, `profile_type = "physical-menu-<menuId>"`, `is_default`). Tu îl manipulezi așa:

1. **Citește config-ul COMPLET**: `execute_sql_query("SELECT id, name, profile_type, config FROM menu_display_configs WHERE profile_type LIKE 'physical-menu-%'")` → alegi meniul → ai obiectul `config` (tot PhysicalMenuConfig). (Metadata și prin `list_entities("menu_display_configs")`.)
2. **Modifică JSON-ul în memorie** — schimbi câmpurile dorite (vezi harta de mai jos).
3. **Scrie ÎNAPOI config-ul ÎNTREG**: `update_menu_display_config({ configId: <id-ul din SELECT>, config: <obiectul complet modificat> })`. ⚠ **`configId` e OBLIGATORIU** = `id`-ul rândului din `menu_display_configs` (cel din SELECT-ul de la pasul 1, ex. 54 pentru „Design 3"). ⚠ **Update-ul face REPLACE, NU merge** — câmpul `config` e „configurarea completă"; dacă omiți câmpuri din el, le PIERZI. Deci mereu: citește tot → modifică → scrie tot. Permisiune: modulul **`setari`**.
4. **Uită-te la rezultat** (vision) și iterează (vezi „Bucla de vision").

`update_menu_display_config(configId, config)` acceptă config JSON complet → poți face orice modificare de design pe un meniu fizic **EXISTENT**, fără tool nou. ⚠ **Crearea unui design fizic NOU NU se face prin MCP**: `create_menu_display_config` are `profileType` restrâns la profilurile POS (`waiter_mobile`/`bar_pos`/`kiosk`/...) și NU acceptă `physical-menu-*`. Un design fizic nou se creează din aplicație (butonul „Designuri" → design nou / duplică un design existent); apoi îl editezi prin `update_menu_display_config(configId)`.

## Bucla de vision (cum vezi cum arată)

Tu (Claude extern) vezi paginile prin **extensia Chrome**: deschizi `/menu/physical` (link cu `gaseste_in_aplicatie("meniu fizic")`), faci screenshot la fiecare pagină din preview și **te uiți tu** (vederea ta multimodală) ca un grafician. Bucla: screenshot → judeci (coloane goale? pagină goală? poză prea mică/mare? dezechilibru? ordine proastă?) → editezi config prin MCP → dă refresh paginii → screenshot din nou → repetă până arată bine. (Există și un „Director Artistic" in-app cu vision — dar vederea ta proprie e mai bună pentru nuanțe.)

## Harta câmpurilor — ce schimbi și unde (grupat pe intenția de grafician)

### Structură & format
- `formatType`: `a4-individual` | `a3-booklet` (broșură pliată — engine-ul forțează AUTO multiplu de 4 pagini) | `a3-single` | `a3-landscape` (placemat 4-col). `orientation`, `columns` (global), `contentStartPage`.
- `coverPage`/`locationPage`/`bonFiscalPage` (true/false — pagini speciale), `showNutritionalEndPages`/`showAllergensEndPages`, `endPagesReversed`.

### Poze (mărime, poziție, formă)
- **Mărime poză** (cea mai folosită): per produs `photoColFrac` (0.05–1, fracțiune din lățimea coloanei — 0.4 mic, 0.7+ erou) SAU `photoWidthCustomPx`/`photoHeightCustomPx` (px expliciți), SAU presetul `photoSize` (small/medium/large). ⚠ **dacă setezi `photoWidthCustomPx`, șterge `photoColFrac`/`photoAspectNum`/`photoRole`** (altfel revin și strică aspectul). Global: `photoSizeGlobal`, `photoSizeCustomPx`.
- **Formă/aspect**: `photoAspectRatio` (square/landscape/portrait) sau `photoAspectNum` (raport w/h), `photoMaskShape` (rectangle/rounded/circle), `photoBorderRadiusPx`, `photoShadow` (none/soft/medium/strong), `photoOpacity`, `photoRotation`.
- **Poziție/crop în ramă**: `photoZoom`, `photoOffsetTop/Left` (pan în mască), `photoFrameOffsetX/Y` (mută rama în card). `photoLayout` (left/right/top/alternate) global sau per-item.
- **Schimbă poza**: `customImageUrl` per produs (URL din galerie/upload). Pe produs în catalog: `set_product_image` (vezi pricing).

### Text (fonturi, mărimi, culori)
- **Font**: global `fontFamily`/`titleFont`; per sub-element `titleFontFamily`/`descriptionFontFamily`/`priceFontFamily`/`gramajFontFamily`/`categoryTitleFontFamily` (id din cele 28 `FONT_OPTIONS`). Pe element freeform: `fontFamily`.
- **Mărime**: presete `titleSizeGlobal`/`descriptionSizeGlobal`/`gramajSizeGlobal`/`priceSizeGlobal`/`categoryTitleSizeGlobal` (small/medium/large) + `*SizeCustomPx`; per produs la fel (`titleSize`+`titleSizeCustomPx` etc.).
- **Culoare/stil**: `titleColor`/`descriptionColor`/`priceColor`/`gramajColor`/`categoryTitleColor`/`accentColor`/`textColor`/`backgroundColor`; `*LineHeight`, `*LetterSpacing`, `*Opacity`; `priceStyle`, `descriptionAlign`, `categoryTitleUnderline`.
- **Cascada de culori (paleta conduce titlurile)**: paleta = 3 culori — `backgroundColor` (Fundal), `textColor` (Text), `accentColor` (Accent). **Titlul de produs urmează `textColor`, titlul de categorie urmează `accentColor`** — DAR doar dacă NU sunt setate explicit `titleColor`/`categoryTitleColor`. Dacă o temă (look) sau un șablon a pus culori explicite pe titluri, acelea „bat" paleta și schimbarea paletei nu le mai mișcă. Ca titlurile să urmeze din nou paleta, **omite (golește) din config** `titleColor`, `categoryTitleColor`, `priceColor`, `descriptionColor`, `gramajColor` → re-derivă din Text/Accent. (În app: apăsarea unui „Template Design" sau editarea swatch-ului Text/Accent face automat această golire; reglaj individual rămâne în tab-ul „Stil".)

### Layout & umplere (coloane, span, spațiere)
- **`spanColumns`** per produs (1..N coloane) → produsul ocupă K coloane (masonry) — **arma principală contra coloanelor goale** (lățește un produs ca să umple golul). Pozele+fonturile se scalează automat.
- **Spațiere**: `itemSpacing` (compact/normal/relaxed/custom) + `itemSpacingCustomPx`, `categorySpacingPx`, `descriptionGapPx`, `photoTextGapPx`, `nameToPriceGapPx`.
- **Per pagină** (`pageOverrides[absIdx]`, 0-based): `columns`, `rearrangeMode` (auto/liber), `backgroundType`/`backgroundImageUrl`, `freeformElements[]`.

### Mutare & ordine produse/pagini
- **Ordine produse** (cel mai sigur): per produs `sortOrder` în `categories[].items[]` (și/sau prin `update_menu_item(sortOrder)` la nivel de date). Reordonezi produsele în categorie — engine-ul le repaginează.
- **Mută produse între pagini**: `pageAssignments` = array de chunk-uri (1 chunk = 1 pagină). ⚠ **Poate fi `null`** — atunci engine-ul distribuie produsele AUTOMAT (estimator). Dacă-l scrii, **FIXEZI** distribuția manual și TREBUIE să conțină consistent toate produsele vizibile (altfel dispar produse). La nevoie de control fin al mutării între pagini, e mai sigur prin designer (drag) sau lași `pageAssignments=null` (auto) + influențezi cu `spanColumns`/`sortOrder`. ⚠ NU folosi câmpul legacy `pages` (vestigial, nu se randează pe calea curentă).
- **Pagini fixe inserate**: `pinnedPages[poz1based]` (cover spate, QR etc.).

### Fundal & rame
- `backgroundType` (solid/gradient/image/split) + `backgroundColor`/`backgroundGradientColor2`/`backgroundImageUrl`/`backgroundImageOpacity`/`backgroundSplitColor2`. Per-pagină via `pageOverrides[idx].backgroundType/backgroundImageUrl`.
- `pageBorderEnabled`/`pageBorderColor`/`pageBorderWidth`/`pageBorderStyle`/`pageBorderImageUrl` (rama colorată groasă = semnătura Design 2); `coverBorder*`.

### Elemente libere (adaugă poze/text/forme/evidențieri)
- `freeformElements[]` global SAU `pageOverrides[idx].freeformElements[]`: fiecare = `{ type: text|image|separator|shape, x, y, width, height, fontFamily?, content?, imageUrl?, z, rotation, scaleX/Y }`. ⚠ Coordonatele sunt în **px LOGICE = mm × PAGE_SCALE (2.8)**. Cu astea inserezi poze decorative, casete de text, separatoare, forme, evidențieri pe orice pagină.
- **Evidențiere produs** (featured): per produs `featuredStyle` + `featuredAccentColor`/`featuredBorderWidthPx`/`featuredGlowIntensity`/`featuredCornerRadius`/`featuredBadgeText`/`featuredBgOpacity` — scoate în evidență un produs (chenar/glow/badge).

### Cover & QR
- `coverTitle`/`coverSubtitle`/`coverImageUrl`/`coverImageFullBleed`/`coverImageFit`/`coverImageZoom`/`coverImageOffsetX/Y`/`coverLogoZoom`/`coverTitleFontScale`...
- `showQrCode`/`qrCodeDynamicCode`/`qrCodeSizeMm`/`qrCodePosition`/`qrCodeFgColor`/`qrCodeBgColor`/`qrCodeCaption`.

## Teme — aplică-le în app, fine-tuning prin MCP

Sunt **13 teme** (`bistro-navy` = cea mai bună, ADN-ul „Design 2": navy+crem, Nunito, 2-col, poze mari dreapta, ramă pal groasă; restul: fine-dining text-only, steakhouse, patisserie card, editorial 4-col A3-landscape...).

⚠ **Aplicarea unei teme NU se reproduce scriind doar config-ul.** `applyTheme` rulează ENGINE-SIDE în designer: selecția eroilor (seed determinist), decorul per-pagină, repaginarea. Deci:
1. **Schimbarea temei** se face ÎN designer — userul apasă tema, SAU tu prin Chrome apeși „Aplică tema". Arată-i userului 2-3 teme și întreabă-l care-i place (vision: screenshot fiecare).
2. **DUPĂ ce tema e aplicată**, citești config-ul rezultat și faci tot fine-tuning-ul prin MCP (poze, fonturi, fundal, mutări, umplere, freeform, featured — tot ce e mai sus).

Scrierea `activeThemeId` în config = semnal că tema se re-aplică la load, dar nu reproduce gramatica — nu te baza pe ea pentru „look-ul" temei; aplică tema în app.

## Pagini/coloane goale — cum le umpli

> **Linia roșie „nu se tipărește" (conținut care nu încape)**: în editor, ce nu încape pe o pagină NU mai e ascuns — rămâne vizibil sub o linie roșie punctată care marchează marginea de tipărire. La vision: orice e SUB acea linie **nu intră în PDF/print** → trebuie urcat sau redistribuit (mai puține produse pe pagină, poze mai mici, `itemSpacing` compact, `pageAssignments`, sau butonul „Recalculează și optimizează" în app — care repară orice pagină supra-plină, indiferent unde ești derulat). Pagina supra-plină arată și un procent > 100% („% umplut").

Pagina cu fill < ~30% = goală. Pârghii (prin config):
- `spanColumns` 1→2+ pe un produs (umple coloana goală lățindu-l).
- `photoColFrac`/`photoWidthCustomPx` mai mare (poze mai mari ocupă spațiu) sau mai mic (încap mai multe).
- mută produse între pagini cu `pageAssignments` (reechilibrezi).
- `itemSpacing` relaxed (întinde) / compact (strânge).
- inserezi o pagină sau un element freeform decorativ.
- Gol mic (10–20%) e NORMAL (whitespace intenționat) — nu-l forța.

## Multiplu de 4 (A3 broșură)

La `formatType: "a3-booklet"`, engine-ul **forțează automat** `totalPages % 4 === 0` (adaugă pagini goale la final post-paginare). Tu NU scrii `pages.length`; setezi formatul și lași engine-ul. Ștergerea unei pagini re-pad-ează automat. `a4-individual` și `a3-landscape` n-au constrângerea.

## Bucla „grafician senior" (per pagină, cu vision)

Pentru fiecare pagină: screenshot (Chrome) → întreabă-te ca un grafician: *coloane/pagini goale? poze prea mici sau prea mari? echilibru stânga-dreapta? ordinea logică (best-sellers sus)? un produs-erou pe pagină? text înghesuit?* → aplică 1-3 schimbări în config (resize poze, span, mută, freeform, spacing, featured) → scrie config → refresh → screenshot → repetă până e curat. Confirmă cu userul deciziile estetice mari; explică-i pe scurt CE ai schimbat și DE CE.

## Gotchas (durabile)

- **READ-MODIFY-WRITE ÎNTREG**: `update_menu_display_config` face REPLACE. Citește tot config-ul, modifică, scrie tot. Nu trimite un config parțial.
- **`productId` în config = `menu_items.id`** (NU products.id). Vânzările/galeria folosesc products.id — nu le încrucișa.
- **`photoWidthCustomPx` și `photoColFrac` se exclud** — la setarea uneia, șterge cealaltă (+`photoAspectNum`/`photoRole`).
- **Freeform = px logice (mm×2.8)** — nu pune px de ecran.
- **Tema = engine-side** (eroi/decor/paginare) — aplică în app, nu o reproduce din config.
- **Verifică prin re-citire + vision**, nu presupune. UI-ul are cache → refresh.
- Cu userul: limbaj de restaurant („fac poza mai mare", „mut produsul sus", „umplu pagina"), nu „photoColFrac/freeformElements".
