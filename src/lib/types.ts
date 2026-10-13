export type ConsumptionUnit = 'km/l' | 'l/100km' | 'mpg' | 'kWh/100km' | 'unknown'
export type DistanceUnit = 'km' | 'mi'
export type Powertrain = 'phev' | 'ice' | 'ev'

export interface LatLon {
  lat: number
  lon: number
}

export interface Trip {
  id: number
  start: Date
  end: Date
  /** minutes */
  duration: number
  from: LatLon | null
  to: LatLon | null
  /** always km internally */
  km: number
  /** always km internally */
  odometer: number | null
  /** litres of fuel burnt on this trip (null = unknown) */
  litres: number | null
  /** kWh used (pure EV exports only) */
  kwh: number | null
  /** true when the trip burnt no fuel at all (PHEV electric-only trip) */
  electricOnly: boolean
  /** the date was reconstructed because the car clock was reset */
  dateFixed: boolean
  rawConsumption: number | null
}

export interface ParseResult {
  trips: Trip[]
  powertrain: Powertrain
  consumptionUnit: ConsumptionUnit
  distanceUnit: DistanceUnit
  warnings: string[]
  fixedDates: number
}
