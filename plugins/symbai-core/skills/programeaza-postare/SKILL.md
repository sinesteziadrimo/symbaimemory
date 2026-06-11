---
name: programeaza-postare
description: Creează și programează o postare pe social media (Facebook, Instagram, TikTok etc.) pentru restaurant. Folosește la „fă o postare", „programează pe Facebook mâine la 7", „postează oferta de azi pe Instagram".
---

# Programează o postare social media

1. Vezi ce conturi sunt conectate: `list_social_accounts` (opțional pe `brandId`). Dacă nu există niciun cont activ pe platforma cerută, spune-i utilizatorului să conecteze contul (dă link cu `gaseste_in_aplicatie("conturi social media")`).
2. Compune textul postării împreună cu utilizatorul (sau propune 2-3 variante dacă ți-o cere). Ține cont de brand și de ce vrea să promoveze.
3. `schedule_social_post`:
   - `brandId`, `content` (textul), `platforms` (ex. `["facebook","instagram"]`),
   - `scheduledAt` în viitor, format ISO cu fus (ex. `2026-06-15T19:00:00+03:00`) → se publică **automat** la ora aceea;
   - fără `scheduledAt` → rămâne **ciornă** (draft), o publică utilizatorul manual.
   - opțional `mediaUrls` (imagini/video publice), `postType` (post/story/reel/carousel), `firstComment`.
4. Confirmă: „Am programat postarea pe Facebook+Instagram pentru 15 iunie, ora 19:00. O vezi în Marketing → Social." + link.

## Reguli

- Întotdeauna confirmă data/ora + platformele înainte de programare.
- Dacă utilizatorul dă o oră fără fus, presupune Europe/Bucharest și spune ce ai presupus.
- Anulare: `cancel_social_post(postId)` — doar pentru ciorne/programate, nu pentru cele deja publicate.
- Vezi ce e programat: `list_social_posts` (filtrabil pe status: scheduled/draft/published).
- Detalii concept în `knowledge/marketing-social.md`.
- Necesită scriere pe modulul „Marketing & Social Media"; dacă lipsește, îndrumă spre portal Hub → Acces AI.
