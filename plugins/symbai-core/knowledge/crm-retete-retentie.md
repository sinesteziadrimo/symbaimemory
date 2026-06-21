# CRM — Rețete De Retenție (Copy-Ready)

> Pentru linkul exact catre orice pagina foloseste tool-ul `gaseste_in_aplicatie`. Pentru segmentare detaliata vezi `knowledge/segmentare-clienti.md`, pentru economia punctelor `knowledge/loialitate-fidelizare.md`, pentru consimtamant `knowledge/gdpr-clienti-oaspeti.md`.

## Pe scurt

Retentia aduce de ~3,3x mai mult profit decat achizitia de clienti noi, iar fluxurile automate (welcome, win-back, aniversare, cos abandonat) genereaza 50-60% din veniturile de email din doar ~5% din trimiteri. Acest fisier iti da 8 retete gata de aplicat — fiecare cu CUI (segment RFM), CANAL, CAND, MESAJ, OFERTA, TOOL MCP si CUM VERIFICI. Regula de aur care leaga toate retetele: pastreaza un **holdout de 10%** (un grup de clienti pe care NU-l contactezi), ca sa dovedesti liftul real in lei, nu doar "am trimis 5000 de mesaje".

Lucram MCP-first: citim datele reale ([citire]), construim segmentul, aratam patronului exact ce se trimite si confirmam in cuvinte inainte de orice trimitere reala ([marketing], `confirm:true`).

## Concepte

- **RFM in 8-12 segmente, recalculate LUNAR** — `recompute_loyalty_rfm` transforma cele 125 de combinatii in segmente cu nume: Campioni, Loiali, Potentiali, Noi, Promitatori, Au nevoie de atentie, Adorm, La risc, Nu-i pierde, Hibernare, Pierduti. RFM disciplinat ridica retentia cu 15-30% in cateva saptamani.
- **Holdout 10% = adevarul** — lasa 10% control necontactat pe fluxurile de retentie; ai nevoie de min. ~200 conversii in grupul de control pentru semnificatie; ruleaza 1-4 saptamani. Compari conversia/cheltuiala grup expus vs control. 52% dintre marketeri folosesc deja teste de incrementalitate.
- **Welcome = cel mai mare open** — primul email din serie are 40-60% open si aduce ~320% mai mult venit/email; trimite in minute de la inscriere. Tinta de conversie 12-18%.
- **Aniversarea = cel mai mare venit/mesaj** din toate automatizarile de restaurant (~85 USD/rascumparare); trimite cu 7-14 zile inainte, cu oferta datata si rezervabila.
- **Win-back la 30 zile** — primul mesaj la ~30 zile de la ultima comanda prinde intentia inainte de dezangajare; 12-18% rata de re-comanda doar pe primul win-back. Cea mai buna fereastra: Joi/Vineri 16:00-18:00 (ora deciziei de cina).
- **Cos abandonat = 3 atingeri** — email la ~1h (reminder), push la 12-24h (beneficii/dovada sociala), al 3-lea mesaj la 24-36h (urgenta/stimulent). Email cos: ~50% open, ~3,3% conversie; rata de recuperare 8-12%.
- **Membri loialitate** — vin de ~22% mai des si cheltuie cu 18-38% mai mult/bon; treptele (Bronze/Silver/Gold) dau +13% engagement vs program plat. Tine rascumpararea peste 20-30%.
- **Puncte care expira** — 35% dintre membri spun ca expirarea e frustrarea #1. Daca trebuie sa expiri (raspundere contabila), anunta la T-30, T-7, T-1 zile cu soldul exact si recompensa cea mai apropiata.
- **Frequency cap obligatoriu** — maxim 1-2 mesaje marketing/client/zi (~3-5/saptamana), respecta opt-out per canal + ora de liniste 21:00-08:00 in fusul clientului. 23% abandoneaza brandul care comunica prea des. Verifica intai `check_marketing_allowed`.
- **Benchmark de referinta HoReCa** — email open ~24,8% (cel mai bine Marti-Joi 10-11), SMS/WhatsApp open ~98%. Nu conduce dupa open (Apple Mail umfla cu 15-20 puncte) — masoara click, conversie, venit/destinatar, plangeri.

## Fluxuri frecvente

> Fiecare reteta: **Cui / Canal / Cand / Mesaj / Oferta / Tool / Verifici.** Mesajele sunt in RO, gata de copiat — adapteaza numele brandului si valoarea ofertei.

