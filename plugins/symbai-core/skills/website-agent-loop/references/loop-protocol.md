# Protocol: Website Builder-Reviewer Loop

## Contract de orchestrare

Orchestratorul tine lista de iteratii si decide cine scrie. Subagentii pot fi folositi pentru lucru, dar live writes se fac secvential: Builder termina, apoi Reviewer verifica read-only, apoi Builder repara.

Pentru un loop de cateva ore in Codex, starea poate sta in thread/automation. Pentru un loop de zile sau integrat in POS, starea trebuie sa fie persistenta in NexusPOS: run id, iteratii, snapshots, findings, artifacte si lock per `brandId + websiteId`.

Starea minima pe fiecare iteratie:

```text
iteration:
sourceUrl:
targetBrand:
mode:
allowedWrites:
builderEvidence:
reviewFindings:
nextFixes:
learningCandidates:
stopDecision:
```

## Gate de completitudine pentru site-uri complexe

Pentru site-uri de tip Drimoland, loop-ul nu trece pe PASS dupa homepage sau dupa primele componente vizibile. Fiecare iteratie trebuie sa mentina un tabel scurt:

```text
pageSlug:
sourceSections:
localComponents:
missingSections:
assetsMissing:
seoOk:
status: pending|fixed|blocked
```

Inventariaza toate linkurile din header/dropdown/footer si toate `canonicalSlugs`; fiecare slug are pagina locala, redirect pastrat sau blocaj explicit. Pentru pagini de meniu/catalog adauga audit separat:

```text
menuAudit:
sourceCategories:
sourceProducts:
sourceProductsWithImages:
localCategories:
localProducts:
localProductsWithImages:
dbReadOnlySamples:
writeNeeded: none|dry-run-required|confirmed
```

Reviewerul trebuie sa refuze PASS daca lipsesc pagini din navigatie, daca un meniu are produse exemplu in locul produselor reale, daca pozele produselor nu au fost cautate in structurile reale ale sursei (ex. `attributes.media`), sau daca bara de categorii nu este sticky/scroll-spy/click-to-section.

Pentru site-uri cu blog, adauga audit separat:

```text
blogAudit:
sourceIndexUrls:
sourceArticleCount:
sourceArticlesWithImages:
sourceArticlesWithFullContent:
localBlogPageHasListing:
localArticleCount:
localImportedSlugs:
placeholderPostsFound:
missingArticles:
writeNeeded: none|dry-run-required|confirmed
```

Reviewerul trebuie sa refuze PASS daca sursa are blog si local lipseste pagina `/blog` cu `blog-listing`, daca articolele sunt carduri statice in loc de entitati Blog, daca `localArticleCount` este mai mic decat `sourceArticleCount` fara justificare, daca lipsesc slug-uri/canonical/date/imagini de coperta, sau daca au ramas drafturi placeholder de test.

## Guardrails non-negociabile

- Reviewer read-only real cand se poate: token fara module de scriere sau rol separat. Daca exista doar acelasi token, marcheaza verificarea ca prompt-only read-only.
- Lock per site/run. Nu porni doua pass-uri Builder pe acelasi website simultan.
- Snapshot inainte de orice replace/editare mare: config website, navigatie, footer, pagini, audit initial si, daca se atinge catalogul, categorii/produse relevante.
- `apply_website_template(confirmReplace:true)` cere confirmare + snapshot + criteriu de rollback.
- Dupa fiecare write, citeste inapoi (`list_websites`, config/audit) si nu repeta acelasi write doar pentru ca UI-ul are cache.
- Daca se implementeaza POS-side, adauga dry-run/diff/preview pentru website writes; auditul post-factum singur nu e suficient.
- Daca se cere GPT-5.5 xhigh din codul POS, verifica allowlist-ul/model settings local si actualizeaza-l explicit; nu presupune ca serverul accepta modelul doar pentru ca subagentii Codex il accepta.

## Prompt Builder

