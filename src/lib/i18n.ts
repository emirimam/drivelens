export type Lang = 'bs' | 'en'

const bs = {
  tagline: 'Izvještaj o vožnji za DS, Citroën, Peugeot i Opel',
  heroTitle: 'Tvoj auto ima priču.',
  heroTitle2: 'Pretvori je u izvještaj.',
  heroText: 'Učitaj CSV s putovanjima iz aplikacije MyDS, MyCitroën, MyPeugeot ili MyOpel i dobij detaljan izvještaj: struja vs. gorivo, troškovi, uštede, navike, mjesta i rekordi.',
  drop: 'Prevuci CSV ovdje',
  dropOr: 'ili klikni i izaberi datoteku',
  demo: 'Pogledaj demo',
  privacy: 'Podaci ne napuštaju tvoj uređaj. Sve se računa lokalno u pregledniku.',
  howTitle: 'Kako izvesti podatke',
  how1: 'Otvori aplikaciju za svoj auto (MyDS, MyCitroën, MyPeugeot, MyOpel).',
  how2: 'Idi na Putovanja (Trips) i izaberi period.',
  how3: 'Izvezi kao CSV i pošalji datoteku sebi.',
  how4: 'Učitaj CSV ovdje.',
  feat1: 'Struja vs. gorivo', feat1d: 'Prepoznaje plug-in hibrid i koliko si vozio na struju.',
  feat2: 'Troškovi i uštede', feat2d: 'Cijene goriva po datumu, struja i ušteda.',
  feat3: 'Navike i mjesta', feat3d: 'Kad, gdje i koliko voziš, s mapom.',
  feat4: 'Pametno čišćenje', feat4d: 'Popravlja resetovan sat i pronalazi rupe u logu.',
  errParse: 'Ne mogu pročitati datoteku. Provjeri da je to CSV izvoz putovanja.',
  newFile: 'Nova datoteka',
  settings: 'Postavke',
  print: 'Spremi PDF',
  remember: 'Zapamti podatke na ovom uređaju',
  // sections
  sOverview: 'Pregled', sMoney: 'Novac', sEnergy: 'Struja', sTime: 'Navike', sMap: 'Mjesta', sRecords: 'Rekordi', sGaps: 'Rupe',
  trips: 'vožnji', km: 'km', hours: 'h za volanom', avgSpeed: 'prosječna brzina', drivingDays: 'dana vožnje', medianTrip: 'medijan vožnje',
  period: 'Period',
  phev: 'Plug-in hibrid', ice: 'Benzin/dizel', ev: 'Električni',
  gElShare: 'Na struju', gL100: 'Potrošnja kad motor radi', gSpeed: 'Prosječna brzina', gCost: 'Trošak na 100 km',
  gL100Hint: 'l/100 km', gCostHint: 'gorivo + struja',
  saved: 'ušteđeno vožnjom na struju',
  savedSub: '{km} km na struju · {l} l benzina manje',
  allFuel: 'Sve na gorivo', yourMix: 'Tvoj miks',
  fuelCost: 'za gorivo', litres: 'litara goriva', avgPrice: 'prosječna cijena', elCost: 'za struju', per100Fuel: 'na 100 km gorivom', per100El: 'na 100 km strujom',
  co2: 'kg CO₂ iz goriva',
  monthly: 'Kilometri po mjesecu', monthlyHint: 'Klikni na mjesec da ga izuzmeš iz statistike.',
  monthlyCost: 'Trošak goriva po mjesecu', priceChart: 'Cijena goriva',
  electric: 'struja', fuel: 'gorivo', gap: 'rupa u logu', excluded: 'izuzeto',
  energySplit: 'Podjela kilometara',
  pureEl: 'km samo na struju', elDays: 'dana samo na struju', evStreak: 'najduži niz bez goriva', maxEvDay: 'najviše na struju u danu', greenest: 'najzeleniji mjesec',
  engineL100: 'motor na autoputu', howElectric: 'Vožnje bez upisane potrošnje su na struju. Kilometri na struju unutar hibridnih vožnji su procjena.',
  heat: 'Kada voziš', heatHint: 'Broj polazaka po danu i satu',
  hist: 'Dužina vožnji', weekday: 'Kilometri po danu u sedmici',
  odoChart: 'Brojač vs. zabilježeno', odo: 'brojač', logged: 'zabilježeno',
  mapTitle: 'Najčešća odredišta', home: 'Kuća', work: 'Posao', visits: 'dolazaka',
  rMaxDay: 'Najviše km u danu', rLongest: 'Najduža vožnja', rFastest: 'Najbrža duga vožnja', rMostTrips: 'Najviše vožnji u danu', rEarliest: 'Najraniji polazak', rStreak: 'Najduži niz dana vožnje',
  days: 'dana',
  gapsTitle: 'Rupe u logu', gapsText: 'Brojač je porastao za {odo} km, a zabilježeno je {log} km. Auto nije poslao {gap} km.',
  gapEst: 'Procjena za rupe', gapLo: 'kao uobičajena vožnja', gapHi: 'kao putovanje na gorivo',
  perMonth: 'km mjesečno', perYear: 'km godišnje (procjena)', noGaps: 'Nema značajnih rupa. Log je kompletan.',
  excludedNote: 'Izuzeto iz statistike: {m}',
  clockFixed: '{n} vožnji imalo je pogrešan datum (resetovan sat), pa su vraćene na prave datume.',
  // settings
  currency: 'Valuta', fuelType: 'Gorivo', petrol: 'Benzin', diesel: 'Dizel', fuelPrice: 'Cijena goriva po litri', priceHistory: 'Cijene po datumu',
  presetBih: 'Učitaj FBiH prosjek (benzin 95)', addPoint: 'Dodaj cijenu', clear: 'Obriši',
  elPrice: 'Cijena struje po kWh', kwh100: 'Potrošnja struje (kWh/100 km)', excludeMonths: 'Izuzeti mjeseci', none: 'nijedan',
  close: 'Zatvori',
  disclaimer: 'Nezavisan projekat. Nije povezan sa Stellantis, DS Automobiles, Citroën, Peugeot ni Opel.',
  approx: 'Procjene su informativne.',
}