### 1. Welcome (client nou, primele 7 zile)
- **Cui:** segmentul "Noi" (prima comanda / prima vizita / inscriere portal sau loialitate).
- **Canal:** email (secventa 3 pasi); optional push de bun-venit daca a dat opt-in.
- **Cand:** pasul 1 in minute de la inscriere; pasul 2 la +3 zile; pasul 3 la +7 zile.
- **Mesaj:** (1) "Bine ai venit la {brand}! Uite de ce te vei indragosti." (2) "Povestea noastra in 30 de secunde + ce comanda lumea cel mai des." (3) "Cadou de cunostinta: {oferta} la urmatoarea vizita."
- **Oferta:** mic stimulent la pasul 3 (ex. desert din partea casei sau -10% la a doua comanda), valabil 14 zile.
- **Tool:** `create_email_sequence` (3 pasi) -> `enroll_customers_in_email_sequence` [marketing]. Sau `create_email_campaign` cu `campaignType:"flow"` + `activate_email_flow`.
- **Verifici:** `get_email_analytics_overview` la 7 zile — tinta open 40-60%, conversie 12-18%. ROI real: `get_email_conversion_attribution` (fereastra 7 zile).

### 2. Cos abandonat — 3 atingeri (magazin online)
- **Cui:** vizitatori cu cos/comanda neterminata (retail/shop).
- **Canal:** email -> push -> al 3-lea mesaj (push sau WhatsApp), cu iesire automata la conversie.
- **Cand:** email la ~1h; push la 12-24h; mesaj final la 24-36h.
- **Mesaj:** (1) "Ti-au ramas {produse} in cos — le pastram pentru tine." (2) "De ce le aleg clientii nostri + recenzii." (3) "Mai ai cosul? Iti tinem {stimulent mic} daca finalizezi azi."
- **Oferta:** fara reducere la pasii 1-2; stimulent mic DOAR la pasul 3 (transport gratuit sau -5%).
- **Tool:** `create_email_campaign` (flow 3 pasi, exit la conversie) -> `enable_email_predictive_sending` -> `activate_email_flow` [marketing]. Pentru push: `create_push_campaign` (topic `offers`, `imageUrl`, `navigateUrl` spre cos) -> `send_push_campaign(confirm:true)`. Pentru WhatsApp: `send_whatsapp_message(confirm:true)`.
- **Verifici:** rata de recuperare tinta 8-12%; `get_email_conversion_attribution` (7 zile); daca exista click fara conversie, `reconcile_email_conversions`.

### 3. Win-back la 30 zile (incremental, masurat)
- **Cui:** segmentul "Adorm/La risc" — clienti la ~30 zile de la ultima comanda. Imparte pe RFM: VIP racit (oferta adanca) vs client rar (nudge bland).
- **Canal:** scara pe 10-14 zile: email -> push -> WhatsApp/SMS.
- **Cand:** Joi/Vineri 16:00-18:00 (decizia de cina). Pas 1 ziua 0, pas 2 ziua +7 daca n-a comandat, pas 3 ziua +14.
- **Mesaj:** (0) "Ne-a fost dor de tine la {brand}." fara reducere. (+7) "Te asteptam cu {oferta} — valabil 14 zile." (+14) "Ultima sansa: {oferta mai puternica} pana duminica."
- **Oferta:** scalata pe valoare — VIP racit primeste oferta mai mare/personala; clientul rar, putin sau deloc. Doar cine are nevoie de imbold vede reducerea.
- **Tool:** `recompute_loyalty_rfm` -> `evaluate_loyalty_drop_alerts` [citire] -> `preview_guest_segment` (confirma marime + opt-in) -> **holdout 10%** -> `create_offer` (oferta adanca pt VIP) + `create_discount_code` (online) -> `enroll_customers_in_email_sequence` + `push_notify_customers` + `send_whatsapp_message` (toate `confirm:true`, respecta opt-out).
- **Verifici:** tinta 12-18% re-comanda; `get_crm_funnel` + `get_attribution_report` pe segmentul expus vs holdout = liftul in lei. Non-responderii dupa scara -> `add_email_suppression` (sunset) dupa 90-180 zile tacere.

