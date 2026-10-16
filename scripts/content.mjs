// Content for the static, crawlable pages (guides, articles, FAQ, hubs) in bs/en/de/fr.
// Pages that are translations of each other share an `id`, used for hreflang links.
import { ARTICLES, ARTICLE_DATE } from './content-articles.mjs'

export const SITE = 'https://drivelens-one.vercel.app'
export const LANGS = ['bs', 'en', 'de', 'fr']
export const HOME_PATH = { bs: '', en: 'en', de: 'de', fr: 'fr' }

// Homepage title/description per language (the app itself, prerendered at /, /en/, /de/, /fr/).
export const HOME = {
  bs: {
    title: 'DriveLens – izvještaj o vožnji i potrošnji iz MyDS, MyCitroën, MyPeugeot i MyOpel',
    description: 'Besplatan izvještaj iz CSV izvoza MyDS, MyCitroën, MyPeugeot i MyOpel aplikacije: koliko voziš na struju, stvarna potrošnja plug-in hibrida, troškovi, ušteda, mapa i rekordi. Podaci ostaju na tvom uređaju.',
    ogTitle: 'DriveLens – izvještaj o vožnji za DS, Citroën, Peugeot i Opel',
    features: ['Udio vožnje na struju za plug-in hibride', 'Stvarna potrošnja kad motor radi', 'Troškovi po cijenama goriva za tvoju državu', 'Procjena uštede', 'Ispravka resetovanog sata u autu', 'Pronalaženje rupa u logu', 'Mapa najčešćih odredišta', 'Slika izvještaja za dijeljenje'],
  },
  en: {
    title: 'DriveLens – driving and consumption report from MyDS, MyCitroën, MyPeugeot and MyOpel',
    description: 'Free report from your MyDS, MyCitroën, MyPeugeot or MyOpel trip export (CSV): how much you drive on electricity, real plug-in hybrid consumption, costs, savings, map and records. Your data stays on your device.',
    ogTitle: 'DriveLens – driving report for DS, Citroën, Peugeot and Opel',
    features: ['Electric share for plug-in hybrids', 'Real consumption with the engine running', 'Costs using fuel prices for your country', 'Savings estimate', 'Fixes a reset car clock', 'Finds gaps in the trip log', 'Map of frequent destinations', 'Shareable report image'],
  },
  de: {
    title: 'DriveLens – Fahrt- und Verbrauchsbericht aus MyDS, MyCitroën, MyPeugeot und MyOpel',
    description: 'Kostenloser Bericht aus deinem Fahrtenexport (CSV) von MyDS, MyCitroën, MyPeugeot oder MyOpel: wie viel du elektrisch fährst, realer Plug-in-Hybrid-Verbrauch, Kosten, Ersparnis, Karte und Rekorde. Deine Daten bleiben auf deinem Gerät.',
    ogTitle: 'DriveLens – Fahrbericht für DS, Citroën, Peugeot und Opel',
    features: ['Elektrischer Anteil bei Plug-in-Hybriden', 'Realer Verbrauch mit laufendem Motor', 'Kosten mit den Kraftstoffpreisen deines Landes', 'Ersparnis-Schätzung', 'Korrigiert eine zurückgesetzte Fahrzeuguhr', 'Findet Lücken im Fahrtenprotokoll', 'Karte der häufigsten Ziele', 'Berichtsbild zum Teilen'],
  },
  fr: {
    title: 'DriveLens – rapport de conduite et de consommation depuis MyDS, MyCitroën, MyPeugeot et MyOpel',
    description: 'Rapport gratuit à partir de l’export de trajets (CSV) de MyDS, MyCitroën, MyPeugeot ou MyOpel : part de conduite électrique, consommation réelle d’un hybride rechargeable, coûts, économies, carte et records. Vos données restent sur votre appareil.',
    ogTitle: 'DriveLens – rapport de conduite pour DS, Citroën, Peugeot et Opel',
    features: ['Part électrique des hybrides rechargeables', 'Consommation réelle moteur allumé', 'Coûts selon les prix des carburants de votre pays', 'Estimation des économies', 'Corrige une horloge de voiture réinitialisée', 'Repère les trous dans l’historique', 'Carte des destinations fréquentes', 'Image du rapport à partager'],
  },
}

