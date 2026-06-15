---
name: gestioneaza-comunicare
description: Gestionează comunicarea cu clienții și echipa — campanii și șabloane de email, secvențe automate (drip), audiență, statistici email, conversații WhatsApp / Messenger / Instagram, notificări push și linkuri de conectare — hands-free prin conexiune (MCP) + Chrome. Folosește la „trimite o campanie de email", „fă o newsletter", „câți clienți primesc emailul", „cum a mers campania X", „de ce nu deschide nimeni emailurile", „cine mi-a scris pe WhatsApp", „răspunde-i clientului de pe WhatsApp/Instagram", „ce conversații am deschise", „trimite un WhatsApp lui X", „dezabonează adresa Y", „de pe ce adresă plec emailurile", „notifică personalul", „trimite-i un link de conectare clientului". Confirmă MEREU înainte de orice trimitere reală.
---

# Gestionează comunicarea — email + WhatsApp + conversații, prin MCP + Chrome

Userul (proprietar/manager) vrea să comunice cu clienții sau cu echipa: să trimită o campanie de email, să vadă cum merg emailurile, să răspundă la mesaje de pe WhatsApp/Messenger/Instagram, să dezaboneze pe cineva, să notifice personalul. Tu faci munca **prin conexiune (tool-uri MCP)** — citești, pregătești draft-uri, previzualizezi audiența, tragi statistici — și folosești **Chrome doar ca să NAVIGHEZI și să-i ARĂȚI** rezultatul. **Regula de aur a acestui modul: orice TRIMITERE REALĂ (email în masă, WhatsApp, push, link de login) se face DOAR după ce ai confirmat explicit cu userul** — tool-urile cer `confirm: true`, dar confirmarea adevărată o ceri tu, în cuvinte, de la user.

## Înainte de orice
1. Citește **`knowledge/email-marketing.md`** (cum funcționează campaniile, șabloanele, secvențele, audiența, ce înseamnă ratele) și **`knowledge/comunicare-whatsapp.md`** (inbox unificat, fereastra de 24h WhatsApp, consimțământ de marketing). Pentru postări/reclame (≠ conversații 1-la-1) → `knowledge/marketing-social.md` + skill-ul `programeaza-postare`. Pentru cum conduci Chrome (deep-link, screenshot = livrabil, click doar la nevoie) → **`knowledge/condu-chrome.md`** — nu repet aici, o presupun.
2. **Context întâi**: `list_brands` (+ `list_locations` la nevoie) → afli `brandId`. Aproape toate tool-urile de comunicare cer `brandId` când ai mai multe branduri. Verifică și de pe ce identitate pleci: **`comms_get_status`** (ce adresă de email + ce cont WhatsApp e activ) și **`list_whatsapp_accounts`** înainte de orice WhatsApp.
3. **Navigare prin deep-link stabil** (nu click prin meniu): `/email-campaigns` (campanii + wizard Configurare→Șablon→Audiență→Revizuire), `/email-templates` (șabloane), `/email-analytics` (statistici), `/email-logs` (trimiteri individuale), `/email-review` (curățare adrese înainte de campanii mari), `/whatsapp-inbox` (conversații WhatsApp), `/social-messages` (inbox unificat DM/comentarii sociale). Ruta exactă a oricărei pagini → `gaseste_in_aplicatie("termen scurt")` (ex. „campanii email", „inbox whatsapp"). **Nu inventa URL-uri.**

## Intent → tool (cheat table)