```text
Esti Builder Agent pentru Symbai Website Loop. Foloseste modelul GPT-5.5 cu reasoning xhigh.

Scop: construieste/imbunatateste website-ul Symbai pentru brandul <targetBrand>, pornind de la <sourceUrl>.

Reguli:
- Nu esti singur in codebase; nu rescrie WIP strain si nu da revert la schimbari pe care nu le-ai facut.
- Foloseste skill-ul construieste-website si knowledge-ul de website builder.
- Incepe cu citiri reale: list_brands, list_locations, list_websites, list_website_component_catalog, get_ecommerce_settings, list_menu_items/list_menu_categories, audit_shop_health.
- Pentru sursa, ruleaza analyze_external_website(crawlPages:true,maxPages:12) si fa screenshot/intake unde se poate.
- Foloseste componente standard prima data. custom-html doar fallback controlat.
- Dupa scrieri, ruleaza audit_shop_health si verifica prin link/screenshot sau raporteaza blocajul browserului.
- Inainte de replace/editari masive, creeaza snapshot si noteaza cum revii inapoi.
- Daca atingi cod POS, tine difful minim, ruleaza verificari targetate si listeaza fisierele schimbate.
- Nu comite, nu push-ui si nu modifica persistent memory fara cerere explicita.

Returneaza evidence pack:
1. Ce ai schimbat in Symbai.
2. Linkuri/pagini verificate.
3. Audit si probleme ramase.
4. Diff-uri/fisiere cod atinse.
5. Ce ar trebui sa verifice Reviewer.
```

## Prompt Reviewer

```text
Esti Reviewer Agent pentru Symbai Website Loop. Foloseste modelul GPT-5.5 cu reasoning xhigh. Lucrezi STRICT read-only.

Scop: verifica critic rezultatul Builderului pentru <sourceUrl> -> <targetBrand>.

Interdictii:
- Nu scrii in MCP.
- Nu editezi fisiere.
- Nu repari direct.

Verifica:
- Paritate vizuala: homepage, header/nav/dropdown, hero/slider, categorii/meniu, pagina produs/serviciu, footer.
- Functional: categorii fara produse, filtre, CTA-uri, linkuri, pagina de contact/legal, cos/checkout daca este magazin.
- SEO/migrare: slug-uri, URL map, meta, canonical pages, blog/galerie/pagini importante.
- Blog migration: daca sursa are blog, verifica paginarea, numarul articolelor, `list_blog_posts`, pagina `/blog` cu `blog-listing`, slug-uri, canonical, imagini si articole placeholder.
- Store health: audit_shop_health fara error; warn-urile sunt explicate.
- Code review daca exista diff POS: regressii, rute SSR, preview/live parity, build/test gaps, securitate custom-html.
- Worktree hygiene: WIP strain, fisiere temporare, schimbari neexplicate.

Output:
- Findings intai, ordonate P0/P1/P2/P3.
- Pentru fiecare finding: dovada, impact, fix cerut, criteriu de acceptare.
- La final: verdict PASS / NEEDS_FIX / BLOCKED.
```

## Prompt de reparare

```text
Continua ca Builder Agent. Ai feedback-ul Reviewerului de mai jos. Repara doar defectele listate sau dependentele lor directe. Pastreaza partile deja bune. Dupa reparare, returneaza evidence pack nou si marcheaza fiecare finding ca fixed / not fixed / blocked.
```

## Candidat de invatare

Transforma o lectie in skill/knowledge doar cand sunt adevarate toate:

- defectul a fost observat in rezultat real sau test local;
- exista cauza explicita, nu doar gust estetic;
- regula va ajuta si la alte website-uri, nu doar la brandul curent;
- nu contrazice `construieste-website`, `website-builder.md` sau tool docs live;
- patch-ul este mic, verificabil si nu amesteca WIP strain.

Format propus:

```text
learningCandidate:
symptom:
cause:
fixRule:
targetFile:
evidence:
```

## Automatizare lunga

Pentru rulari de ore/zile, promptul automatizarii trebuie sa includa toate intrarile. Nu folosi placeholder-e.

Template scurt:

```text
Use $website-agent-loop to continue the guarded Builder/Reviewer loop for sourceUrl=<url>, targetBrand=<brand>, mode=<mode>. Respect max one builder write pass plus one reviewer pass per wakeup. Stop and report if audit_shop_health has no errors and reviewer has no P0/P1, or if blocked by missing permission/browser/MCP. Do not commit or push unless explicitly requested.
```

## Cand trebuie cod POS, nu doar skill

Daca cerinta este un produs intern care ruleaza singur zile intregi, creeaza un design/patch NexusPOS inainte de rulare live:

- tabele/entitati pentru `website_copy_runs`, `website_copy_iterations`, `website_copy_findings`, snapshots si artifacte;
- lock tranzactional pe `brandId + websiteId`;
- endpoint/tool read-only pentru reviewer si write whitelist pentru builder;
- preview/diff pentru `set_website_page_content`, `update_website_navigation`, `set_website_footer`, `apply_website_template` si custom components;
- allowlist model/reasoning pentru `gpt-5.5` si `xhigh`;
- teste pentru lock, snapshot, retry idempotent, reviewer read-only si rollback.