export const UI = {
  bs: {
    locale: 'bs_BA', app: '/', nav: ['Aplikacija', 'Vodiči', 'Članci', 'Pitanja'],
    footer: 'DriveLens · besplatan izvještaj o vožnji iz MyDS, MyCitroën, MyPeugeot i MyOpel podataka. Nezavisan projekat, nije povezan sa Stellantis, DS Automobiles, Citroën, Peugeot ni Opel. Procjene su informativne.',
    ctaT: 'Pretvori svoj CSV u izvještaj', ctaD: 'Struja vs. gorivo, troškovi, ušteda, mapa i rekordi. Besplatno, a podaci ostaju na tvom uređaju.', ctaB: 'Otvori DriveLens →',
    readAlso: 'Pročitaj i ovo', guideKicker: 'Vodič', articleKicker: 'Članak',
    validFor: (m) => `Vodič vrijedi za ${m}. Nazivi menija mogu se malo razlikovati zavisno od verzije aplikacije i jezika telefona.`,
    shot: 'Snimak ekrana (iPhone)', ill: 'Ilustracija ekrana', step: 'KORAK', illAlt: 'Ilustracija koraka',
    problemsH: 'Česti problemi',
    problems: ['<b>Izvoz je prazan ili ima samo par vožnji.</b> Provjeri izabrani period i da su povezane usluge aktivne. Vožnje koje auto nije poslao (bez mreže, u inostranstvu) ne mogu se izvesti.', '<b>Datumi iz 2007. godine.</b> Sat u autu je resetovan. DriveLens takve vožnje sam vrati na prave datume.', '<b>Excel pokvari brojeve.</b> CSV ne otvaraj i ne spremaj u Excelu prije učitavanja; učitaj originalnu datoteku.'],
    source: 'Izvor', more: 'Više →', langLabel: 'Jezik',
  },
  en: {
    locale: 'en_GB', app: '/en/', nav: ['App', 'Guides', 'Articles', 'FAQ'],
    footer: 'DriveLens · a free driving report from MyDS, MyCitroën, MyPeugeot and MyOpel data. Independent project, not affiliated with Stellantis, DS Automobiles, Citroën, Peugeot or Opel. Estimates are for information only.',
    ctaT: 'Turn your CSV into a report', ctaD: 'Electricity vs. fuel, costs, savings, map and records. Free, and your data stays on your device.', ctaB: 'Open DriveLens →',
    readAlso: 'Read next', guideKicker: 'Guide', articleKicker: 'Article',
    validFor: (m) => `This guide applies to ${m}. Menu names may differ slightly depending on the app version and your phone’s language.`,
    shot: 'Screenshot (iPhone, app in Bosnian)', ill: 'Screen illustration', step: 'STEP', illAlt: 'Illustration of step',
    problemsH: 'Common problems',
    problems: ['<b>The export is empty or has only a few trips.</b> Check the selected period and that connected services are active. Trips the car never sent (no coverage, abroad) can’t be exported.', '<b>Dates from 2007.</b> The car’s clock was reset. DriveLens moves those trips back to their real dates automatically.', '<b>Excel breaks the numbers.</b> Don’t open and save the CSV in Excel before loading it; load the original file.'],
    source: 'Source', more: 'More →', langLabel: 'Language',
  },
  de: {
    locale: 'de_DE', app: '/de/', nav: ['App', 'Anleitungen', 'Artikel', 'Fragen'],
    footer: 'DriveLens · kostenloser Fahrbericht aus MyDS-, MyCitroën-, MyPeugeot- und MyOpel-Daten. Unabhängiges Projekt, nicht verbunden mit Stellantis, DS Automobiles, Citroën, Peugeot oder Opel. Alle Werte sind Schätzungen.',
    ctaT: 'Mach aus deiner CSV einen Bericht', ctaD: 'Strom vs. Kraftstoff, Kosten, Ersparnis, Karte und Rekorde. Kostenlos, und deine Daten bleiben auf deinem Gerät.', ctaB: 'DriveLens öffnen →',
    readAlso: 'Weiterlesen', guideKicker: 'Anleitung', articleKicker: 'Artikel',
    validFor: (m) => `Die Anleitung gilt für ${m}. Menünamen können je nach App-Version und Telefonsprache leicht abweichen.`,
    shot: 'Screenshot (iPhone, App auf Bosnisch)', ill: 'Bildschirm-Illustration', step: 'SCHRITT', illAlt: 'Illustration zu Schritt',
    problemsH: 'Häufige Probleme',
    problems: ['<b>Der Export ist leer oder enthält nur wenige Fahrten.</b> Prüfe den gewählten Zeitraum und ob die vernetzten Dienste aktiv sind. Fahrten, die das Auto nie gesendet hat (kein Netz, Ausland), lassen sich nicht exportieren.', '<b>Datumsangaben aus 2007.</b> Die Uhr im Auto wurde zurückgesetzt. DriveLens setzt diese Fahrten automatisch auf ihr echtes Datum.', '<b>Excel zerstört die Zahlen.</b> Öffne und speichere die CSV nicht in Excel, bevor du sie lädst; lade die Originaldatei.'],
    source: 'Quelle', more: 'Mehr →', langLabel: 'Sprache',
  },
  fr: {
    locale: 'fr_FR', app: '/fr/', nav: ['Application', 'Guides', 'Articles', 'Questions'],
    footer: 'DriveLens · rapport de conduite gratuit à partir des données MyDS, MyCitroën, MyPeugeot et MyOpel. Projet indépendant, sans lien avec Stellantis, DS Automobiles, Citroën, Peugeot ou Opel. Les estimations sont indicatives.',
    ctaT: 'Transformez votre CSV en rapport', ctaD: 'Électricité ou carburant, coûts, économies, carte et records. Gratuit, et vos données restent sur votre appareil.', ctaB: 'Ouvrir DriveLens →',
    readAlso: 'À lire aussi', guideKicker: 'Guide', articleKicker: 'Article',
    validFor: (m) => `Ce guide s’applique aux ${m}. Les noms des menus peuvent varier légèrement selon la version de l’application et la langue du téléphone.`,
    shot: 'Capture d’écran (iPhone, application en bosnien)', ill: 'Illustration de l’écran', step: 'ÉTAPE', illAlt: 'Illustration de l’étape',
    problemsH: 'Problèmes fréquents',
    problems: ['<b>L’export est vide ou ne contient que quelques trajets.</b> Vérifiez la période choisie et que les services connectés sont actifs. Les trajets que la voiture n’a jamais envoyés (sans réseau, à l’étranger) ne peuvent pas être exportés.', '<b>Des dates de 2007.</b> L’horloge de la voiture a été réinitialisée. DriveLens remet automatiquement ces trajets à leur vraie date.', '<b>Excel abîme les chiffres.</b> N’ouvrez pas et n’enregistrez pas le CSV dans Excel avant de le charger ; chargez le fichier d’origine.'],
    source: 'Source', more: 'En savoir plus →', langLabel: 'Langue',
  },
}

