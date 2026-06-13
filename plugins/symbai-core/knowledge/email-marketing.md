# Email Marketing

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare.

## Pe scurt

Modulul de email marketing acoperă tot ce ține de comunicarea prin email cu clienții: creezi campanii (un email simplu sau o secvență automată de tip „flux"), alegi și personalizezi șabloane, ții cont de cui trimiți (segmente de clienți activi, etichetați, loiali), trimiți prin serverul tău de email (SMTP) configurat per brand sau prin cel gestionat de Symbai, și urmărești rezultatele (deschideri, click-uri, respingeri, dezabonări). Sistemul respectă automat consimțămintele GDPR pe canalul email — clienții care s-au dezabonat sunt săriți. E făcut pentru proprietar/manager care vrea să anunțe oferte, să întâmpine clienții noi sau să recâștige clienții inactivi, fără să atingă nimic tehnic.

## Concepte

- **Campanie email** — o comunicare către un grup de clienți. Stări: **Ciornă** (în lucru, netrimisă), **Programată** (pleacă la o dată/oră viitoare), **Activă** (în curs de trimitere), **Trimisă** (gata, cu statistici finale). Poate fi **simplă** (un singur email) sau **flux** (secvență vizuală de pași: trimite email, așteaptă N zile, verifică dacă a dat click, ramifică).
- **Șablon email** — structura emailului (text, imagini, butoane) cu locuri de personalizare (prenume, nivel loialitate, cod reducere) pe care o refolosești la mai multe campanii. Designer vizual cu previzualizare pe desktop și telefon.
- **Segment / audiență** — grupul care primește campania, definit prin filtre (etichetă, brand, status loialitate, data ultimei achiziții) sau prin excluderi (dezabonați). Sistemul îți spune din timp câți clienți se potrivesc.
- **SMTP per brand** — serverul de email al brandului (gazdă, port, utilizator, parolă) plus identitatea de expeditor (numele și adresa de la care pleacă, ex. `marketing@brand.ro`). Un brand poate avea mai multe SMTP-uri sau poate folosi serverul gestionat de Symbai.
- **Ratele importante** — **Livrare**: cât % a ajuns la destinatar; **Deschidere** (open rate): cât % au deschis; **Click** (CTR): cât % au dat click pe un link; **CTOR**: din cei care au deschis, cât % au dat click; **Bounce** (respingere): hard = adresă invalidă permanent (ex. typo în domeniu), soft = temporar (inbox plin); **Dezabonare**: clienți care nu mai vor email; **Plângere/spam**: clienți care au marcat emailul ca spam.
- **Secvență automată (drip)** — un flux care trimite mai multe emailuri în timp: de ex. email de bun venit la înscriere, apoi +2 zile altul, apoi dacă nu a dat click o variantă de re-angajare.
- **Test A/B** — creezi 2 variante (subiect/conținut/buton diferit), le trimiți la câte jumătate din audiență, iar varianta cu rezultate mai bune poate pleca la restul.
- **Personalizare dinamică** — câmpuri care se înlocuiesc automat cu datele reale ale fiecărui client (prenume, nivel loialitate, data ultimei comenzi).
- **Link de dezabonare** — obligatoriu prin lege; Symbai îl adaugă automat în fiecare email.

## Pagini

- **Campanii Email** (`/email-campaigns`) — lista campaniilor pe status (Ciorne, Programate, Active, Trimise) + wizard de creare în pași: Configurare → Selectează Șablon → Audiență → Revizuire & Trimitere. Campaniile de tip flux au tab-uri Flux (constructor vizual), Config și Statistici.
- **Șabloane Email** (`/email-templates`) — galerie de șabloane gata făcute + editor vizual (text, imagine, buton, separator, coloane), previzualizare desktop/telefon și gestionare variante pentru testele A/B.
- **Configurare Email (SMTP)** (`/email-setup`) — starea trimiterii per brand: e configurat SMTP-ul?, ce identități de expeditor există, secretul de dezabonare, webhooks externi. Aici testezi conexiunea și trimiți un email de test.
- **Statistici Email** (`/email-analytics`) — dashboard cu sub-tab-uri: **Prezentare** (rate globale + trend), **Campanii** (per campanie), **Automatizări** (pentru fluxuri) și **Bounce & Dezabonări** (top domenii care resping, evoluția dezabonărilor).
- **Loguri Email** (`/email-logs`) — evidența fiecărei trimiteri per destinatar: status (trimis/livrat/respins/plângere), motivul respingerii, căutare după adresă sau campanie.
- **Revizuire Email-uri** (`/email-review`) — coada de revizuire și aprobare a campaniilor înainte de trimitere: verifici conținutul, audiența și expeditorul, apoi aprobi sau respingi plecarea.

## Fluxuri pas-cu-pas

1. **Trimiți o campanie simplă** — verifici contextul (`list_brands` pentru brandId), confirmi că SMTP-ul e configurat în `/email-setup`, vezi cât de mare e audiența cu `preview_email_audience` (dry-run, NU trimite) sau `get_customer_email_segments` (câți clienți pe etichetă/sursă). Pregătești șablonul în `/email-templates` (sau cu `create_email_template`), apoi faci campania: din aplicație în `/email-campaigns` (Campanie Nouă: Configurare → Selectează Șablon → Audiență → Revizuire & Trimitere) SAU prin MCP — `create_email_campaign` (o creează ca DRAFT, NU trimite), `update_email_campaign` pentru subiect/conținut/audiență, `send_test_email_campaign` la o adresă a ta pentru probă, și abia la final `send_email_campaign` care trimite efectiv prin SMTP (acțiune externă, ireversibilă — cere confirmare explicită). Cel mai simplu e workflow-ul ghidat `trimite_campanie_email` (draft → preview audiență → confirmare → trimitere). Urmărești rezultatele cu `get_email_campaign_analytics` (campaignId) sau pe tot brandul cu `get_email_analytics_overview`.
2. **Configurezi o secvență automată (drip)** — în `/email-campaigns` alegi tipul **Flux** și construiești vizual: Start → Trimite Email → Așteaptă (N zile) → Condiție (a dat click?) → Ramificare (DA: alt email; NU: variantă de re-angajare) → End. Setezi declanșatorul (client nou, inactiv N zile etc.), opțional un test A/B pe un nod, apoi apeși **Activare Flux** (sau prin MCP: `create_email_sequence` creează secvența ca DRAFT, `activate_email_flow` o pornește — ireversibil, cere confirmare; `enroll_customers_in_email_sequence` înscrie clienți în drip-ul real, tot cu confirmare). Vezi cum merge cu `list_email_sequences` și în tab-ul Statistici al fluxului.
3. **Segmentezi și verifici audiența înainte de trimitere** — citești segmentele existente cu `get_customer_email_segments` (brandId), apoi calculezi „câți ar primi" cu `preview_email_audience`. Pentru un client anume verifici dacă ai voie să-l contactezi cu `check_marketing_allowed` (customerId, canal email); detaliile de consimțământ sunt în `list_gdpr_consent_log`. Dezabonații sunt excluși automat la trimitere.
4. **Faci un test A/B** — creezi 2 șabloane diferite în `/email-templates` (alt subiect/conținut/buton), apoi la pasul Șablon din `/email-campaigns` bifezi testul A/B (50%/50%); poți lăsa sistemul să trimită varianta câștigătoare la restul audienței. Compari rezultatele cu `get_email_campaign_analytics` și defalcarea pe `get_email_analytics_breakdowns` (campaignId — pe device/client de email/țară + top link-uri).
5. **Cureți baza și aprobi înainte de o campanie mare** — pentru duplicate de clienți folosești `find_duplicate_guests` + `merge_guests` (din zona de clienți); ca să nu mai trimiți la cineva, îl adaugi pe lista de suprimare cu `add_email_suppression` (nu va mai primi email de marketing). Înainte ca o campanie să plece, treci prin `/email-review` (revizuiești conținutul + audiența și aprobi). Apoi lansezi campania pe o bază curată.
6. **Configurezi SMTP-ul propriu** — pregătești credențialele de la furnizorul tău (host, port 587/465, utilizator, parolă), le adaugi în `/email-setup` cu identitatea de expeditor (nume + adresă oficială), testezi cu butonul de test și o setezi ca implicită pentru brand (va apărea în dropdown-ul „Expeditor" la creare campanie).
7. **Investighezi respingeri (bounce)** — `list_email_logs` filtrat pe respinse îți arată adresa, motivul (hard/soft) și campania. Hard bounce = adresă invalidă permanent (o cureți din bază); soft bounce = temporar (se reîncearcă automat). Tendințele le vezi în `/email-analytics` → Bounce & Dezabonări. Pentru a crește livrarea, adaugi în DNS-ul domeniului recordurile SPF/DKIM/DMARC date de furnizorul SMTP.

## Tool-uri MCP utile

- Citire: `list_email_campaigns`, `list_email_sequences`, `list_email_templates`, `list_email_logs`, `get_email_campaign_analytics`, `get_email_analytics_overview`, `get_email_analytics_breakdowns`, `preview_email_audience` (dry-run, NU trimite), `get_customer_email_segments`, plus pentru context `list_brands` și pentru GDPR `check_marketing_allowed` / `list_gdpr_consent_log`.
- Scriere (modulul „Comunicare" bifat pe token): `create_email_campaign` (creează DRAFT, NU trimite), `update_email_campaign` (editezi draft/programată), `create_email_template`, `create_email_sequence`, `add_email_suppression` (oprești trimiterea către o adresă). Aceleași lucruri se pot face și din aplicație în `/email-campaigns` / `/email-templates`.
- Trimitere reală (externă, ireversibilă — cere `confirm: true` și acordul tău explicit): `send_test_email_campaign` (probă la o adresă), `send_email_campaign` (trimite campania prin SMTP la destinatari), `activate_email_flow` (pornește un flux drip), `enroll_customers_in_email_sequence` (înscrie clienți în drip). Cel mai sigur e workflow-ul ghidat `trimite_campanie_email` (draft → preview → confirmare → trimitere).
- Pentru întrebări punctuale pe baza de date poți folosi și `execute_sql_query` (read-only).
- Permisiunea exactă pe fiecare tool: vezi `tools-mcp.md`.

## Întrebări frecvente

- **De ce nu primește un client emailul?** Cel mai des: s-a dezabonat (global sau pe canalul email), adresa lui a respins în trecut (hard bounce), sau nu se încadrează în filtrele segmentului. Verifici consimțământul cu `check_marketing_allowed` și statusul trimiterii în `/email-logs`.
- **Cum trimit la o oră anume?** La pasul Revizuire & Trimitere bifezi „Programează" și alegi data + ora; emailurile pleacă atunci, în fusul orar al locației.
- **Pot modifica o campanie după ce am trimis-o?** Nu — o campanie trimisă e finalizată, cu statistici blocate. Dacă ai greșit, faci una nouă (eventual cu subiect „[RETRY]") pe segmentul potrivit.
- **De ce am rate de deschidere mici?** De obicei subiectul e prea generic sau emailul ajunge în spam. Reține și că rata de deschidere e orientativă (depinde de pixelul de tracking, pe care unii clienți de email îl blochează).
- **Cum verific că SMTP-ul merge?** În `/email-setup` apeși „Trimite Email de Test" către o adresă a ta și verifici dacă ajunge.
- **Ce e soft bounce vs hard bounce?** Soft = problemă temporară (inbox plin, server picat scurt), se reîncearcă automat. Hard = adresă invalidă permanent (domeniu greșit), nu se reîncearcă — o cureți.
- **Cum calculez randamentul (ROI) unei campanii?** Ai nevoie de urmărirea click → comandă (pixel/UTM în magazinul online); apoi compari veniturile cu costul. Pentru atribuire pe canale folosești `get_attribution_report`.
- **Pot exclude un client din viitoarele campanii fără să-l dezabonez?** Îi pui o etichetă „Nu trimite email" și setezi segmentele să excludă eticheta, sau îl adaugi direct pe lista de suprimare (`add_email_suppression`). Alternativ, clientul se dezabonează singur din linkul din email.

## Capcane

- **SMTP greșit configurat — emailurile nu pleacă.** Semn: campania e „Activă" dar zero „Trimis" după o oră. Mergi la `/email-setup`, testezi conexiunea, verifici credențialele și portul (587 cu TLS sau 465 cu SSL); dacă tot nu merge, contactezi furnizorul SMTP.
- **Adrese duplicate în segment.** Sistemul zice „1000 clienți" dar adresele unice sunt mai puține. Înainte de campanie, unifică clienții cu `find_duplicate_guests` + `merge_guests` și verifici audiența reală cu `preview_email_audience` (dry-run).
- **Rată de respingere mare (peste 5%).** De obicei din adrese colectate fără validare sau spam traps. Identifici domeniile problematice în `/email-analytics` → Bounce & Dezabonări și în `list_email_logs` (filtrat pe respinse), pui adresele invalide pe lista de suprimare cu `add_email_suppression`, și pentru viitor ceri confirmare la înscriere (double opt-in).
- **Nu vezi pe ce link a dat clientul click.** `get_email_campaign_analytics` arată numărul de click-uri, dar pentru detaliu (ce link) folosești `get_email_analytics_breakdowns` (campaignId) — secțiunea „Top link-uri".
- **A plecat email la cineva care se dezabonase.** Apare la decalaj de sincronizare. Pune adresa pe lista de suprimare (`add_email_suppression`) ca să nu mai primească nimic; la viitoarele campanii verificarea consimțământului se face automat înainte de trimitere.
- **Linkul de dezabonare dă eroare.** Linkul e generat automat de Symbai; dacă dă 404, verifică setarea de domeniu custom în `/email-setup` și contactează suportul.
- **Fluxul e „Activ" dar nu trimite.** De obicei fluxul nu e salvat complet, declanșatorul nu e setat sau condiția nu se poate îndeplini. Mergi la fluxul respectiv → tab Config și verifici declanșatorul și condițiile.
- **Statisticile fluxului apar goale.** Fluxul e prea nou — statisticile se populează după ce primii clienți trec prin el. Așteaptă.

## Vezi și

- **Marketing & social media** (postări, reclame, atribuire) → `marketing-social.md`
- **GDPR & date clienți** (dezabonări, consimțăminte, anonimizare) → `gdpr-clienti-oaspeti.md`
- **Loialitate & fidelizare** (puncte, niveluri, recompense — surse de personalizare) → `loialitate-fidelizare.md`
- **Comunicare WhatsApp & SMS** (alte canale de comunicare cu clientul) → `comunicare-whatsapp.md`
