# Loialitate & Fidelizare

> Pentru linkul exact către orice pagină folosește tool-ul `gaseste_in_aplicatie` — el e sursa autoritară de navigare (întoarce link direct pe subdomeniul tenantului).

## Pe scurt

Programul de loialitate îți răsplătește clienții fideli: ei acumulează puncte la cumpărături, urcă în niveluri (Bronze/Silver/Gold/Platinum) și pot răscumpăra puncte pe recompense. Sistemul calculează automat segmente RFM (cât de recent, cât de des, cât de mult cheltuie un client) și te avertizează când un client bun începe să scadă, ca să-l reactivezi. Restaurantul/retailul folosește pagina **/loyalty**; hotelul are loialitate **separată** (pe nopți de cazare) în **/hotel/crm**. Acest ghid acoperă partea operațională; lista generală a paginilor de clienți e în ghidul „Rezervări, Clienți & Evenimente".

## Concepte

- **Punct** — unitatea de fidelitate. Se acumulează după o **regulă** (ex: 1 punct / 1 leu cheltuit) și are o **valoare de răscumpărare** (ex: 100 puncte = 5 lei).
- **Regulă de acumulare** — câte puncte se dau per leu, pe ce canale, eventual multiplicatori (zi de naștere, weekend). Configurabilă per brand.
- **Nivel (tier)** — treaptă de fidelitate (Bronze/Silver/Gold/Platinum sau nume proprii) cu praguri de puncte și beneficii (reduceri, puncte dublate, acces la recompense exclusive).
- **Recompensă** — ce poate lua clientul pe puncte (produs gratuit, reducere, cadou). Formează „catalogul de recompense".
- **RFM** — segmentare automată după **R**ecency (cât de recent a cumpărat), **F**requency (cât de des), **M**onetary (cât a cheltuit). Te ajută să vezi cine-s VIP-urii și cine pleacă.
- **Alertă de scădere (win-back)** — sistemul detectează clienți buni care nu au mai venit de mult și-i propune pentru reactivare.
- **Loialitate hotel** — complet separată de cea POS: se calculează pe **nopți** și are tiers/segmente RFM proprii (/hotel/crm).

## Pagini

- **Fidelizare & Recompense** (`/loyalty`) — trei zone: **Privire de ansamblu** (puncte emise/răscumpărate, top clienți), **Clienți cu puncte** (soldul fiecăruia, istoric), **Setări** (reguli de acumulare, valoare de răscumpărare, niveluri, campanii speciale, bonusuri de zi de naștere/înscriere).
- **Rapoarte Clienți** (`/customer-reports`) — distribuția pe niveluri de loialitate, top clienți, creștere lunară.
- **Follow-up Clienți** (`/customer-followup`) — Next Best Action zilnic (cui să-i ceri o vizită, cui o ofertă) folosește scorul de loialitate/RFM.
- **CRM & Loialitate Hotel** (`/hotel/crm`) — loialitatea hotelului (pe nopți), tiers, segmente RFM, recompense — **separat** de /loyalty.

## Fluxuri pas-cu-pas

1. **Pornești programul**: /loyalty → Setări → setezi regula de acumulare (ex: 1 punct/leu), valoarea de răscumpărare, nivelurile cu praguri, bonusurile (zi de naștere, înscriere). De acum punctele se acumulează automat la fiecare vânzare către un client identificat.
2. **Adaugi un nivel nou**: în Setări → Niveluri → definești numele, pragul de puncte și beneficiile. (Prin conexiune: `create_loyalty_tier`.)
3. **Adaugi o recompensă în catalog**: Setări → Recompense → tip (produs/reducere/cadou), cost în puncte, condiții. (Prin conexiune: `create_loyalty_reward`.)
4. **Acorzi puncte manual** (corecție, gest comercial, compensare): din fișa clientului. (Prin conexiune: `award_loyalty_points` — specifici clientul, numărul de puncte, motivul.)
5. **Răscumperi puncte** pentru un client (la casă sau manual): `redeem_loyalty_points`.
6. **Recalculezi RFM / segmentele**: după o perioadă, ca să ai segmentele la zi → `recompute_loyalty_rfm` (global) sau `recompute_guest_loyalty` (hotel). De obicei rulează automat; folosește manual dacă vrei o reîmprospătare imediată.
7. **Reactivezi clienții în scădere**: `evaluate_loyalty_drop_alerts` îți dă lista clienților buni care s-au răcit → le trimiți o ofertă (vezi ghidul de oferte / campanii email).

## Tool-uri MCP utile

- Citire: `get_guest_loyalty_detail` (soldul + istoricul unui client), `get_hotel_loyalty_overview` (privire loialitate hotel).
- Scriere (modulul **Rezervări & Clienți** pe token): `create_loyalty_tier`, `create_loyalty_reward`, `award_loyalty_points`, `redeem_loyalty_points`, `expire_loyalty_points`, `recompute_loyalty_rfm`, `recompute_guest_loyalty`, `evaluate_loyalty_drop_alerts`.
- Permisiunea exactă a fiecărui tool e în catalogul din `tools-mcp.md`. Dacă un tool întoarce „permisiune insuficientă", modulul nu e bifat pe token → portal Hub → Acces AI.

## Întrebări frecvente

- **De ce nu urcă clientul de nivel?** Verifică pragul nivelului în Setări și soldul clientului (Clienți cu puncte). Avansarea poate fi pe puncte cumulate sau pe puncte din ultima perioadă — vezi regula configurată.
- **Expiră punctele?** Da, dacă ai setat expirare. `expire_loyalty_points` aplică expirarea; o poți rula și manual.
- **Pot da puncte „din mână" unui client?** Da — `award_loyalty_points` cu motiv (rămâne în istoric, auditat).
- **Loialitatea hotelului e aceeași cu cea de la restaurant?** NU. Hotelul are program separat (pe nopți), în /hotel/crm. Punctele nu se amestecă decât dacă ai configurat explicit.
- **Ce e RFM și de ce-mi trebuie?** Îți spune automat cine-s clienții valoroși (cheltuie des și mult, recent) ca să-i tratezi preferențial, și cine pleacă, ca să-i reactivezi.

## Capcane

- **Loialitate POS ≠ loialitate hotel** — sunt două sisteme; nu căuta punctele de cazare în /loyalty.
- **GDPR**: înainte de a trimite oferte/campanii către segmente de loialitate, opt-out-ul per canal (email/SMS/WhatsApp) trebuie respectat — vezi ghidul „GDPR & date clienți".
- **După ce modifici reguli prin conexiune**, datele sunt salvate, dar interfața arată valorile vechi până la **refresh** (cache în browser). Confirmă cu un tool de citire, nu repeta scrierea.
- Punctele se acumulează doar pentru clienți **identificați** la vânzare (telefon/card de fidelitate); vânzările anonime nu acumulează.