const en: typeof bs = {
  tagline: 'Driving report for DS, Citroën, Peugeot and Opel',
  heroTitle: 'Your car has a story.',
  heroTitle2: 'Turn it into a report.',
  heroText: 'Load the trips CSV from MyDS, MyCitroën, MyPeugeot or MyOpel and get a detailed report: electric vs. fuel, costs, savings, habits, places and records.',
  drop: 'Drop your CSV here',
  dropOr: 'or click to choose a file',
  demo: 'View demo',
  privacy: 'Your data never leaves your device. Everything is computed locally in the browser.',
  howTitle: 'How to export your data',
  how1: 'Open your car app (MyDS, MyCitroën, MyPeugeot, MyOpel).',
  how2: 'Go to Trips and choose a period.',
  how3: 'Export as CSV and send the file to yourself.',
  how4: 'Load the CSV here.',
  feat1: 'Electric vs. fuel', feat1d: 'Detects plug-in hybrids and how far you drove on electricity.',
  feat2: 'Costs & savings', feat2d: 'Fuel price by date, electricity and savings.',
  feat3: 'Habits & places', feat3d: 'When, where and how much you drive, with a map.',
  feat4: 'Smart cleanup', feat4d: 'Fixes a reset car clock and finds gaps in the log.',
  errParse: "Can't read that file. Make sure it's a trips CSV export.",
  newFile: 'New file',
  settings: 'Settings',
  print: 'Save PDF',
  remember: 'Remember data on this device',
  sOverview: 'Overview', sMoney: 'Money', sEnergy: 'Electric', sTime: 'Habits', sMap: 'Places', sRecords: 'Records', sGaps: 'Gaps',
  trips: 'trips', km: 'km', hours: 'h driving', avgSpeed: 'average speed', drivingDays: 'driving days', medianTrip: 'median trip',
  period: 'Period',
  phev: 'Plug-in hybrid', ice: 'Petrol/diesel', ev: 'Electric',
  gElShare: 'Electric', gL100: 'Consumption with engine on', gSpeed: 'Average speed', gCost: 'Cost per 100 km',
  gL100Hint: 'l/100 km', gCostHint: 'fuel + electricity',
  saved: 'saved by driving electric',
  savedSub: '{km} km on electricity · {l} l less fuel',
  allFuel: 'All on fuel', yourMix: 'Your mix',
  fuelCost: 'on fuel', litres: 'litres of fuel', avgPrice: 'average price', elCost: 'on electricity', per100Fuel: 'per 100 km on fuel', per100El: 'per 100 km electric',
  co2: 'kg CO₂ from fuel',
  monthly: 'Kilometres per month', monthlyHint: 'Tap a month to exclude it from the statistics.',
  monthlyCost: 'Fuel cost per month', priceChart: 'Fuel price',
  electric: 'electric', fuel: 'fuel', gap: 'log gap', excluded: 'excluded',
  energySplit: 'Distance split',
  pureEl: 'km fully electric', elDays: 'all-electric days', evStreak: 'longest fuel-free streak', maxEvDay: 'most electric km in a day', greenest: 'greenest month',
  engineL100: 'engine on the motorway', howElectric: 'Trips without a consumption value are electric. Electric km inside hybrid trips are estimated.',
  heat: 'When you drive', heatHint: 'Departures by weekday and hour',
  hist: 'Trip length', weekday: 'Kilometres by weekday',
  odoChart: 'Odometer vs. logged', odo: 'odometer', logged: 'logged',
  mapTitle: 'Most frequent destinations', home: 'Home', work: 'Work', visits: 'visits',
  rMaxDay: 'Most km in a day', rLongest: 'Longest trip', rFastest: 'Fastest long trip', rMostTrips: 'Most trips in a day', rEarliest: 'Earliest departure', rStreak: 'Longest driving streak',
  days: 'days',
  gapsTitle: 'Gaps in the log', gapsText: 'The odometer grew by {odo} km but only {log} km were logged. The car did not report {gap} km.',
  gapEst: 'Estimate for the gaps', gapLo: 'as usual driving', gapHi: 'as fuel-only trips',
  perMonth: 'km per month', perYear: 'km per year (estimate)', noGaps: 'No significant gaps. The log is complete.',
  excludedNote: 'Excluded from statistics: {m}',
  clockFixed: '{n} trips had a wrong date (reset car clock) and were moved back to their real dates.',
  currency: 'Currency', fuelType: 'Fuel', petrol: 'Petrol', diesel: 'Diesel', fuelPrice: 'Fuel price per litre', priceHistory: 'Prices by date',
  presetBih: 'Load FBiH average (petrol 95)', addPoint: 'Add price', clear: 'Clear',
  elPrice: 'Electricity price per kWh', kwh100: 'Electric consumption (kWh/100 km)', excludeMonths: 'Excluded months', none: 'none',
  close: 'Close',
  disclaimer: 'Independent project. Not affiliated with Stellantis, DS Automobiles, Citroën, Peugeot or Opel.',
  approx: 'Estimates are for information only.',
}

