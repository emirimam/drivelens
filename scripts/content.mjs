// Content for the static, crawlable pages (guides, articles, FAQ hub).
// Written in Bosnian on purpose: local-language queries have little competition.

export const SITE = 'https://drivelens-one.vercel.app'

const APPS = {
  myds: { app: 'MyDS', brand: 'DS', models: 'DS 3, DS 4, DS 7 i DS 9 (uključujući E-Tense plug-in hibride)', file: 'myds-trips-2026-09-19.csv' },
  mycitroen: { app: 'MyCitroën', brand: 'Citroën', models: 'C4, C5 Aircross (i Hybrid), C5 X, ë-C4 i ostale povezane modele', file: 'mycitroen-trips.csv', source: { label: 'Citroën: pristup i izvoz podataka o vožnji u aplikaciji MyCitroën (FR)', url: 'https://citroen.stellantis-customercare.com/citroen/s/article/Comment-puis-je-acc%C3%A9der-et-exporter-importer-mes-donn%C3%A9es-de-conduite-dans-l-application-MyCitro%C3%ABn-FR?language=fr' } },
  mypeugeot: { app: 'MyPeugeot', brand: 'Peugeot', models: '208, 308, 2008, 3008 i 5008 (uključujući Hybrid i e-modele)', file: 'mypeugeot-trips.csv' },
  myopel: { app: 'MyOpel', brand: 'Opel', models: 'Corsa, Astra, Mokka i Grandland (uključujući Hybrid i Electric)', file: 'myopel-trips.csv', note: 'Kod MyOpel aplikacije izvoz putovanja ide preko usluge My Trip Report. Ako ne vidiš opciju za izvoz, provjeri u aplikaciji da je ta usluga aktivirana.' },
}

function guide(key) {
  const a = APPS[key]
  return {
    kind: 'guide',
    slug: `vodic/izvoz-voznji-${key}`,
    title: `Kako izvesti podatke o vožnji iz ${a.app} aplikacije (CSV) – vodič`,
    description: `Korak po korak: kako iz ${a.app} aplikacije izvesti sve vožnje u CSV, poslati datoteku sebi i dobiti izvještaj o potrošnji, struji i troškovima za svoj ${a.brand}.`,
    h1: `Kako izvesti vožnje iz ${a.app} aplikacije`,
    kicker: 'Vodič',
    app: a,
    steps: [
      { t: 'Otvori aplikaciju i provjeri da je auto povezan', d: `Prijavi se u ${a.app} i provjeri da aplikacija prikazuje tvoj ${a.brand}. Vožnje se bilježe samo ako su povezane usluge (Connect) aktivne i auto ima mobilnu mrežu.`, screen: ['Moj auto', `${a.brand} · povezan`, 'Vožnje', 'Usluge'], hl: 1 },
      { t: 'Otvori odjeljak s vožnjama', d: 'Dodirni Vožnje (na engleskom Trips, njemački Fahrten, francuski Trajets). Tu je lista svih vožnji s kilometrima, trajanjem i potrošnjom.', screen: ['Vožnje', '12,4 km · 18 min', '8,1 km · 11 min', '196 km · 2 h 05'], hl: 0 },
      { t: 'Izaberi period “od početka”', d: 'U filteru perioda izaberi najduži period (Od početka / Since the start / Depuis l’origine). Tako dobiješ cijelu historiju, a ne samo zadnji mjesec.', screen: ['Period', 'Ovaj mjesec', 'Zadnja 3 mjeseca', 'Od početka ✓'], hl: 3 },
      { t: 'Dodirni Izvoz i izaberi CSV', d: 'Dodirni ikonu za dijeljenje ili izvoz. Aplikacija napravi CSV datoteku sa svim vožnjama iz izabranog perioda. Neke verzije nude i .myp backup; i taj format DriveLens čita.', screen: ['Izvoz', 'CSV ✓', '.myp backup', 'Odustani'], hl: 1 },
      { t: 'Pošalji datoteku sebi', d: 'Izaberi Mail, WhatsApp, Google Drive ili Spremi u Files. Datoteku nemoj prvo otvarati u Excelu i spremati: Excel zna pretvoriti 14.2 km u datum 14. februar.', screen: ['Podijeli', 'Mail', 'Google Drive', 'Spremi u Files'], hl: 1 },
      { t: 'Učitaj CSV u DriveLens', d: 'Otvori DriveLens i prevuci datoteku. Izvještaj se pojavi odmah, a podaci ostaju na tvom uređaju.', screen: ['DriveLens', 'Prevuci CSV ovdje', a.file, 'Izvještaj ✓'], hl: 2 },
    ],
    extra: a.note,
    source: a.source,
  }
}