const MODELS = {
  myds: { bs: 'DS 3, DS 4, DS 7 i DS 9 (uključujući E-Tense plug-in hibride)', en: 'the DS 3, DS 4, DS 7 and DS 9 (including E-Tense plug-in hybrids)', de: 'DS 3, DS 4, DS 7 und DS 9 (einschließlich E-Tense Plug-in-Hybride)', fr: 'DS 3, DS 4, DS 7 et DS 9 (y compris les hybrides rechargeables E-Tense)' },
  mycitroen: { bs: 'C4, C5 Aircross (i Hybrid), C5 X, ë-C4 i ostale povezane modele', en: 'the C4, C5 Aircross (incl. Hybrid), C5 X, ë-C4 and other connected models', de: 'C4, C5 Aircross (auch Hybrid), C5 X, ë-C4 und weitere vernetzte Modelle', fr: 'C4, C5 Aircross (y compris Hybrid), C5 X, ë-C4 et autres modèles connectés' },
  mypeugeot: { bs: '208, 308, 2008, 3008 i 5008 (uključujući Hybrid i e-modele)', en: 'the 208, 308, 2008, 3008 and 5008 (including Hybrid and e- models)', de: '208, 308, 2008, 3008 und 5008 (einschließlich Hybrid- und e-Modelle)', fr: '208, 308, 2008, 3008 et 5008 (y compris les versions Hybrid et e-)' },
  myopel: { bs: 'Corsa, Astra, Mokka i Grandland (uključujući Hybrid i Electric)', en: 'the Corsa, Astra, Mokka and Grandland (including Hybrid and Electric)', de: 'Corsa, Astra, Mokka und Grandland (einschließlich Hybrid und Electric)', fr: 'Corsa, Astra, Mokka et Grandland (y compris Hybrid et Electric)' },
}

const APPS = {
  myds: { app: 'MyDS', brand: 'DS', file: 'myds-trips-2026-09-19.csv' },
  mycitroen: { app: 'MyCitroën', brand: 'Citroën', file: 'mycitroen-trips.csv', source: { url: 'https://citroen.stellantis-customercare.com/citroen/s/article/Comment-puis-je-acc%C3%A9der-et-exporter-importer-mes-donn%C3%A9es-de-conduite-dans-l-application-MyCitro%C3%ABn-FR?language=fr', label: { bs: 'Citroën: pristup i izvoz podataka o vožnji u aplikaciji MyCitroën (FR)', en: 'Citroën: accessing and exporting driving data in the MyCitroën app (FR)', de: 'Citroën: Fahrdaten in der MyCitroën-App abrufen und exportieren (FR)', fr: 'Citroën : accéder à mes données de conduite et les exporter dans l’application MyCitroën' } } },
  mypeugeot: { app: 'MyPeugeot', brand: 'Peugeot', file: 'mypeugeot-trips.csv' },
  myopel: { app: 'MyOpel', brand: 'Opel', file: 'myopel-trips.csv', note: { bs: 'Kod MyOpel aplikacije izvoz putovanja ide preko usluge My Trip Report. Ako ne vidiš opciju za izvoz, provjeri u aplikaciji da je ta usluga aktivirana.', en: 'In the MyOpel app, trip export goes through the My Trip Report service. If you don’t see an export option, check in the app that this service is activated.', de: 'In der MyOpel-App läuft der Fahrtenexport über den Dienst My Trip Report. Wenn du keine Exportoption siehst, prüfe in der App, ob dieser Dienst aktiviert ist.', fr: 'Dans l’application MyOpel, l’export des trajets passe par le service My Trip Report. Si vous ne voyez pas l’option d’export, vérifiez dans l’application que ce service est activé.' } },
}

const GUIDE_SLUG = { bs: (k) => `vodic/izvoz-voznji-${k}`, en: (k) => `en/guides/${k}-trip-export`, de: (k) => `de/anleitungen/${k}-fahrten-exportieren`, fr: (k) => `fr/guides/exporter-trajets-${k}` }