export const dict = { bs, en }
export type Key = keyof typeof bs

export function makeT(lang: Lang) {
  const d = dict[lang]
  return (k: Key, vars?: Record<string, string | number>) =>
    d[k].replace(/\{(\w+)\}/g, (_, v: string) => String(vars?.[v] ?? ''))
}

const BS_MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar']
const BS_MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const BS_DAYS = ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned']

export function makeFmt(lang: Lang) {
  // Some browsers ship without Bosnian locale data, so fall back to Croatian number formatting.
  const locale = lang === 'bs' ? ['bs-BA', 'hr-HR'] : ['en-GB']
  const nf = (d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d })
  const cache = new Map<number, Intl.NumberFormat>()
  const n = (v: number, d = 0) => {
    if (d < 0) {
      const f = 10 ** -d
      v = Math.round(v / f) * f
      d = 0
    }
    if (!cache.has(d)) cache.set(d, nf(d))
    const out = cache.get(d)!.format(v)
    // browsers without bs/hr data fall back to "1,234.5" – normalise to "1.234,5"
    if (lang === 'bs' && cache.get(d)!.resolvedOptions().locale.startsWith('en')) return out.replace(/[,.]/g, (c) => (c === ',' ? '.' : ','))
    return out
  }
  const date = (d: Date) => (lang === 'bs' ? `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.` : d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }))
  const month = (key: string, long = false) => {
    const [y, m] = key.split('-').map(Number)
    if (lang === 'bs') return long ? `${BS_MONTHS[m - 1]} ${y}.` : `${BS_MONTHS_SHORT[m - 1]} ${String(y).slice(2)}`
    return new Date(y, m - 1, 1).toLocaleDateString(locale, long ? { month: 'long', year: 'numeric' } : { month: 'short', year: '2-digit' })
  }
  const time = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const weekdays = lang === 'bs' ? BS_DAYS : Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }))
  return { n, date, month, time, weekdays, locale: locale[0] }
}
