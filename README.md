# madaco.be — migratiegids

Dit is de volledige site, zelf nagebouwd op basis van wat er vandaag op
`mathias-ai-architect.base44.app` staat, plus het bouwdocument en de
privacyverklaring. Geen Base44-code, geen `@base44/sdk`, geen
backendfuncties. Alles is gewone HTML, CSS en JavaScript, zonder
build-stap. Dat betekent: geen `npm install`, geen `npm run build`, gewoon
bestanden die je rechtstreeks naar GitHub pusht en die Netlify serveert
zoals ze zijn.

## Wat erin zit

```
index.html            de homepage
privacy/index.html     /privacy
aiscan/index.html      /aiscan — je geteste scan, met Supabase erin gewired
assets/css/style.css   het designsysteem
assets/js/main.js      menu, ticker, contactformulier
supabase/schema.sql    het databaseschema, klaar om te plakken in Supabase
netlify.toml           hosting-configuratie, inclusief een redirect van de
                        oude /ai-scan link naar /aiscan
```

## Wat jij nog moet invullen voor het live gaat

Drie dingen staan bewust als placeholder, want die had ik niet:

1. **Je portret.** Zet je foto in `assets/img/portret.jpg` (ongeveer
   4:5-verhouding, bv. 900×1125 pixels). Zolang dat bestand er niet is,
   toont de hero een duidelijke placeholder-tekst in plaats van een kapotte
   afbeelding.
2. **Ondernemingsgegevens in de voettekst.** In `index.html` (helemaal
   onderaan) en in `privacy/index.html` staan `[adres]`,
   `[ondernemingsvorm]` en `[BE 0xxx.xxx.xxx]`. Vul die in zodra je ze bij
   de hand hebt, dat is wettelijk verplicht zodra de site gegevens
   verzamelt (Wetboek van economisch recht).
3. **Supabase-sleutels.** Zie hieronder.

## Stappenplan

Volg deze volgorde. Niets bij Base44 opzeggen voor stap 6 werkt.

### 1. Supabase opzetten

1. Maak een gratis project op [supabase.com](https://supabase.com), regio
   **Frankfurt** of **Ierland** (kan achteraf niet meer gewijzigd worden).
2. Open **SQL Editor**, plak de inhoud van `supabase/schema.sql`, klik
   **Run**.
3. Ga naar **Project Settings > API**. Kopieer de **Project URL** en de
   **anon public** key.
4. Vul die twee waarden in op de aangeduide plek bovenaan:
   - `assets/js/main.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
   - `aiscan/index.html` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, iets verder
     naar beneden dan bij de homepage)

### 2. Lokaal testen

Met Python (of eender welke simpele static server) vanuit deze map:

```
python3 -m http.server 8080
```

Open `http://localhost:8080`, klik alles aan: menu, de drie ankerlinks,
`/aiscan/`, `/privacy/`, vul het contactformulier in en doe een scan tot
en met de download. Check in het Supabase-dashboard (**Table Editor**) of
er een rij bijkomt in `scans`, `contact` en `events`.

### 3. Nieuwe, schone GitHub-repository

Bewust een **nieuwe** repo, niet gekoppeld aan Base44:

```
cd madaco-site
git init
git add .
git commit -m "Eerste versie van madaco.be, losstaand van Base44"
git branch -M main
git remote add origin https://github.com/<jouw-account>/madaco-be.git
git push -u origin main
```

### 4. Netlify koppelen

1. Nieuwe site op [app.netlify.com](https://app.netlify.com) > **Add new
   site > Import an existing project** > kies de GitHub-repo.
2. Build command: laat leeg. Publish directory: `.` (de hoofdmap).
3. Deploy. Je krijgt een tijdelijk adres zoals
   `iets-random.netlify.app`, test daar alles nog eens grondig, ook op je
   gsm.

### 5. DNS omzetten bij EasyHost

Netlify geeft je bij het toevoegen van je domein een vast IP-adres voor
het A-record (meestal `75.2.60.5`, maar controleer het scherm dat Netlify
toont, dat is de bron van waarheid) en een `<jouw-site>.netlify.app`
CNAME-doel voor www. Pas enkel deze twee records aan bij EasyHost, **laat
de rest staan**:

| Type  | Naam         | Nieuwe waarde                  |
|-------|--------------|---------------------------------|
| A     | madaco.be    | het IP dat Netlify toont        |
| CNAME | www.madaco.be| `<jouw-site>.netlify.app`       |

Niet aanraken: de `ftp` A-record, en alle mailprotect-records
(`autoconfig`, `autodiscover`, `mail`), plus je MX- en TXT-records. Je
mail loopt daarover, dat mag niet meeverhuizen.

DNS-wijzigingen hebben tijd nodig om door te sijpelen (meestal snel omdat
de TTL op 300 staat, kan tot een paar uur duren). Test pas op
`https://madaco.be` als het doorgekomen is.

### 6. Base44 opzeggen

Pas als madaco.be zelf alles goed toont: scan, contactformulier,
privacypagina, alle links. Dan pas het abonnement stopzetten.

## Nog open, in volgorde van belang

1. Registratie als dienstverlener voor de kmo-portefeuille. Pas daarna mag
   de regel over subsidies terug op de site (nu bewust weggelaten bij
   stap 3 van "Wat ik doe").
2. Het rapport automatisch laten doormailen na de scan. Dat vraagt een
   verzendende dienst (bv. Resend of Postmark) plus SPF, DKIM en DMARC op
   madaco.be. Voorlopig download je het rapport zelf, dat werkt al
   volledig.
3. Je exacte ondernemingsvorm en ondernemingsnummer voor de voettekst en
   de privacypagina.
4. Welke mailprovider je gebruikt, voor in de tabel op de privacypagina.