### 4. Aniversare (7-14 zile inainte)
- **Cui:** clienti cu data de nastere cunoscuta in urmatoarele 14 zile.
- **Canal:** push (topic `loyalty`) + email cu prenume. E personal — **fara holdout** aici.
- **Cand:** dimineata, cu 7-14 zile inainte de zi, ca sa apuce sa rezerve.
- **Mesaj:** "La multi ani, {prenume}! De ziua ta te asteptam cu {oferta} — rezerva o masa cand vrei."
- **Oferta:** datata si rezervabila (ex. desert/bautura gratuita la o rezervare in luna aniversara), voucher 14 zile.
- **Tool:** `create_email_campaign` (prenume in continut) + `create_push_campaign` (topic `loyalty`) -> `schedule_push_campaign` (dimineata) [marketing]; optional `award_loyalty_points` bonus de zi. `create_crm_task` "salut personal daca vine".
- **Verifici:** aniversarea are cel mai mare venit/mesaj (~85 USD/rascumparare) — masoara rascumpararea cu `get_guest_loyalty_detail` / `get_customer_timeline`.

### 5. At-risk — clienti buni care s-au racit (alerta de scadere)
- **Cui:** segmentul "Nu-i pierde" — clienti cu valoare mare a caror frecventa a scazut brusc (nu doar "lapsed", ci o anomalie fata de obiceiul LOR).
- **Canal:** email personalizat + push; pentru top-VIP, `create_crm_task` pentru un telefon/mesaj personal de la manager.
- **Cand:** imediat ce alerta apare (recompute lunar + verificare).
- **Mesaj:** "{prenume}, ne lipsesti — stim ca veneai des. E totul in regula? Te asteptam cu {gest personal}."
- **Oferta:** gest personal, nu reducere generica (o atentie din partea casei, o invitatie la o noutate).
- **Tool:** `recompute_loyalty_rfm` -> `evaluate_loyalty_drop_alerts` [citire] (clienti buni deveniti reci) -> `recompute_nba` + `list_nba_suggestions` (actiuni `win_back`) -> `preview_guest_segment` -> `create_email_campaign` + `push_notify_customers` (`confirm:true`) + `create_crm_task` pt VIP.
- **Verifici:** `get_customer_timeline` per client (a revenit?); `run_smart_followups` pentru cei neglijati; recompara cu `evaluate_loyalty_drop_alerts` luna urmatoare.

### 6. Post-vizita — multumire + recenzie
- **Cui:** clienti cu o comanda/vizita finalizata recent.
- **Canal:** invitatie de recenzie (SMS preferat — open ~98%, conversie in recenzie de 3-5x mai mare ca email).
- **Cand:** la 1-2h dupa inchiderea notei (dine-in) sau dupa confirmarea livrarii; niciodata inainte de 9:00 / dupa 20:00 in ora clientului.
- **Mesaj:** "Multumim ca ai fost la {brand}! Ne-ar ajuta enorm un cuvant aici: {link}. 30 de secunde, conteaza mult pentru noi."
- **Oferta:** NICIO oferta conditionata de recenzie pozitiva (review gating e ILEGAL — FTC, pana la ~53.000 USD/incalcare). Ceri recenzii de la TOTI clientii.
- **Tool:** `comms_get_status` + `check_marketing_allowed` -> `dispatch_review_invitations_for_order(confirm:true)` [marketing], in fereastra 9-20. Vezi si `knowledge/recenzii.md` si skill-ul `raspunde-recenzii`.
- **Verifici:** tinta 3-5 recenzii noi/luna/locatie; `get_retail_reviews_summary` + `gbp_reviews_summary`. Recency e factorul #1 de ranking local in 2026.

### 7. Puncte care expira (loialitate, non-spam)
- **Cui:** membri cu puncte ce expira (segmenteaza dupa sold + zile pana la expirare).
- **Canal:** push (topic `loyalty`) + email, cu soldul EXACT.
- **Cand:** cadenta in 3 atingeri — T-30, T-7, T-1 zile.
- **Mesaj:** "Ai {X} puncte care expira in {N} zile -> {recompensa cea mai apropiata, ex. o cafea gratis}. Le folosesti dintr-un click: {link portal}."
- **Oferta:** punctele lor + recompensa cea mai apropiata de atins (nu o reducere noua).
- **Tool:** `get_guest_loyalty_detail` (sold + expirare) [citire] -> `create_push_campaign` (topic `loyalty`) -> `preview_push_audience` -> `send_push_campaign(confirm:true)` dupa confirmarea numarului + email. `expire_loyalty_points` se foloseste DOAR cand chiar trebuie sters soldul, nu ca tactica.
- **Verifici:** `get_push_campaign_analytics`; tinta — creste rascumpararea spre 30-50% si reduce breakage-ul fara sa pierzi goodwill.