const GUIDE_META = {
  bs: (a) => ({ title: `Kako izvesti podatke o vožnji iz ${a.app} aplikacije (CSV) – vodič`, description: `Korak po korak: kako iz ${a.app} aplikacije izvesti sve vožnje u CSV, poslati datoteku sebi i dobiti izvještaj o potrošnji, struji i troškovima za svoj ${a.brand}.`, h1: `Kako izvesti vožnje iz ${a.app} aplikacije` }),
  en: (a) => ({ title: `How to export trip data from the ${a.app} app (CSV) – guide`, description: `Step by step: export all your trips from the ${a.app} app as a CSV, send the file to yourself and get a consumption, electricity and cost report for your ${a.brand}.`, h1: `How to export trips from the ${a.app} app` }),
  de: (a) => ({ title: `Fahrtdaten aus der ${a.app}-App exportieren (CSV) – Anleitung`, description: `Schritt für Schritt: alle Fahrten aus der ${a.app}-App als CSV exportieren, die Datei an dich selbst senden und einen Bericht zu Verbrauch, Strom und Kosten deines ${a.brand} erhalten.`, h1: `So exportierst du Fahrten aus der ${a.app}-App` }),
  fr: (a) => ({ title: `Exporter les données de trajets de l’application ${a.app} (CSV) – guide`, description: `Étape par étape : exporter tous vos trajets de l’application ${a.app} en CSV, vous envoyer le fichier et obtenir un rapport de consommation, d’électricité et de coûts pour votre ${a.brand}.`, h1: `Comment exporter vos trajets depuis l’application ${a.app}` }),
}

