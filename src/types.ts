export type LanguageCode = 'en' | 'he'

export type TripPointCategory = 'city' | 'food' | 'lodging' | 'sight' | 'photo' | 'other'

export interface GeoPoint {
  id: string
  title: string
  lat: number
  lng: number
  category: TripPointCategory
  region?: string
  day?: number
  description?: string
  isStart?: boolean
  isEnd?: boolean
  photos?: PhotoEntry[]
  notes?: string
  locationNotes?: LocationNote[]
  visitOrder?: number
}

export interface PhotoEntry {
  id: string
  url: string
  caption?: string
  timestamp: string
  locationId: string
}

export interface LocationNote {
  id: string
  locationId: string
  author: string
  content: string
  timestamp: string
  color?: string
}

export interface StopItem {
  id: string
  type: TripPointCategory
  title: string
  time?: string
  description?: string
  photos?: PhotoEntry[]
  notes?: string
}

export interface DayPlan {
  dayNumber: number
  dateISO: string
  cityArea: string
  summary?: string
  sleepSuggestion?: string
  driveInfo?: string
  stops: StopItem[]
  photos?: PhotoEntry[]
  notes?: string
}

export interface TripData {
  startISO: string
  endISO: string
  days: DayPlan[]
  points: GeoPoint[]
}

export interface MapFilter {
  selectedCity?: string
  selectedRegion?: string
  selectedCategory?: TripPointCategory
  selectedDay?: number
  showRoute?: boolean
}

export interface CityInfo {
  name: string
  region: string
  days: number[]
  pointCount: number
  center: [number, number]
  photos?: PhotoEntry[]
}
