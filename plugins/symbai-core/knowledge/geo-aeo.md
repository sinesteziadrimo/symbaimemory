# GEO / AEO — cum faci brandul să fie recomandat de ChatGPT, Claude, Perplexity și Google AI

> Continuă din `seo-2026.md`. GEO = Generative Engine Optimization (a fi citat/recomandat de motoarele AI). Pentru partea locală vezi `local-seo-horeca.md`.

## Pe scurt

În 2026 oamenii întreabă tot mai des un asistent AI „recomandă-mi un restaurant romantic în Cluj cu opțiuni vegane" în loc să caute clasic. A fi numit în acel răspuns e o disciplină separată de poziția #1: studiile arată suprapunere mică între ce citează diferitele motoare, iar majoritatea citărilor AI **nu** vin din top-10 organic. Vestea bună: Google a fost explicit (ghid 15 mai 2026) — **GEO „este tot SEO"**: nu există markup special, NU faci `llms.txt` magic, NU „chunking". Câștigi citări cu **conținut util oamenilor + SEO tehnic curat + date structurate + o entitate de brand recunoscută + recenzii/mențiuni**. Pentru local, **Google Business Profile e răspunsul AI** (la hoteluri, ~79% dintre linkurile din Google AI Mode duc la GBP).

## Cum aleg motoarele AI ce să citeze și recomande

Trei lucruri decid dacă un AI te numește:

1. **ENTITATE de brand recunoscută.** Primul lucru pe care îl face un LLM cu numele tău e să te recunoască drept o entitate. Asigură:
   - **NAP identic** (Nume/Adresă/Telefon) peste tot — site, Google Business Profile, Facebook, Booking/Tripadvisor, directoare. Inconsistența te face invizibil.
   - **JSON-LD `Organization`/`LocalBusiness`** pe fiecare pagină, cu `name`, `logo`, adresă, telefon și un **`sameAs`** care leagă profilurile (GBP, social, Wikidata).
   - **Un item Wikidata** (pragul de notabilitate e mic — aproape orice business real se califică; hrănește Knowledge Graph-ul Google și Gemini). Wikipedia DOAR dacă chiar ești notabil (niciodată plătit).
2. **CONSENS pe web (mențiuni de brand).** Brandul descris la fel pe Reddit, recenzii, OTA-uri, YouTube, presă locală. Mențiunile de brand (chiar fără link) corelează cu vizibilitatea AI mult mai puternic decât backlink-urile (≈0.66 vs ≈0.22; mențiunile YouTube ≈0.74, cele mai puternice). → urmărește prezența în directoare, platforme de recenzii și conținut video local.
3. **CONȚINUT extractabil.** Un model citează ce poate „ridica" drept răspuns scurt, autonom: răspuns direct sus, secțiuni scanabile, tabele comparative, definiții, blocuri FAQ, **statistici/numere** (adăugarea de statistici crește vizibilitatea în studii — efectul e mai mare pentru paginile mai slab poziționate).

## Cum scrii conținut „citabil de AI"

- **Răspuns întâi**: pune răspunsul la întrebarea-titlu în primele 1-2 propoziții (un bloc de ~40-60 cuvinte), apoi detaliază.
- **Întrebare → răspuns**: secțiuni H2/H3 fraze ca întrebări reale (din People Also Ask), fiecare cu un răspuns concis.
- **Tabele și liste** pentru comparații (preț, program, opțiuni) — ușor de extras.
- **Entități numite** (nume preparate, cartiere, repere, prețuri în RON) — ancorele pe care AI le folosește.
- **FAQ la final** (vezi mai jos despre schema).

## „Plumbing"-ul tehnic (ce contează vs ce e mit)

- ✅ **robots.txt** trebuie să **permită boții de căutare AI** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider etc.). Pe instanțele Symbai, `robots.txt` îi permite deja explicit. Dacă un client blochează acești boți, nu poate fi citat.
- ✅ **Date structurate** (`Organization`/`LocalBusiness`/`Restaurant`/`Menu`/`Article`) — ajută recunoașterea entității și extragerea. NU sunt un „buton de citare", ci un semnal de consistență/încredere.
- ⚠️ **`llms.txt` NU e o pârghie de citare/ranking.** Google și inginerii lor au respins-o; traficul de boți pe ea e neglijabil. Symbai generează un `/llms.txt` orientat pe brand (nume, contact, articole, recenzii) ca **documentație utilă** — bun de avut, dar **nu** promite clientului citări AI din el. Pârghiile reale sunt cele de mai sus.
- ❌ **„Chunking" / rescris pagini special pentru AI / mențiuni false** — Google spune explicit că NU așa câștigi în AI.

## Cum măsori vizibilitatea AI (nu există „rank" clasic)

- Ține o listă de **15-20 de prompturi realiste** de client („cel mai bun brunch lângă [reper]", „hotel pet-friendly în [oraș]") și **rulează-le lunar** prin ChatGPT/Perplexity/Gemini/Google AI Mode; loghează cine e citat și de ce. Folosește `seo_web_research` ca să vezi ce surse apar.
- Urmărește **mențiunile de brand** pe web (recenzii noi, articole, directoare).
- Compară cu concurenții: unde sunt ei numiți în răspunsurile AI și tu nu = gap de închis (conținut + GBP + mențiuni).

## Tool-uri MCP utile pentru GEO

- `get_seo_provider_status` — confirmă că robots/boții AI și sursele de date sunt ok.
- `seo_web_research` (jobType `competitor_audit` / `trend_scan`) — vezi cum e descris brandul/concurenții pe web și ce citează AI-ul.
- `update_brand` / `update_company` — ține NAP-ul și identitatea (socialMedia, googleReviewUrl) canonice la SURSĂ (de aici se construiește entitatea/JSON-LD pe site).
- Conținut: `create_blog_post`/`update_blog_post` cu FAQ și răspunsuri concise; `generate_content_brief` produce întrebări FAQ gata de folosit.

## Capcane

- **Nu vinde „pachete GEO" separate de SEO** — Google spune că e același SEO. Conținut util + tehnic curat + entitate + recenzii.
- **Nu promite citări AI din `llms.txt`** — nu e o pârghie. (E ok ca documentație.)
- **Nu băga `aggregateRating` din recenzii proprii** (vezi `local-seo-horeca.md`) — neeligibil + risc de penalizare.
- **FAQ rich results au fost retrase din Google (7 mai 2026)** — păstrează blocurile Q&A (hrănesc featured snippets + AI Overviews) dar NU promite panouri FAQ în SERP.
- **GBP e cea mai mare pârghie AI locală** — un site bun cu GBP gol pierde majoritatea răspunsurilor AI locale.