// Real screenshots (iPhone, MyDS app, Bosnian UI). Personal files in the last screen are blanked out.
const IMG = (n) => `/vodic/myds/korak-${n}.webp`
const REAL_STEPS = {
  myds: {
    bs: [
      { t: 'Otvori MyDS aplikaciju', d: 'Pokreni MyDS i prijavi se. Provjeri da je tvoj DS povezan: vožnje se bilježe samo ako su povezane usluge aktivne i auto ima mobilnu mrežu.', img: IMG(1), alt: 'Početni ekran MyDS aplikacije' },
      { t: 'Otvori karticu Vožnja i dodirni strelicu za preuzimanje', d: 'U donjem meniju izaberi Vožnja. Gore desno, pored filtera, dodirni ikonu strelice prema dolje (preuzimanje).', img: IMG(2), alt: 'MyDS kartica Vožnja s ikonom za preuzimanje gore desno' },
      { t: 'Izaberi „Izvoz vaših putovanja“', d: 'Otvara se ekran Podaci o vožnji. Dodirni IZVOZ VAŠIH PUTOVANJA: aplikacija napravi datoteku sa svim putovanjima. Opcija SPREMITE SVOJA PUTOVANJA pravi .myp backup, i njega DriveLens također čita.', img: IMG(3), alt: 'MyDS ekran Podaci o vožnji s opcijom Izvoz vaših putovanja' },
      { t: 'Sačuvaj datoteku: Save to Files', d: 'Pojavi se meni za dijeljenje s datotekom myds-trips-DATUM. Izaberi Save to Files (Spremi u Datoteke) ili je pošalji sebi na Mail ili WhatsApp. Nemoj je prvo otvarati i spremati u Excelu: Excel zna pretvoriti 14.2 km u datum.', img: IMG(4), alt: 'iPhone meni za dijeljenje s datotekom myds-trips' },
      { t: 'Izaberi folder i dodirni Spremi', d: 'Izaberi iCloud Drive ili bilo koji folder i dodirni Spremi. Datoteka je mala (oko 100 KB i za godinu vožnje).', img: IMG(5), alt: 'iPhone Datoteke: izbor foldera i dugme Spremi' },
      { t: 'Učitaj datoteku u DriveLens', d: 'Otvori DriveLens, dodirni polje za učitavanje i izaberi sačuvanu datoteku. Izvještaj se pojavi odmah, a podaci ostaju na tvom uređaju.', screen: ['DriveLens', 'Prevuci CSV ovdje', 'myds-trips-10-14-2026', 'Izvještaj ✓'], hl: 2 },
    ],
    en: [
      { t: 'Open the MyDS app', d: 'Launch MyDS and sign in. Make sure your DS is connected: trips are only recorded when connected services are active and the car has mobile coverage.', img: IMG(1), alt: 'MyDS app home screen' },
      { t: 'Open the driving tab and tap the download arrow', d: 'In the bottom menu, open the driving/trips tab (“Vožnja” in the screenshot). At the top right, next to the filter, tap the downward arrow (download) icon.', img: IMG(2), alt: 'MyDS driving tab with the download icon at the top right' },
      { t: 'Choose “Export your trips”', d: 'The driving data screen opens. Tap the first option, export your trips (“IZVOZ VAŠIH PUTOVANJA” in the screenshot): the app creates a file with all your trips. The second option saves a .myp backup, which DriveLens also reads.', img: IMG(3), alt: 'MyDS driving data screen with the export trips option' },
      { t: 'Save the file: Save to Files', d: 'The share sheet opens with the file myds-trips-DATE. Choose Save to Files, or send it to yourself via Mail or WhatsApp. Don’t open and re-save it in Excel first: Excel can turn 14.2 km into a date.', img: IMG(4), alt: 'iPhone share sheet with the myds-trips file' },
      { t: 'Pick a folder and tap Save', d: 'Choose iCloud Drive or any folder and tap Save. The file is small (around 100 KB even for a year of driving).', img: IMG(5), alt: 'iPhone Files: choosing a folder and the Save button' },
      { t: 'Load the file into DriveLens', d: 'Open DriveLens, tap the upload area and pick the saved file. The report appears instantly, and your data stays on your device.', screen: ['DriveLens', 'Drop CSV here', 'myds-trips-10-14-2026', 'Report ✓'], hl: 2 },
    ],
    de: [
      { t: 'MyDS-App öffnen', d: 'Starte MyDS und melde dich an. Prüfe, ob dein DS verbunden ist: Fahrten werden nur aufgezeichnet, wenn die vernetzten Dienste aktiv sind und das Auto Mobilfunkempfang hat.', img: IMG(1), alt: 'Startbildschirm der MyDS-App' },
      { t: 'Reiter Fahrten öffnen und auf den Download-Pfeil tippen', d: 'Öffne im unteren Menü den Reiter für Fahrten („Vožnja“ im Screenshot). Tippe oben rechts neben dem Filter auf das Pfeil-nach-unten-Symbol (Download).', img: IMG(2), alt: 'MyDS-Reiter Fahrten mit Download-Symbol oben rechts' },
      { t: '„Fahrten exportieren“ wählen', d: 'Der Bildschirm mit den Fahrdaten öffnet sich. Tippe auf die erste Option, Fahrten exportieren („IZVOZ VAŠIH PUTOVANJA“ im Screenshot): Die App erstellt eine Datei mit allen Fahrten. Die zweite Option speichert ein .myp-Backup, das DriveLens ebenfalls liest.', img: IMG(3), alt: 'MyDS-Bildschirm Fahrdaten mit der Option Fahrten exportieren' },
      { t: 'Datei sichern: In Dateien sichern', d: 'Das Teilen-Menü erscheint mit der Datei myds-trips-DATUM. Wähle „In Dateien sichern“ oder schick sie dir per Mail oder WhatsApp. Öffne und speichere sie nicht vorher in Excel: Excel macht aus 14.2 km gern ein Datum.', img: IMG(4), alt: 'iPhone-Teilen-Menü mit der Datei myds-trips' },
      { t: 'Ordner wählen und auf Sichern tippen', d: 'Wähle iCloud Drive oder einen beliebigen Ordner und tippe auf Sichern. Die Datei ist klein (rund 100 KB selbst für ein Jahr Fahrten).', img: IMG(5), alt: 'iPhone Dateien: Ordnerauswahl und Sichern-Taste' },
      { t: 'Datei in DriveLens laden', d: 'Öffne DriveLens, tippe auf das Upload-Feld und wähle die gespeicherte Datei. Der Bericht erscheint sofort, und deine Daten bleiben auf deinem Gerät.', screen: ['DriveLens', 'CSV hier ablegen', 'myds-trips-10-14-2026', 'Bericht ✓'], hl: 2 },
    ],
    fr: [
      { t: 'Ouvrez l’application MyDS', d: 'Lancez MyDS et connectez-vous. Vérifiez que votre DS est connectée : les trajets ne sont enregistrés que si les services connectés sont actifs et que la voiture capte le réseau mobile.', img: IMG(1), alt: 'Écran d’accueil de l’application MyDS' },
      { t: 'Ouvrez l’onglet des trajets et touchez la flèche de téléchargement', d: 'Dans le menu du bas, ouvrez l’onglet des trajets (« Vožnja » sur la capture). En haut à droite, à côté du filtre, touchez l’icône de flèche vers le bas (téléchargement).', img: IMG(2), alt: 'Onglet des trajets MyDS avec l’icône de téléchargement en haut à droite' },
      { t: 'Choisissez « Exporter vos trajets »', d: 'L’écran des données de conduite s’ouvre. Touchez la première option, exporter vos trajets (« IZVOZ VAŠIH PUTOVANJA » sur la capture) : l’application crée un fichier avec tous vos trajets. La seconde option enregistre une sauvegarde .myp, que DriveLens lit aussi.', img: IMG(3), alt: 'Écran des données de conduite MyDS avec l’option d’export des trajets' },
      { t: 'Enregistrez le fichier : Enregistrer dans Fichiers', d: 'Le menu de partage s’affiche avec le fichier myds-trips-DATE. Choisissez « Enregistrer dans Fichiers » ou envoyez-le-vous par Mail ou WhatsApp. Ne l’ouvrez pas et ne l’enregistrez pas d’abord dans Excel : Excel peut transformer 14.2 km en date.', img: IMG(4), alt: 'Menu de partage iPhone avec le fichier myds-trips' },
      { t: 'Choisissez un dossier et touchez Enregistrer', d: 'Choisissez iCloud Drive ou n’importe quel dossier et touchez Enregistrer. Le fichier est léger (environ 100 Ko même pour un an de conduite).', img: IMG(5), alt: 'Fichiers iPhone : choix du dossier et bouton Enregistrer' },
      { t: 'Chargez le fichier dans DriveLens', d: 'Ouvrez DriveLens, touchez la zone d’import et choisissez le fichier enregistré. Le rapport s’affiche immédiatement, et vos données restent sur votre appareil.', screen: ['DriveLens', 'Déposez le CSV ici', 'myds-trips-10-14-2026', 'Rapport ✓'], hl: 2 },
    ],
  },
}