| Userul cere… | Tool MCP | Note |
|---|---|---|
| „ce campanii am / draft / trimise" | `list_email_campaigns` | filtru `status` (draft/scheduled/sent/active) |
| „cum a mers campania X" | `get_email_campaign_analytics` | livrare, deschideri reale, click, CTOR, bounce, dezabonări |
| „cum stau cu emailul în general" | `get_email_analytics_overview` | rate pe tot brandul |
| „de pe ce dispozitive deschid / ce link s-a apăsat" | `get_email_analytics_breakdowns` | device/client email/țară + top link-uri + funnel |
| „a ajuns emailul la X / de ce bounce" | `list_email_logs` | per destinatar; `search` pe adresă |
| „ce șabloane am" | `list_email_templates` | înainte de a face o campanie pe șablon |
| „ce automatizări (drip) am" | `list_email_sequences` | secvențe + câți înscriși |
| „câți clienți cu eticheta VIP" | `get_customer_email_segments` | numără clienți activi + tag-uri |
| **„câți primesc emailul ăsta"** | **`preview_email_audience`** | **dry-run OBLIGATORIU înainte de send — NU trimite** |
| „fă o campanie / newsletter" | `create_email_campaign` | creează **DRAFT**, nu trimite |
| „schimbă subiectul/conținutul campaniei" | `update_email_campaign` | doar draft/programată |
| „fă un șablon" | `create_email_template` | reutilizabil |
| „fă o secvență automată" | `create_email_sequence` | DRAFT inactiv |
| **„trimite campania"** | **`send_email_campaign`** (`confirm:true`) | **IREVERSIBIL — confirm-first** |
| **„pornește fluxul drip"** | **`activate_email_flow`** (`confirm:true`) | trimiteri automate reale |
| **„înscrie clienții în secvență"** | **`enroll_customers_in_email_sequence`** (`confirm:true`) | drip real către ei |
| „trimite-mi un test la adresa mea" | `send_test_email_campaign` | o singură adresă — sigur |
| „nu-i mai trimite lui X / dezabonează Y" | `add_email_suppression` | îl scoate de pe listă (GDPR) |
| „cine mi-a scris / ce conversații am" | `list_conversations` | WhatsApp/Messenger/Instagram + necitite |
| „arată-mi firul cu clientul" | `get_conversation_messages` | citește ÎNAINTE de a răspunde |
| **„răspunde-i clientului"** | **`reply_to_conversation`** (`confirm:true`) | pe canalul nativ — confirm textul |
| **„trimite un WhatsApp lui X"** | **`send_whatsapp_message`** (`confirm:true`) | număr internațional (40712…) |
| **„trimite-i o poză/PDF pe WhatsApp"** | **`send_whatsapp_media`** (`confirm:true`) | `mediaUrl` public, `mediaType` |
| **„notifică personalul / un angajat"** | **`push_notify_staff`** (`confirm:true`) | `employeeIds` sau tot brandul |
| **„notifică clienții (push)"** | **`push_notify_customers`** (`confirm:true`) | `portalUserIds` |
| „trimite-i clientului un link de conectare" | `send_magic_login_link` (`confirm:true`) | login fără parolă, valabil 24h |

Citirile (`list_*`/`get_*`/`preview_*`/`comms_get_status`) merg mereu. Scrierile-draft și trimiterile cer modulul **Comunicare** bifat pe token.

## Fluxul (rețete)

**A — „Vezi campaniile / cum merge emailul" (citire pură).** `list_email_campaigns` (sau `get_email_analytics_overview` pentru ansamblu) → spune-i userului în limbaj de business („3 campanii trimise, rată de deschidere 28%, cea mai bună a fost «Oferta de toamnă»"). Vrea detaliu pe una → `get_email_campaign_analytics(campaignId)` + `get_email_analytics_breakdowns` (de pe ce telefoane deschid, ce link au apăsat). Ca să-i ARĂȚI: `navigate("/email-analytics")` + screenshot.

**B — „Trimite o campanie de email" (draft → preview → CONFIRMĂ → send).** Flux în 4 pași, niciodată sărit:
1. **Draft**: `create_email_campaign({ brandId, name, subject, fromName, htmlContent | templateId, audienceType, audienceConfig })`. Dacă vrea pe un șablon → întâi `list_email_templates`. Nu inventa conținut de marketing — confirmă textul cu userul sau pornește de la un șablon.
2. **Preview audiență (OBLIGATORIU)**: `preview_email_audience({ brandId, audienceType, audienceConfig })` → îți dă **numărul exact** de destinatari + defalcare (clienți/portal/staff/B2B) + un eșantion. NU s-a trimis nimic.
3. **CONFIRMĂ cu userul**: „Trimit «Oferta de toamnă» către **412 clienți**. Confirmi?" — așteaptă „da" în cuvinte. (Trimite-i întâi `send_test_email_campaign` la adresa lui dacă vrea să vadă cum arată în inbox.)
4. **Send**: `send_email_campaign({ campaignId, confirm: true })`. Ireversibil. Respectă plafonul de destinatari din Hub (dacă-l depășește, tool-ul refuză — spune-i userului să mărească plafonul din Hub → Acces AI). Apoi raportează ce-a întors tool-ul (câți trimiși).

Pentru un **flux drip**: `create_email_sequence` (draft) → activarea pasului automat = `activate_email_flow(confirm)` (campanie de tip flux) sau înscrierea manuală a clienților = `enroll_customers_in_email_sequence(confirm)` — ambele confirm-first.

**C — „Cine mi-a scris / răspunde-i clientului" (WhatsApp/Messenger/Instagram).** `list_conversations({ brandId, status:"open" })` → vezi cine a scris + câte necitite. Pentru fir: `get_conversation_messages(conversationId)` (citește contextul ÎNTÂI). Propune userului un text de răspuns, **confirmă-l**, apoi `reply_to_conversation({ conversationId, message, confirm:true })` — pleacă pe canalul nativ al conversației. Ca să-i arăți inbox-ul: `navigate("/whatsapp-inbox")` (WhatsApp) sau `/social-messages` (DM/comentarii sociale) + screenshot.
⚠ **WhatsApp inițiat de tine**: în afara ferestrei de 24h de la ultimul mesaj al clientului ai nevoie de șablon pre-aprobat, iar mesajele de marketing cer consimțământ (vezi `comunicare-whatsapp.md`). Pentru un mesaj nou către un număr: `send_whatsapp_message({ to:"40712…", message, confirm:true })` — confirmă numărul ȘI textul.

