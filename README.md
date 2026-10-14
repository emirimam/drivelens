# DriveLens

Lijep, detaljan izvještaj o vožnji iz CSV izvoza aplikacija **MyDS, MyCitroën, MyPeugeot i MyOpel**.
*A beautiful driving report from the trips CSV exported by the MyDS, MyCitroën, MyPeugeot and MyOpel apps.*

**Live:** https://drivelens-one.vercel.app

## Šta radi

- **Struja vs. gorivo**: automatski prepoznaje plug-in hibrid. Vožnje bez upisane potrošnje su na struju, a električni dio hibridnih vožnji se procjenjuje.
- **Troškovi i uštede**: cijena goriva po datumu (ručno ili gotov FBiH prosjek), cijena struje, trošak na 100 km, ušteda i CO₂.
- **Gauge prikazi**: udio struje, potrošnja, prosječna brzina i trošak na 100 km.
- **Navike**: mjesečni kilometri (klik na mjesec ga izuzima iz statistike), toplotna mapa dan × sat, kilometri po danu u sedmici, dužina vožnji.
- **Mjesta**: najčešća odredišta na mapi, s automatski prepoznatom kućom i poslom.
- **Rekordi**: najduži dan, najduža i najbrža vožnja, najraniji polazak i nizovi.
- **Pametno čišćenje**: popravlja datume nakon resetovanog sata u autu (npr. 2007. godina) i pronalazi rupe u logu poređenjem s brojačem kilometara, uz procjenu troška za njih.
- **Privatnost**: sve se računa lokalno u pregledniku i nijedan podatak se ne šalje na server.
- **Jezik i izgled**: bosanski i engleski, tamna i svijetla tema, prilagođeno mobitelu, izvoz u PDF preko štampe.

## Podržani formati

Izvoz s 12 kolona (datum, polazak, dolazak, trajanje, koordinate polaska i odredišta, udaljenost, kilometraža, potrošnja, cijena, trošak, kategorija) na bilo kojem jeziku.

- **Kolone:** prepoznaju se po ključnim riječima, a ako se ne prepoznaju, po redoslijedu.
- **Jedinice:** km ili milje; potrošnja u km/l, l/100 km, mpg ili kWh/100 km.
- **Formati:** `;` ili `,` kao separator, decimalni zarez ili tačka, datumi u formatu `dd.mm.yyyy.`, `dd/mm/yyyy`, `mm/dd/yyyy` i `yyyy-mm-dd`.

## Razvoj

```bash
npm install
npm run dev      # lokalni server
npm test         # vitest
npm run build    # produkcijski build u dist/
```

Stack: Vite, React 19, TypeScript (strict), Tailwind CSS 4, Apache ECharts (gauge, heatmap, polar, donut), Leaflet i OpenStreetMap, PapaParse.

Struktura:

- `src/lib/parse.ts`: robustan parser CSV-a (kolone, jedinice, datumi, ispravka resetovanog sata, prepoznavanje pogona)
- `src/lib/analyze.ts`: sva statistika (energija, troškovi, rupe, mjesta, rekordi)
- `src/lib/charts.ts`: konfiguracije grafikona
- `src/lib/demo.ts`: sintetički demo podaci (nisu stvarni podaci nijedne osobe)

## Napomena

Nezavisan projekat. Nije povezan sa Stellantis, DS Automobiles, Citroën, Peugeot ni Opel. Nazivi brendova koriste se samo za opis kompatibilnosti. Procjene su informativne.

## Licenca

MIT