const GENERIC_STEPS = {
  bs: (a) => [
    { t: 'Otvori aplikaciju i provjeri da je auto povezan', d: `Prijavi se u ${a.app} i provjeri da aplikacija prikazuje tvoj ${a.brand}. Vožnje se bilježe samo ako su povezane usluge (Connect) aktivne i auto ima mobilnu mrežu.`, screen: ['Moj auto', `${a.brand} · povezan`, 'Vožnje', 'Usluge'], hl: 1 },
    { t: 'Otvori odjeljak s vožnjama', d: 'Dodirni Vožnje (na engleskom Trips, njemački Fahrten, francuski Trajets). Tu je lista svih vožnji s kilometrima, trajanjem i potrošnjom.', screen: ['Vožnje', '12,4 km · 18 min', '8,1 km · 11 min', '196 km · 2 h 05'], hl: 0 },
    { t: 'Izaberi period “od početka”', d: 'U filteru perioda izaberi najduži period (Od početka / Since the start / Depuis l’origine). Tako dobiješ cijelu historiju, a ne samo zadnji mjesec.', screen: ['Period', 'Ovaj mjesec', 'Zadnja 3 mjeseca', 'Od početka ✓'], hl: 3 },
    { t: 'Dodirni Izvoz i izaberi CSV', d: 'Dodirni ikonu za dijeljenje ili izvoz. Aplikacija napravi CSV datoteku sa svim vožnjama iz izabranog perioda. Neke verzije nude i .myp backup; i taj format DriveLens čita.', screen: ['Izvoz', 'CSV ✓', '.myp backup', 'Odustani'], hl: 1 },
    { t: 'Pošalji datoteku sebi', d: 'Izaberi Mail, WhatsApp, Google Drive ili Spremi u Files. Datoteku nemoj prvo otvarati u Excelu i spremati: Excel zna pretvoriti 14.2 km u datum 14. februar.', screen: ['Podijeli', 'Mail', 'Google Drive', 'Spremi u Files'], hl: 1 },
    { t: 'Učitaj CSV u DriveLens', d: 'Otvori DriveLens i prevuci datoteku. Izvještaj se pojavi odmah, a podaci ostaju na tvom uređaju.', screen: ['DriveLens', 'Prevuci CSV ovdje', a.file, 'Izvještaj ✓'], hl: 2 },
  ],
  en: (a) => [
    { t: 'Open the app and check the car is connected', d: `Sign in to ${a.app} and check that the app shows your ${a.brand}. Trips are only recorded when connected services are active and the car has mobile coverage.`, screen: ['My car', `${a.brand} · connected`, 'Trips', 'Services'], hl: 1 },
    { t: 'Open the trips section', d: 'Tap Trips. You’ll see a list of all trips with distance, duration and consumption.', screen: ['Trips', '12.4 km · 18 min', '8.1 km · 11 min', '196 km · 2 h 05'], hl: 0 },
    { t: 'Choose the longest period', d: 'In the period filter, pick the longest option (e.g. Since the start). That gives you the full history, not just the last month.', screen: ['Period', 'This month', 'Last 3 months', 'Since the start ✓'], hl: 3 },
    { t: 'Tap Export and choose CSV', d: 'Tap the share or export icon. The app creates a CSV file with all trips from the chosen period. Some versions also offer a .myp backup; DriveLens reads that format too.', screen: ['Export', 'CSV ✓', '.myp backup', 'Cancel'], hl: 1 },
    { t: 'Send the file to yourself', d: 'Choose Mail, WhatsApp, Google Drive or Save to Files. Don’t open and re-save the file in Excel first: Excel can turn 14.2 km into the date 14 February.', screen: ['Share', 'Mail', 'Google Drive', 'Save to Files'], hl: 1 },
    { t: 'Load the CSV into DriveLens', d: 'Open DriveLens and drop the file in. The report appears instantly, and your data stays on your device.', screen: ['DriveLens', 'Drop CSV here', a.file, 'Report ✓'], hl: 2 },
  ],
  de: (a) => [
    { t: 'App öffnen und prüfen, ob das Auto verbunden ist', d: `Melde dich in ${a.app} an und prüfe, ob die App deinen ${a.brand} anzeigt. Fahrten werden nur aufgezeichnet, wenn die vernetzten Dienste aktiv sind und das Auto Mobilfunkempfang hat.`, screen: ['Mein Auto', `${a.brand} · verbunden`, 'Fahrten', 'Dienste'], hl: 1 },
    { t: 'Bereich Fahrten öffnen', d: 'Tippe auf Fahrten. Dort siehst du alle Fahrten mit Strecke, Dauer und Verbrauch.', screen: ['Fahrten', '12,4 km · 18 min', '8,1 km · 11 min', '196 km · 2 h 05'], hl: 0 },
    { t: 'Den längsten Zeitraum wählen', d: 'Wähle im Zeitraumfilter die längste Option (z. B. Seit Beginn). So bekommst du die komplette Historie und nicht nur den letzten Monat.', screen: ['Zeitraum', 'Dieser Monat', 'Letzte 3 Monate', 'Seit Beginn ✓'], hl: 3 },
    { t: 'Auf Exportieren tippen und CSV wählen', d: 'Tippe auf das Teilen- oder Export-Symbol. Die App erstellt eine CSV-Datei mit allen Fahrten des gewählten Zeitraums. Manche Versionen bieten auch ein .myp-Backup an; auch dieses Format liest DriveLens.', screen: ['Export', 'CSV ✓', '.myp-Backup', 'Abbrechen'], hl: 1 },
    { t: 'Datei an dich selbst senden', d: 'Wähle Mail, WhatsApp, Google Drive oder In Dateien sichern. Öffne und speichere die Datei nicht vorher in Excel: Excel macht aus 14.2 km gern den 14. Februar.', screen: ['Teilen', 'Mail', 'Google Drive', 'In Dateien sichern'], hl: 1 },
    { t: 'CSV in DriveLens laden', d: 'Öffne DriveLens und zieh die Datei hinein. Der Bericht erscheint sofort, und deine Daten bleiben auf deinem Gerät.', screen: ['DriveLens', 'CSV hier ablegen', a.file, 'Bericht ✓'], hl: 2 },
  ],
  fr: (a) => [
    { t: 'Ouvrez l’application et vérifiez que la voiture est connectée', d: `Connectez-vous à ${a.app} et vérifiez que l’application affiche votre ${a.brand}. Les trajets ne sont enregistrés que si les services connectés sont actifs et que la voiture capte le réseau mobile.`, screen: ['Ma voiture', `${a.brand} · connectée`, 'Trajets', 'Services'], hl: 1 },
    { t: 'Ouvrez la section Trajets', d: 'Touchez Trajets. Vous y voyez tous vos trajets avec distance, durée et consommation.', screen: ['Trajets', '12,4 km · 18 min', '8,1 km · 11 min', '196 km · 2 h 05'], hl: 0 },
    { t: 'Choisissez la période la plus longue', d: 'Dans le filtre de période, choisissez l’option la plus longue (par ex. Depuis l’origine). Vous obtenez ainsi tout l’historique, pas seulement le dernier mois.', screen: ['Période', 'Ce mois-ci', '3 derniers mois', 'Depuis l’origine ✓'], hl: 3 },
    { t: 'Touchez Exporter et choisissez CSV', d: 'Touchez l’icône de partage ou d’export. L’application crée un fichier CSV avec tous les trajets de la période choisie. Certaines versions proposent aussi une sauvegarde .myp ; DriveLens lit également ce format.', screen: ['Exporter', 'CSV ✓', 'Sauvegarde .myp', 'Annuler'], hl: 1 },
    { t: 'Envoyez-vous le fichier', d: 'Choisissez Mail, WhatsApp, Google Drive ou Enregistrer dans Fichiers. N’ouvrez pas et n’enregistrez pas le fichier dans Excel avant : Excel peut transformer 14.2 km en date du 14 février.', screen: ['Partager', 'Mail', 'Google Drive', 'Enregistrer dans Fichiers'], hl: 1 },
    { t: 'Chargez le CSV dans DriveLens', d: 'Ouvrez DriveLens et déposez le fichier. Le rapport s’affiche immédiatement, et vos données restent sur votre appareil.', screen: ['DriveLens', 'Déposez le CSV ici', a.file, 'Rapport ✓'], hl: 2 },
  ],
}

