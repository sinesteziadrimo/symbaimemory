# Notificări push pentru marketing (web + mobil)

Push = mesaj scurt care apare pe ecranul clientului (telefon sau browser) chiar dacă nu e activ în aplicație. E cel mai direct și mai imediat canal al Symbai. Tocmai pentru că e atât de direct, abuzul duce la dezabonări — așa că platforma aplică reguli de bun-simț automat.

## Două tipuri de push — nu le amesteca
- **Tranzacțional** — informează clientul despre ceva ce A CERUT sau A FĂCUT: comanda e gata, rezervarea e confirmată, masa e liberă, puncte primite. Pleacă mereu, fără filtre, la orice oră. Le pune aplicația automat.
- **Marketing** — promovează ceva: oferte, happy hour, produs nou, „ne-a fost dor de tine". Trece prin filtre (vezi mai jos). Astea le creezi tu, ca proprietar/manager.

Legea (GDPR/ePrivacy) și platformele (Apple/Google) cer ca marketingul să fie separat de tranzacțional și să respecte alegerea clientului. Symbai face separarea automat.

## Cum ajunge push la client (abonarea)
- **Mobil:** clientul instalează aplicația Symbai a localului și acceptă notificările. Primește un „token" de dispozitiv.
- **Web (browser):** în portalul web clientul apasă „Activează notificările" și acceptă în browser. Pe **iPhone**, push în browser funcționează DOAR dacă clientul a adăugat portalul pe ecranul principal (Add to Home Screen) — altfel Apple nu permite. Pe Android/desktop merge direct.
- **Important:** push merge DOAR la cine s-a abonat. De aceea, înainte de orice campanie, verifici câte dispozitive ai în segment (vezi skill `trimite-notificare-push`). Dacă sunt puține, prioritatea e să crești baza de abonați (încurajezi instalarea aplicației / acceptarea notificărilor).

## Filtrele aplicate marketingului (automat)
1. **Consimțământ / preferințe** — dacă clientul a oprit push sau a oprit topicul respectiv (oferte/fidelitate/evenimente/produse noi), nu primește.
2. **Dezabonare (suprimare)** — clienții pe lista de opt-out sunt săriți.
3. **Oră de liniște** — implicit 21:00–08:00, în **fusul orar al clientului** (nu al serverului), ca să nu trezești pe nimeni.
4. **Limită de frecvență** — implicit ~1–2 mesaje de marketing pe săptămână per client. Peste asta, mesajul e amânat/sărit. Statistic, peste 2–5/săptămână mulți se dezabonează.

Clienții filtrați apar ca „săriți", nu ca „eșec" — e normal și sănătos.

## Ce funcționează în HoReCa / retail (idei de campanii)
- **Oferta zilei / meniul prânzului** — un push pe la 10:30.
- **Happy hour** — un push pe la 16:30–17:00.
- **Re-activare** — clienți care n-au mai venit de 30/60 zile, cu o ofertă de revenire.
- **Fidelitate** — „mai ai 2 puncte până la cafeaua gratuită", „puncte care expiră în 7 zile", urcare de nivel.
- **Aniversare** — reducere de ziua clientului (segment „aniversare în următoarele 14 zile").
- **Produs nou / revenit în stoc** — pentru magazinul online.
- **Eveniment** — reminder pentru o seară tematică / rezervare.
- **Cerere de recenzie** — la câteva ore după o vizită bună.

## Măsoară impactul corect
- **CTR** = câți au deschis / câți au primit. Pentru push, deschiderile bune sunt 3–10%.
- **Grup de control (holdout)** — lași un mic procent (ex. 10%) FĂRĂ push și compari: așa vezi dacă push a adus vânzări în PLUS, nu doar vânzări care s-ar fi întâmplat oricum.
- **A/B** — testezi două titluri/texte pe câte o jumătate și vezi care merge mai bine.
- **Rata de dezabonare** — dacă crește după o campanie, ai trimis prea des sau prea puțin relevant.

## Reguli de aur
- Un push bun = scurt, clar, cu un singur îndemn și un motiv (ofertă, termen limită).
- Trimite RAR și RELEVANT. Mai bine un push țintit pe segmentul potrivit decât unul general la toți.
- Nu repeta același mesaj pe push + email + WhatsApp în aceeași zi.
- Respectă ora: nimeni nu vrea oferte la miezul nopții (oricum e blocat).
- Dă mereu clientului control: preferințe pe topicuri + dezabonare ușoară. Un client care poate alege ce primește rămâne abonat mai mult.

Operațional (ce tool folosești pentru ce): vezi skill-ul `trimite-notificare-push`.