**D — „Dezabonează / nu-i mai trimite lui X".** `add_email_suppression({ email, reason })` — îl scoate efectiv de pe lista de trimiteri (GDPR, pozitiv). Confirmă adresa cu userul.

**E — „Notifică personalul / clienții".** `push_notify_staff({ title, body, employeeIds | brandId, confirm:true })` (un angajat anume sau tot brandul) / `push_notify_customers({ title, body, portalUserIds, confirm:true })`. Push real pe telefoane — confirm-first + plafon Hub. Pentru onboarding-ul unui client în portal: `send_magic_login_link({ email, confirm:true })`.

## Câteva cazuri care chiar cer un click în Chrome
Aproape tot e prin MCP. Click (pe ELEMENT, nu pe pixel — vezi `condu-chrome.md`) doar la:
- **designul vizual al unui email/șablon** (editorul de blocuri din `/email-templates`) — prin MCP pui `htmlContent`/`designJson`, dar aranjarea fină vizuală o face userul sau o vezi/ajustezi în pagină;
- **activarea unei secvențe drip ca «activă»** și **constructorul vizual de flux** (tab-urile Flux/Config din campaniile de tip flux) — MCP creează draft-ul, dar comutatorul „activă" și fluxul vizual sunt în pagină;
- **conectarea numărului de WhatsApp Business / a paginilor sociale** — aprobarea OAuth se face în browserul userului (vezi skill-ul `conecteaza-meta`);
- **răspuns pe un canal pe care tool-ul nu-l acoperă** (conversație fără brand/canal asociat) — atunci ghidează-l să răspundă din inbox.

## Reguli (cele care contează)
- **Confirm-first la ORICE trimitere reală.** `preview_email_audience` întâi → arată numărul → cere „da" în cuvinte → abia apoi `confirm:true`. Nu seta `confirm:true` din proprie inițiativă, niciodată la trimiteri în masă. Trimiterile sunt **ireversibile** și pot costa (WhatsApp).
- **Draft ≠ send.** `create_email_campaign` doar pregătește; nimic nu pleacă până la `send_email_campaign(confirm)`. Spune-i clar userului în ce stare e („am pregătit ciorna, n-am trimis nimic").
- **Plafonul de destinatari** (din Hub) se aplică la campanii/flux/push/secvențe. Dacă tool-ul refuză pe plafon, nu insista — explică-i userului și trimite-l la Hub → Acces AI să-l mărească.
- **Citește firul înainte de a răspunde** (`get_conversation_messages`) — nu răspunde pe orb într-o conversație.
- **Confirmă-prin-citire, nu prin ecran**: tool-ul a întors `success` = e făcut (campania a plecat / mesajul s-a trimis). Verifică cu `list_*`/`get_*`, nu repeta trimiterea pe baza unei poze. Screenshot-ul e ca să-i ARĂȚI userului, citirea ca să VERIFICI tu.
- **Nu inventa** conținut de marketing, adrese, numere sau testimoniale. Ce lipsește → întrebi userul sau pornești de la un șablon existent.
- **Permisiune**: modulul **Comunicare** pe token pentru draft-uri + trimiteri. „Permisiune insuficientă" → Hub → Acces AI.
- **Limbaj de business** cu userul („câți clienți primesc", „rată de deschidere", „i-am răspuns pe WhatsApp"), nu jargon (`audienceConfig`, `ctor`, `suppression`).

## Legături
- Concepte email (campanii, șabloane, secvențe, audiență, rate) → `knowledge/email-marketing.md`; conversații + WhatsApp (inbox unificat, fereastra 24h, consimțământ) → `knowledge/comunicare-whatsapp.md`.
- Postări programate & reclame (≠ conversații 1-la-1) → `knowledge/marketing-social.md` + skill-ul `programeaza-postare`; reclame plătite → skill-ul `gestioneaza-reclame`.
- Conectarea WhatsApp Business / paginilor sociale (OAuth) → skill-ul `conecteaza-meta`.
- Cum conduci Chrome (deep-link, screenshot = livrabil, click pe element, fallback fără extensie) → `knowledge/condu-chrome.md`.
- Segmentarea clienților pe etichete pentru audiență → `knowledge/segmentare-clienti.md` + skill-ul `gestioneaza-etichete`.
- Blocaj (ceva ce nu se poate prin conexiune) → `trimite_ticket_symbai` (sugestie) + ghidează în aplicație.
