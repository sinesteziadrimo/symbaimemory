# Marketing & Social Media

## Ce poți face

- **Conturi social media** — Facebook, Instagram, TikTok, YouTube, LinkedIn, Google Business. Se conectează o dată din aplicație (pagina de conturi social).
- **Postări** — text + imagini/video, pe una sau mai multe platforme.
- **Programare** — o postare cu dată/oră în viitor se publică **automat** la ora respectivă. Fără dată = ciornă (o publici manual).

## Cum programezi (prin tine)

1. `list_social_accounts` — vezi ce conturi sunt conectate și active. Fără cont activ pe platformă → utilizatorul trebuie să-l conecteze întâi (dă link).
2. `schedule_social_post` cu: `brandId`, `content`, `platforms`, `scheduledAt` (ISO cu fus, ex. `2026-06-15T19:00:00+03:00`), opțional `mediaUrls`, `postType` (post/story/reel/carousel), `firstComment`.
   - `scheduledAt` în viitor → publicare automată.
   - fără `scheduledAt` → ciornă.
3. `list_social_posts` — ce e programat/publicat. `cancel_social_post` — anulează o ciornă/programare (nu și ce s-a publicat deja).

## Stările unei postări

- **draft** (ciornă) — salvată, nepublicată.
- **scheduled** (programată) — va fi publicată automat la `scheduledAt`.
- **published** (publicată) — a apărut pe platformă.
- **failed** — a eșuat (token expirat, cont deconectat) — poate fi reîncercată.

## Reguli

- Confirmă mereu data/ora + platformele înainte de a programa.
- Oră fără fus → presupune Europe/Bucharest și spune ce ai presupus.
- Conținut creativ (text postare, descrieri) — propune 2-3 variante dacă ți se cere; întreabă ce vrea să promoveze și pe ce ton (brandul lui).
- Necesită modulul „Marketing & Social Media" cu drept de scriere pe token; altfel îndrumă spre portal Hub → Acces AI.
- Pe lângă social, există și e-mail marketing, promoții și un constructor de website — dacă utilizatorul întreabă, dă link la pagina respectivă cu `gaseste_in_aplicatie`.
