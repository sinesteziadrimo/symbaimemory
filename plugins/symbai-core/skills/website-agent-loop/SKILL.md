---
name: website-agent-loop
description: Orchestreaza un loop multi-agent pentru copierea, construirea si verificarea unui website in Symbai POS/Website Builder: agent builder care foloseste pluginul Symbai, MCP live si codul sursa NexusPOS, agent reviewer read-only care auditeaza critic, apoi iteratii de reparare, imbunatatire de skill/knowledge si reluare. Foloseste cand utilizatorul cere "loop", "agent care construieste site-ul apoi alt agent verifica", "ruleaza ore/zile", "importa un website existent in Symbai si imbunatateste POS/symbaimemory", sau workflow builder-reviewer cu GPT-5.5 extra high.
---

# Website Agent Loop

## Scop

Ruleaza ca orchestrator, nu ca un script orb. Scopul este un ciclu controlat: Builder construieste site-ul in Symbai, Reviewer verifica read-only si critic, Builder repara, iar lectiile confirmate se intorc in `symbaimemory` ca skill/knowledge numai dupa dovada.

## Inainte de Start

1. Citeste `references/loop-protocol.md`.
2. Citeste skill-ul executor `../construieste-website/SKILL.md`.
3. Pentru operare live, citeste `../../knowledge/agent-operare-avansata.md`, `../../knowledge/website-builder.md`, `../../knowledge/website-copy-intake.md` si, daca exista catalog/PDP, `../../knowledge/website-builder-pdp.md`.
4. Verifica worktree-urile implicate (`nexuspos`, `symbaimemory`) inainte de orice editare: status, stash, diffs relevante. Nu comite si nu rescrie WIP neatribuit.
5. Nu porni scrieri live fara: URL sursa, brand/site tinta, permisiune de scriere si limita de iteratii/timp.

## Intrari Necesare

- `sourceUrl`: website-ul de copiat sau folosit ca inspiratie.
- `targetBrand`: brandul Symbai in care se construieste.
- `mode`: `dry-run`, `write-website`, `write-code`, sau `write-website-and-code`.
- `iterationBudget`: numar maxim de iteratii sau durata maxima.
- `learningScope`: ce poate actualiza in `symbaimemory` (skill, knowledge, tool docs). Default: propune patch-uri, nu modifica automat daca lipseste acordul.

Daca lipseste `sourceUrl` sau `targetBrand`, cere-le. Daca lipseste limita, foloseste default sigur: 3 iteratii, apoi raport.

## Reguli de Agent

- Daca folosesti subagenti, seteaza explicit `model: gpt-5.5`, `reasoning_effort: xhigh`, `service_tier: priority`, pentru ca utilizatorul a cerut GPT-5.5 extra high.
- Builder poate scrie doar in suprafetele aprobate pentru iteratia curenta.
- Reviewer este strict read-only: audit, screenshot, diff review, teste, comparatie, dar fara MCP writes si fara editari. Cand exista posibilitatea, foloseste token/rol read-only real; prompt-only read-only este fallback si trebuie raportat ca atare.
- Nu lasa doi agenti sa scrie simultan in acelasi tenant sau acelasi fisier.
- Reviewer trebuie sa intoarca defecte actionabile, cu severitate, dovada si criteriu de acceptare.
- Pentru scrieri de website: snapshot inainte, lista de writes dupa, lock per `brandId + websiteId`, si plan de rollback inainte de template replace sau editari masive.

## Bucla

1. **Preflight:** citeste starea repo-urilor, statusul site-ului existent, brandurile, website-urile, catalogul de componente si auditul initial.
2. **Builder pass:** foloseste `construieste-website`: `analyze_external_website`, screenshot/intake, creare/actualizare website, componente standard prima data, `custom-html` doar fallback, apoi `audit_shop_health`.
3. **Evidence pack:** Builder lasa linkuri, screenshot-uri, audit, diff-uri cod, lista MCP writes si probleme ramase.
4. **Reviewer pass:** Reviewer compara sursa cu rezultatul, verifica auditul, rute, SEO/URL map, mobile, categorii/filtre/PDP/footer/legal, si codul POS daca a fost atins.
5. **Repair pass:** trimite defectele la Builder, cu interdictia de a reface parti deja bune fara motiv.
6. **Learning pass:** doar defectele confirmate si repetabile devin modificari in `symbaimemory` sau taskuri de cod. Nu transforma preferinte temporare in reguli generale.
7. Repeta pana la criteriile de oprire.

## Criterii de Oprire

Opreste cu succes doar cand:

- `audit_shop_health` nu are `error`.
- Reviewer nu mai are P0/P1.
- Toate slug-urile din navigatie si `canonicalSlugs` au pagina locala sau un motiv explicit de amanare.
- Pentru paginile mari exista inventar sursa vs local: numar de sectiuni/componente, hero/slider, dropdown, footer si CTA-uri. Daca sursa are multe componente iar local are doar hero + cateva carduri, nu este PASS.
- Daca sursa are blog, exista audit separat `blogAudit`: pagini paginate gasite, `sourceArticleCount`, `localArticleCount`, articole importate ca entitati Blog, pagina `/blog` cu `blog-listing`, slug-uri/canonical/date/imagini pastrate sau exceptii explicite. Nu este PASS cu articole placeholder sau carduri statice.
- Pentru meniuri restaurant/catalog exista audit de categorii/produse/poze/date: count sursa, count local, produse fara poza, plus citire read-only din catalogul POS inainte de orice scriere live.
- Homepage, navigatie/dropdown, pagina categorie/meniu, pagina produs sau serviciu, footer si paginile importante au fost verificate vizual sau exista un blocaj explicit.
- Diff-urile cod/skill sunt explicate si nu includ WIP strain.

Opreste ca blocat cand lipsesc datele, permisiunea, browserul, MCP-ul sau apar aceleasi blocaje de trei ori la rand.

## Rulari Lungi

Pentru ore sau zile, foloseste automatizari Codex doar dupa ce exista URL, brand, mod si limite. Preferat: automatizare `cron` sau heartbeat cu prompt self-contained, model `gpt-5.5`, reasoning `xhigh`, si checkpoint la fiecare iteratie. Nu crea un loop infinit care scrie live fara revizuire.

Daca utilizatorul cere ca loop-ul sa traiasca in POS, nu doar in Codex, trateaza asta ca feature de produs: adauga stare persistenta (`website_copy_runs`, iteratii, findings, snapshots), lock pe website, token/rol reviewer read-only, preview/diff/dry-run inainte de writes si allowlist de modele care include `gpt-5.5` + `xhigh`.