### 8. VIP upsell / tier-up nudge
- **Cui:** segmentul "Campioni/Loiali" aproape de o treapta superioara (ex. la <200 puncte de Gold) sau cu propensiune mare de cumparare.
- **Canal:** email + push, mesaj de status (motivatie de "urcare").
- **Cand:** cand sunt la un pas de treapta + un weekend in care poti dubla punctele.
- **Mesaj:** "{prenume}, mai ai {X} puncte pana la Gold! Weekendul asta dublam punctele — fa saltul si primesti {beneficiul treptei Gold}."
- **Oferta:** dublare puncte pe o fereastra scurta (LTO de loialitate, fara reducere permanenta) + perk-ul treptei.
- **Tool:** `recompute_loyalty_rfm` + `list_nba_suggestions` (actiuni `upsell`) -> `create_customer_group` + `add_customer_group_member` (grupul VIP-tier-up) -> `preview_email_audience` -> `send_email_campaign` + `push_notify_customers` (`confirm:true`). Treptele/recompensele se cresc cu `create_loyalty_tier` / `create_loyalty_reward`.
- **Verifici:** cati au urcat — `get_guest_loyalty_detail` pe grup; membrii vin +22% / cheltuie +18-38% per bon.

## Tool-uri MCP utile

- `recompute_loyalty_rfm` [marketing] — recalculeaza segmentele RFM (ruleaza LUNAR ca sa fie automation-ready).
- `evaluate_loyalty_drop_alerts` [citire] — clienti buni care s-au racit brusc (motorul retetelor 3 si 5).
- `recompute_nba` + `list_nba_suggestions` [citire] — urmatoarea cea mai buna actiune per client (`win_back`, `upsell`, `review_request`, `birthday`).
- `run_smart_followups` [marketing] — follow-up automat pentru clienti/deal-uri neglijate.
- `preview_guest_segment` / `preview_email_audience` / `preview_push_audience` [citire] — marimea EXACTA a audientei + opt-in, inainte de orice trimitere.
- `create_customer_group` + `add_customer_group_member` [marketing] — construieste un grup tinta reutilizabil (ex. VIP-tier-up, win-back).
- `get_customer_timeline` / `get_guest_loyalty_detail` [citire] — istoricul si soldul de puncte ale unui client; verifici daca a revenit/rascumparat.
- `create_email_sequence` + `enroll_customers_in_email_sequence` [marketing] — secventa drip (welcome, win-back).
- `create_email_campaign` + `activate_email_flow` [marketing] — flux cu pasi/conditii (cos abandonat, aniversare).
- `enable_email_predictive_sending` / `send_email_campaign_predictive(confirm:true)` [marketing] — esalonare pe ore individuale; predictive salveaza config, predictive-send trimite real.
- `create_push_campaign` -> `schedule_push_campaign` / `send_push_campaign(confirm:true)` [marketing] — push de oferta/loialitate; `topic:offers` sau `topic:loyalty`, `holdoutPercent:10` pe oferte, `imageUrl`+`navigateUrl`.
- `push_notify_customers(confirm:true)` [marketing] — push catre un segment de clienti.
- `send_whatsapp_message(confirm:true)` [marketing] — pasul de conversatie din scara win-back/cos.
- `create_offer` [marketing] — mecanica de venit. **Suporta fereastra orara:** `timeStart`+`timeEnd`+`daysOfWeek` (Happy Hour) si `startsAt`/`expiresAt` (LTO/oferta limitata). Fara fereastra, oferta ruleaza 24/7.
- `create_discount_code` [marketing] — cod (single-use pt win-back online).
- `award_loyalty_points` / `redeem_loyalty_points` / `expire_loyalty_points` [marketing] — gestiunea punctelor; `expire_*` doar cand chiar trebuie sters soldul.
- `create_loyalty_tier` / `create_loyalty_reward` [marketing] — trepte si recompense (tier-up).
- `dispatch_review_invitations_for_order(confirm:true)` [marketing] — invitatie de recenzie post-comanda; vezi si `get_retail_reviews_summary`, `gbp_reviews_summary` [citire].
- `create_crm_task` [marketing] — sarcina interna (telefon/salut personal pentru VIP).
- `check_marketing_allowed` / `comms_get_status` [citire] — poarta de consimtamant + status canale inainte de trimitere.
- `add_email_suppression` [marketing] — sunset pentru non-responderii dupa scara win-back.
- `get_attribution_report` / `get_attribution_ltv_by_channel` / `get_email_conversion_attribution` / `reconcile_email_conversions` [citire] — dovada liftului in lei (expus vs holdout).
- `seed_crm_playbooks` / `run_crm_playbook` / `list_crm_playbooks` / `list_playbook_runs` [marketing/citire] — playbook-uri gata (aniversare, inactivitate) — vezi `knowledge/crm-automatizari-playbooks.md`.