const P = (s) => `<p>${s}</p>`

export const PAGES = [
  guide('myds'),
  guide('mycitroen'),
  guide('mypeugeot'),
  guide('myopel'),
  {
    kind: 'article',
    slug: 'clanci/stvarna-potrosnja-phev-struja-vs-gorivo',
    title: 'Stvarna potrošnja plug-in hibrida: struja vs. gorivo (godina podataka)',
    description: 'Koliko PHEV stvarno vozi na struju, koliko troši kad motor radi i koliko košta 100 km. Analiza stvarnih podataka iz DS 7 E-Tense za skoro 10.000 km.',
    h1: 'Stvarna potrošnja PHEV vozila: struja vs. gorivo',
    kicker: 'Članak',
    date: '2026-10-14',
    body: [
      P('Katalog kaže 1–2 l/100 km, ali to je WLTP mjerenje sa punom baterijom. U stvarnosti potrošnja plug-in hibrida zavisi od toga koliko često puniš i koliko voziš autoputem. Zato smo pogledali stvarne podatke iz aplikacije MyDS za jedan DS 7 E-Tense, u periodu od oktobra 2025. do septembra 2026.'),
      '<h2>Podaci na kojima se zasniva analiza</h2>',
      '<ul><li><b>9.721 km</b> u 772 zabilježene vožnje (bez probnog mjeseca)</li><li>Vožnja pretežno grad i posao, uz povremena putovanja od 150 do 250 km</li><li>Punjenje kod kuće, gotovo svaki dan</li></ul>',
      '<h2>Koliko se stvarno vozi na struju?</h2>',
      P('Oko <b>59 % kilometara</b> pređeno je na struju. 4.336 km bilo je potpuno bez benzina, a ostatak električnih kilometara su dijelovi hibridnih vožnji. Čak 64 % dana auto nije potrošio ni kap benzina.'),
      P('Kako to znamo? Kad vožnja nije potrošila gorivo, aplikacija ostavi potrošnju praznu. Najduža takva vožnja imala je 44 km, što odgovara stvarnom električnom dometu.'),
      '<h2>Koliko troši kad motor radi?</h2>',
      P('Na putovanjima od 150 km i više, gdje je baterija mali dio, potrošnja je bila <b>oko 6,7 l/100 km</b>. Na svim vožnjama na kojima je motor radio, prosjek je 5,4 l/100 km, jer dio tih kilometara ipak ide na struju.'),
      '<h2>Koliko košta 100 km?</h2>',
      '<table><thead><tr><th>Način vožnje</th><th>KM / 100 km</th></tr></thead><tbody><tr><td>Samo benzin (motor)</td><td>~20,5</td></tr><tr><td>Samo struja (23 kWh × 0,27 KM)</td><td>~6,2</td></tr><tr><td>Stvarni miks</td><td>~12,1</td></tr></tbody></table>',
      P('Za tih 9.721 km gorivo je koštalo oko 824 KM, a struja oko 354 KM. Da je sve išlo na benzin, trošak bi bio oko 1.790 KM, pa je ušteda oko <b>1.030 KM za deset mjeseci</b>.'),
      '<h2>Šta najviše utiče na potrošnju</h2>',
      '<ul><li><b>Redovno punjenje.</b> Najzeleniji mjesec (mart) imao je 94 % kilometara na struju i samo 2 litre benzina.</li><li><b>Putovanja.</b> Maj i august, mjeseci s dugim putovanjima, nose skoro polovinu troška za benzin.</li><li><b>Zima.</b> Domet pada, a kratke vožnje češće upale motor zbog grijanja.</li><li><b>Punjenje motorom (e-Save).</b> U probnom mjesecu potrošnja na autoputu bila je 13 % veća.</li></ul>',
      P('Svaki auto i vozač su drugačiji. Najtačniju sliku dobiješ iz vlastitih podataka: izvezi vožnje iz aplikacije i učitaj ih u DriveLens.'),
    ],
  },
  {
    kind: 'article',
    slug: 'clanci/peugeot-3008-hybrid-stvarna-potrosnja',
    title: 'Koliko stvarno troši Peugeot 3008 Hybrid na struju i benzin?',
    description: 'Stvarna potrošnja Peugeot 3008 Hybrid (PHEV): koliko kilometara ide na struju, koliko troši na autoputu i kako izmjeriti svoju potrošnju iz MyPeugeot aplikacije.',
    h1: 'Koliko stvarno troši Peugeot 3008 Hybrid na struju i benzin?',
    kicker: 'Članak',
    date: '2026-10-14',
    body: [
      P('Peugeot 3008 Hybrid i Hybrid4 plug-in hibridi dijele platformu i pogonski sklop s modelima kao što su DS 7 E-Tense, Citroën C5 Aircross Hybrid i Opel Grandland Hybrid: benzinski 1.6 turbo motor, elektromotor i bateriju za oko 50–60 km vožnje na struju po WLTP-u. Zato se i u stvarnoj vožnji ponašaju vrlo slično.'),
      '<h2>Tri broja koja te zanimaju</h2>',
      '<ul><li><b>Udio struje.</b> Uz svakodnevno punjenje i kraće relacije realno je 50–70 % kilometara na struju.</li><li><b>Potrošnja kad motor radi.</b> Kad je baterija prazna, na autoputu računaj otprilike 6–8 l/100 km, zavisno od brzine i opterećenja.</li><li><b>Kombinovana potrošnja.</b> Testovi s punom baterijom pokazuju i oko 4,5 l/100 km, ali stvarni prosjek zavisi isključivo od tvog načina vožnje i punjenja.</li></ul>',
      '<h2>Primjer iz stvarnih podataka</h2>',
      P('Na srodnom DS 7 E-Tense u 9.721 km izmjereno je 59 % vožnje na struju, 6,7 l/100 km na putovanjima i trošak od oko 12 KM na 100 km. Detalji su u članku <a href="/clanci/stvarna-potrosnja-phev-struja-vs-gorivo/">Stvarna potrošnja PHEV vozila: struja vs. gorivo</a>.'),
      '<h2>Kako izmjeriti potrošnju svog 3008</h2>',
      '<ol><li>Izvezi vožnje iz MyPeugeot aplikacije (<a href="/vodic/izvoz-voznji-mypeugeot/">vodič</a>).</li><li>Učitaj CSV u DriveLens.</li><li>U postavkama upiši cijenu goriva i struje.</li></ol>',
      P('Dobiješ udio struje, potrošnju kad motor radi, trošak po mjesecima i uštedu u odnosu na vožnju samo na benzin.'),
    ],
  },
  {
    kind: 'article',
    slug: 'clanci/da-li-se-isplati-puniti-opel-grandland-hybrid-svaki-dan',
    title: 'Da li se isplati puniti Opel Grandland Hybrid svaki dan?',
    description: 'Računica za Opel Grandland Hybrid (PHEV): koliko košta kilometar na struju, a koliko na benzin, koliko se uštedi svakodnevnim punjenjem i šta je s baterijom.',
    h1: 'Da li se isplati puniti Opel Grandland Hybrid svaki dan?',
    kicker: 'Članak',
    date: '2026-10-14',
    body: [
      P('Kratak odgovor: da, ako ti je svakodnevna ruta unutar električnog dometa. Plug-in hibrid koji se ne puni samo je teži benzinac.'),
      '<h2>Računica</h2>',
      '<table><thead><tr><th></th><th>Struja</th><th>Benzin</th></tr></thead><tbody><tr><td>Potrošnja na 100 km</td><td>~23 kWh (iz utičnice)</td><td>~7 l</td></tr><tr><td>Cijena</td><td>0,27 KM/kWh</td><td>~3 KM/l</td></tr><tr><td><b>Trošak na 100 km</b></td><td><b>~6 KM</b></td><td><b>~21 KM</b></td></tr></tbody></table>',
      P('Za 40 km dnevno to je oko 2,5 KM na struju umjesto 8,4 KM na benzin. To je oko <b>6 KM dnevno</b>, odnosno oko <b>1.400 KM godišnje</b> za 250 radnih dana.'),
      '<h2>A baterija?</h2>',
      P('Proizvođač ostavlja dio kapaciteta kao rezervu, pa svakodnevno punjenje ne troši bateriju više nego što je predviđeno. Ako auto stoji danima, ne moraš je držati na 100 %.'),
      '<h2>Kada se ne isplati</h2>',
      '<ul><li>Ako uglavnom voziš duge relacije autoputem.</li><li>Ako je struja kod tebe izuzetno skupa (npr. javni brzi punjači).</li><li>Ako bateriju puniš motorom (e-Save) – to troši više benzina.</li></ul>',
      P('Tačnu uštedu svog Grandlanda vidiš kad izvezeš vožnje iz MyOpel aplikacije (<a href="/vodic/izvoz-voznji-myopel/">vodič</a>) i učitaš ih u DriveLens.'),
    ],
  },
  {
    kind: 'article',
    slug: 'clanci/e-save-punjenje-baterije-motorom',
    title: 'Da li punjenje baterije motorom (e-Save) ima smisla kod PHEV-a?',
    description: 'Šta se desi s potrošnjom kad plug-in hibrid puni bateriju benzinskim motorom (e-Save / Charge mode). Stvarni podaci: potrošnja na autoputu raste oko 13 %.',
    h1: 'Punjenje baterije motorom (e-Save): da li ima smisla?',
    kicker: 'Članak',
    date: '2026-10-14',
    body: [
      P('Mnogi PHEV modeli nude način rada u kojem motor tokom vožnje puni bateriju (e-Save, Charge, Battery Charge). Zvuči kao besplatna struja, ali nije.'),
      '<h2>Šta pokazuju stvarni podaci</h2>',
      P('U probnom mjesecu u kojem je baterija punjena motorom na autoputu, DS 7 E-Tense trošio je <b>7,5 l/100 km</b> na putovanjima, naspram uobičajenih 6,7 l/100 km. To je oko 13 % više. Vožnje s benzinom imale su prosjek 5,9 umjesto 5,4 l/100 km.'),
      P('Struja napunjena motorom kasnije se troši u gradu, ali je plaćena benzinom, i to s gubicima pri pretvaranju energije.'),
      '<h2>Kada e-Save ima smisla</h2>',
      '<ul><li>Kad na kraju puta moraš voziti samo na struju (zona niske emisije).</li><li>Kad želiš sačuvati postojeću bateriju za grad, bez dodatnog punjenja (samo “Save”, ne “Charge”).</li></ul>',
      P('Savjet: za poštenu statistiku takve mjesece izuzmi iz prosjeka. U DriveLensu je dovoljan jedan klik na mjesec u grafikonu.'),
    ],
  },
]

export const HUBS = [
  { slug: 'vodic', title: 'Vodiči: kako izvesti vožnje iz MyDS, MyCitroën, MyPeugeot i MyOpel', description: 'Vodiči korak po korak za izvoz podataka o vožnji (CSV) iz Stellantis aplikacija MyDS, MyCitroën, MyPeugeot i MyOpel.', h1: 'Vodiči za izvoz podataka o vožnji', kind: 'guide' },
  { slug: 'clanci', title: 'Članci o potrošnji plug-in hibrida i troškovima vožnje', description: 'Stvarna potrošnja PHEV vozila, struja vs. gorivo, isplativost punjenja i savjeti na osnovu stvarnih podataka.', h1: 'Članci', kind: 'article' },
]
