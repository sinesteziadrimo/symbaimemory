# Symbai — ce este și cum se leagă modulele

Symbai e un sistem complet de management pentru restaurante și hoteluri (HoReCa). Un client = o firmă cu una sau mai multe locații, fiecare pe propriul subdomeniu (ex. `restaurantultau.symbai.app`).

> Pentru navigare exactă (link la o pagină, cum ajungi acolo) folosește mereu tool-ul `gaseste_in_aplicatie` — harta reală a instanței clientului. Acest fișier explică **conceptele**, nu rutele exacte.

## Modulele principale

- **POS / Sală** — vânzarea la masă: planul de sală, mesele, notele, ospătarii. Inima operațională.
- **Comenzi clienți (QR / online)** — clienții comandă singuri de la masă prin cod QR sau din portalul web.
- **Livrări** — comenzi pentru livrare, curieri, integrări cu platforme (Glovo, Wolt, Bolt, Tazz).
- **Meniu** — ce se vinde: articole de meniu cu preț, categorii, layout.
- **Produse & Stocuri (Inventar)** — produsele fizice, gestiunile, stocul, recepții, transferuri.
- **Furnizori & Achiziții** — de la cine cumperi, comenzi de aprovizionare, prețuri furnizor.
- **Rețete & Producție** — din ce se face fiecare preparat (consum + cost); pentru fabrici: loturi, planificare, calitate.
- **Rezervări & Evenimente** — rezervări de masă, evenimente private, petreceri, (la hotel) camere.
- **Personal (Staff)** — angajați, roluri, ture, programări, salarizare.
- **Rapoarte / Analytics** — vânzări, KPI, food cost, marjă, performanță.
- **Finanțe** — casierie (registru de casă), facturi, contabilitate, e-Factură ANAF.
- **Marketing & Website** — postări social media, website-ul restaurantului, promoții, e-mailuri.
- **Setări** — imprimante, ecrane bucătărie (KDS), metode de plată, TVA, server local (edge), integrări.

## Cum se leagă (lanțul de bază)

1. **Produs** (lucru fizic, ex. „Făină 00") → are **stoc** și **preț de achiziție**.
2. **Rețetă** = ce ingrediente (produse) intră într-un preparat + cantități → dă **costul** preparatului.
3. **Articol de meniu** = lucrul vandabil, cu **preț de vânzare** → legat de produsul finit/rețetă.
4. **Vânzare** (la masă / QR / livrare) → scade **stocul** prin consumul din rețetă → alimentează **rapoartele** (vânzări, food cost, marjă).
5. **Finanțe** → încasări, registru de casă, facturi, contabilitate.

Înțelegerea acestui lanț e cheia pentru a răspunde corect la „de ce scade profitul", „de ce nu scade stocul", „ce marjă am".

## Roluri și permisiuni

Symbai e multi-rol: proprietar, manager, ospătar, bucătar etc. Fiecare vede doar ce-i permite rolul. Când dai link sau explici, ține cont că utilizatorul tău e de regulă proprietar/manager (vede tot).

## TVA România (regulă fixă)

Cotele folosite sunt **0%, 11%, 21%** (NU 5/9/19). De regulă mâncarea preparată e la 11%, unele produse la 21%. Nu schimba aceste cote.