## Întrebări frecvente și capcane

- **De ce holdout daca "merge" oricum?** Fara un grup de control de 10% nu poti separa clientii care ar fi venit oricum de cei adusi de mesaj. Cu holdout transformi "am trimis 5000 de emailuri" in "fluxul a adus X vizite/lei in plus". Ai nevoie de min. ~200 conversii in control pentru o cifra de incredere.
- **Cat de des trimit?** Maxim 1-2 mesaje marketing/client/zi, ~3-5/saptamana, TOATE canalele la un loc. Un client poate primi welcome + aniversare + puncte-expira simultan — pune un cap global ca sa nu-l obosesti. Ruleaza `check_marketing_allowed` inainte.
- **Pot conditiona o oferta de o recenzie pozitiva?** NU. Review gating e ilegal (FTC, pana la ~53.000 USD/incalcare) si interzis de Google. Ceri recenzii de la TOTI clientii, fara stimulent legat de nota.
- **De ce nu conduc dupa open rate?** Apple Mail umfla open-ul cu 15-20 puncte (un 28% real apare ca 52%). Deciziile se iau pe click, conversie, venit/destinatar si plangeri — nu pe open brut.
- **Cand pun reducere in win-back?** Doar la pasii tarzii ai scarii si scalat pe valoare: VIP racit primeste oferta adanca/personala, clientul rar putin sau deloc. Reducerea generala "antreneaza" clientii sa astepte mereu pret mai mic.
- **Cand sting un client (suppression)?** Dupa scara win-back completa fara raspuns, la ~90-180 zile de tacere. Fluxurile de win-back au dezabonare mai mare — e normal si util pentru igiena listei.
- **De ce nu apare pagina CRM / Loialitate?** Verifica intai ca modulul e activ pe brand si ca esti pe brandul/locatia corecta. Vezi `knowledge/crm-automatizari-playbooks.md` si `gaseste_in_aplicatie`.
- **Am trimis deja o campanie — o editez?** Nu. Creezi una noua pe segmentul potrivit (non-clickers, clicked-no-conversion, VIP, win-back). Dupa orice trimitere verifica prin tool de citire, nu repeta comanda pe baza ecranului.
- **Aniversarea cu holdout?** Nu — e un gest personal, nu un test. Holdout-ul e pentru fluxuri de masa (win-back, cos, oferte), nu pentru mesaje 1-la-1 de zi de nastere.
- **Cum pun Happy Hour sau o oferta limitata?** `create_offer` cu `timeStart`+`timeEnd`+`daysOfWeek` pentru Happy Hour recurent, sau `startsAt`/`expiresAt` pentru o oferta limitata in timp. Fara aceste campuri oferta ruleaza 24/7.

## Vezi și

- `knowledge/segmentare-clienti.md` — segmente, taguri, RFM in detaliu.
- `knowledge/loialitate-fidelizare.md` — economia punctelor (earn 1:1, prag prima recompensa, breakage).
- `knowledge/crm-automatizari-playbooks.md` — playbook-uri si automatizari gata de pornit.
- `knowledge/email-marketing.md` — fluxuri, livrabilitate, predictive, ROI atribuit.
- `knowledge/push-notificari-marketing.md` — frecventa push, ore pe daypart, holdout pe push.
- `knowledge/recenzii.md` — invitatii si raspuns la recenzii.
- `knowledge/gdpr-clienti-oaspeti.md` — consimtamant, dezabonari, ora de liniste.