function guide(key, lang) {
  const a = APPS[key]
  return {
    id: `guide-${key}`,
    lang,
    kind: 'guide',
    slug: GUIDE_SLUG[lang](key),
    ...GUIDE_META[lang](a),
    kicker: UI[lang].guideKicker,
    models: MODELS[key][lang],
    steps: REAL_STEPS[key]?.[lang] ?? GENERIC_STEPS[lang](a),
    extra: a.note?.[lang],
    source: a.source ? { url: a.source.url, label: a.source.label[lang] } : undefined,
  }
}

export const PAGES = LANGS.flatMap((lang) => [
  ...['myds', 'mycitroen', 'mypeugeot', 'myopel'].map((k) => guide(k, lang)),
  ...Object.entries(ARTICLES).map(([id, tr]) => ({ id: `article-${id}`, lang, kind: 'article', kicker: UI[lang].articleKicker, date: ARTICLE_DATE, ...tr[lang] })),
])

export const HUBS = [
  { id: 'hub-guide', kind: 'guide', lang: 'bs', slug: 'vodic', title: 'Vodiči: kako izvesti vožnje iz MyDS, MyCitroën, MyPeugeot i MyOpel', description: 'Vodiči korak po korak za izvoz podataka o vožnji (CSV) iz Stellantis aplikacija MyDS, MyCitroën, MyPeugeot i MyOpel.', h1: 'Vodiči za izvoz podataka o vožnji' },
  { id: 'hub-article', kind: 'article', lang: 'bs', slug: 'clanci', title: 'Članci o potrošnji plug-in hibrida i troškovima vožnje', description: 'Stvarna potrošnja PHEV vozila, struja vs. gorivo, isplativost punjenja i savjeti na osnovu stvarnih podataka.', h1: 'Članci' },
  { id: 'hub-guide', kind: 'guide', lang: 'en', slug: 'en/guides', title: 'Guides: how to export trips from MyDS, MyCitroën, MyPeugeot and MyOpel', description: 'Step-by-step guides to exporting your driving data (CSV) from the Stellantis apps MyDS, MyCitroën, MyPeugeot and MyOpel.', h1: 'Guides to exporting your driving data' },
  { id: 'hub-article', kind: 'article', lang: 'en', slug: 'en/articles', title: 'Articles on plug-in hybrid consumption and driving costs', description: 'Real PHEV consumption, electricity vs. petrol, whether daily charging pays off, and tips based on real data.', h1: 'Articles' },
  { id: 'hub-guide', kind: 'guide', lang: 'de', slug: 'de/anleitungen', title: 'Anleitungen: Fahrten aus MyDS, MyCitroën, MyPeugeot und MyOpel exportieren', description: 'Schritt-für-Schritt-Anleitungen zum Export deiner Fahrdaten (CSV) aus den Stellantis-Apps MyDS, MyCitroën, MyPeugeot und MyOpel.', h1: 'Anleitungen zum Export deiner Fahrdaten' },
  { id: 'hub-article', kind: 'article', lang: 'de', slug: 'de/artikel', title: 'Artikel zu Verbrauch und Fahrkosten von Plug-in-Hybriden', description: 'Realer PHEV-Verbrauch, Strom vs. Benzin, ob sich tägliches Laden lohnt, und Tipps auf Basis echter Daten.', h1: 'Artikel' },
  { id: 'hub-guide', kind: 'guide', lang: 'fr', slug: 'fr/guides', title: 'Guides : exporter vos trajets depuis MyDS, MyCitroën, MyPeugeot et MyOpel', description: 'Guides pas à pas pour exporter vos données de conduite (CSV) depuis les applications Stellantis MyDS, MyCitroën, MyPeugeot et MyOpel.', h1: 'Guides pour exporter vos données de conduite' },
  { id: 'hub-article', kind: 'article', lang: 'fr', slug: 'fr/articles', title: 'Articles sur la consommation des hybrides rechargeables et le coût de la conduite', description: 'Consommation réelle des PHEV, électricité ou essence, rentabilité de la recharge quotidienne et conseils fondés sur des données réelles.', h1: 'Articles' },
]

