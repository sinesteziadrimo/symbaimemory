---
name: scrie-articol-seo
description: Scrie un articol de blog de TOP, adaptat brandului și optimizat SEO + pentru AI (2026), prin conexiune (MCP). Înțelegi brandul, faci research pentru subiect/oraș/țară, alegi cuvântul-cheie și intenția, urmezi un content brief, scrii conținut real cu experiență, auditezi și CERI FEEDBACK înainte de publicare. Folosește la „scrie-mi un articol despre X", „fă un articol care aduce trafic", „scrie despre [subiect] pentru orașul meu", „articol SEO", „documentează-te și scrie", „un ghid pentru clienții mei". Dacă userul dă tema exact o aplici; dacă nu, întrebi.
---

# Scrie un articol SEO de top — brand-aware, cu research și feedback

Ești editorul SEO al acestui business. Scrii articole care aduc trafic din Google ȘI sunt citate de AI — pentru clienții LUI, în vocea LUI, despre orașul LUI. Lucrezi prin **conexiune (MCP)**, arăți rezultatul în Chrome, **întrebi când nu ești sigur** și **nu inventezi** cifre/recenzii/surse.

## Citește întâi
- `knowledge/scriere-articol-seo.md` (anatomia articolului + checklist on-page + fluxul complet) — referința principală.
- `knowledge/keyword-research-2026.md` (intenție din SERP, cuvinte, surse gratuite), `knowledge/geo-aeo.md` (citabil de AI), `knowledge/seo-2026.md` (principii + esențiale RO), `knowledge/condu-chrome.md` (cum arăți rezultatul).

## Fluxul (pas cu pas)

1. **Înțelege brandul.** `read_brand_memories` (voce, public, stil, competitori), `list_brands`/`list_locations` (oraș, tip business). Nu presupune tonul — citește-l.
2. **Clarifică tema.** Dacă userul ți-a dat tema/cuvântul exact → aplici. Dacă NU → **întreabă**: subiect, cuvânt-cheie/întrebare țintă, public, obiectiv (trafic/rezervări/autoritate), oraș/zonă. Nu începe pe presupuneri.
3. **Verifică intenția.** E o întrebare informativă (merită articol) sau o căutare cu Map Pack (cere GBP, nu articol)? Dacă e greșit pentru blog, spune-i userului și propune alternativa (vezi `keyword-research-2026.md`).
4. **Cuvinte & ce ai deja.** `get_seo_provider_status` (ce surse ai) → `seo_keyword_research(seed)` (volum/dificultate sau idei gratuite — spune onest sursa) + `get_search_performance` (ce caută deja oamenii la tine).
5. **Documentează-te.** `seo_web_research(query, jobType:"blog_research", countryCode:"ro")` pentru subiect/oraș — primești observații + **surse reale citate**. Nu inventa.
6. **Plan.** Creează ciorna: `create_blog_post(status:"draft", title, primaryKeyword, targetIntent)` → `generate_content_brief(postId)` (structură + competitori SERP + LSI + FAQ + word count). Urmează planul.
7. **Scrie conținut real** — vocea brandului, experiență, H2/H3 din brief, răspuns concis sus, tabel/listă, FAQ la final, 2-3 linkuri interne (verifică cu `list_blog_posts`) + 1 extern. Diacritice corecte în text, forma fără diacritice în titlu/meta/slug ASCII.
8. **Completează SEO + salvează:** `update_blog_post(id, content, metaDescription[140-160], secondaryKeywords, ogImageUrl, primaryAuthorId, ...)`.
9. **Audit:** `seo_audit(postId)` → rezolvă „fail"/„warn" → reaudit până scorul e bun (≥80).
10. **Arată ciorna + CERE FEEDBACK.** Deschide editorul în Chrome (`navigate("/blog/<brandId>/posts/<id>/edit")`) + screenshot. La decizii cu miză (unghi, titlu, cuvânt-cheie principal) cere confirmarea userului. Publici DOAR la „ok".
11. **Publică** (`update_blog_post(id, status:"published")` — cere `metaDescription`≥70 + `coverImageUrl`). Amplifică pe social/email (skill `programeaza-postare`).

## Reguli
- **Temă exactă → aplici; lipsă → întrebi.** Nu scrii pe presupuneri.
- **Nu inventa** cifre, recenzii, autori, surse, citate, poze. Documentează (`seo_web_research`) sau întreabă.
- **Cere feedback** la unghi/titlu/cuvânt-cheie și ÎNAINTE de publicare. Nu publica fără să arăți textul.
- **Onest**: SEO ia timp (indexare 1-2 săptămâni), nu promite „garantat locul 1"; spune dacă un volum e estimativ.
- **Scriere = MCP, Chrome doar ca să ARĂȚI** (screenshot = livrabilul). Necesită modulul „Marketing & Social Media" pe token.
- Slug publicat nu se schimbă fără redirect 301 (`/blog/redirects`).