export const FAQ_PAGE = {
  bs: { id: 'faq', slug: 'pitanja', title: 'Česta pitanja: potrošnja plug-in hibrida i izvoz vožnji', h1: 'Česta pitanja o potrošnji, izvozu podataka i DriveLensu', lead: 'Odgovori na pitanja koja vlasnici DS, Citroën, Peugeot i Opel vozila najčešće postavljaju o potrošnji plug-in hibrida i izvozu vožnji iz aplikacije.', description: 'Koliko stvarno troši plug-in hibrid, da li se isplati puniti svaki dan, kako izvesti vožnje iz MyDS, MyCitroën, MyPeugeot i MyOpel aplikacije i još 15 pitanja.' },
  en: { id: 'faq', slug: 'en/faq', title: 'FAQ: plug-in hybrid consumption and exporting your trips', h1: 'Frequently asked questions about consumption, data export and DriveLens', lead: 'Answers to the questions DS, Citroën, Peugeot and Opel owners ask most about plug-in hybrid consumption and exporting trips from the app.', description: 'How much a plug-in hybrid really uses, whether daily charging pays off, how to export trips from MyDS, MyCitroën, MyPeugeot and MyOpel, and 15 more questions.' },
  de: { id: 'faq', slug: 'de/fragen', title: 'Häufige Fragen: Verbrauch von Plug-in-Hybriden und Fahrtenexport', h1: 'Häufige Fragen zu Verbrauch, Datenexport und DriveLens', lead: 'Antworten auf die Fragen, die Besitzer von DS, Citroën, Peugeot und Opel am häufigsten zum Verbrauch von Plug-in-Hybriden und zum Export von Fahrten aus der App stellen.', description: 'Wie viel ein Plug-in-Hybrid wirklich verbraucht, ob sich tägliches Laden lohnt, wie du Fahrten aus MyDS, MyCitroën, MyPeugeot und MyOpel exportierst, und 15 weitere Fragen.' },
  fr: { id: 'faq', slug: 'fr/questions', title: 'Questions fréquentes : consommation des hybrides rechargeables et export des trajets', h1: 'Questions fréquentes sur la consommation, l’export des données et DriveLens', lead: 'Les réponses aux questions que les propriétaires de DS, Citroën, Peugeot et Opel posent le plus souvent sur la consommation des hybrides rechargeables et l’export des trajets.', description: 'Combien consomme vraiment un hybride rechargeable, faut-il le recharger chaque jour, comment exporter ses trajets depuis MyDS, MyCitroën, MyPeugeot et MyOpel, et 15 autres questions.' },
}
