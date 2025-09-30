import Papa from 'papaparse'
import type { GeoPoint, TripPointCategory } from '../types'

export async function importGeoPointsFromFile(file: File): Promise<GeoPoint[]> {
  const text = await file.text()
  const name = file.name.toLowerCase()
  if (name.endsWith('.csv')) return parseCsv(text)
  if (name.endsWith('.geojson') || name.endsWith('.json')) return parseGeoJson(text)
  // Try CSV first, fallback to GeoJSON
  try { return parseCsv(text) } catch {}
  return parseGeoJson(text)
}

function parseCsv(text: string): GeoPoint[] {
  const res = Papa.parse<Record<string,string>>(text, { header: true, skipEmptyLines: true })
  if (res.errors?.length) throw new Error(res.errors[0].message)
  return res.data.map((row, idx) => {
    const id = row.id || `csv-${idx}`
    const title = row.title || row.name || `Point ${idx+1}`
    const lat = parseFloat(row.lat || row.latitude || '')
    const lng = parseFloat(row.lng || row.longitude || row.lon || '')
    const category = (row.category as TripPointCategory) || inferCategory(title)
    const region = (row.region as any) || undefined
    const day = row.day ? parseInt(row.day) : undefined
    const description = row.description || undefined
    if (Number.isNaN(lat) || Number.isNaN(lng)) throw new Error(`Invalid lat/lng for row ${idx+1}`)
    return { id, title, lat, lng, category, region, day, description }
  })
}

function parseGeoJson(text: string): GeoPoint[] {
  const json = JSON.parse(text)
  if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
    return json.features.map((f: any, idx: number) => {
      const coords = f.geometry?.coordinates
      const props = f.properties || {}
      const id = props.id || f.id || `gj-${idx}`
      const title = props.title || props.name || `Point ${idx+1}`
      const [lng, lat] = coords || []
      const category = (props.category as TripPointCategory) || inferCategory(title)
      const region = props.region
      const day = props.day
      const description = props.description
      if (typeof lat !== 'number' || typeof lng !== 'number') throw new Error(`Invalid coordinates in feature ${idx+1}`)
      return { id, title, lat, lng, category, region, day, description }
    })
  }
  throw new Error('Unsupported GeoJSON format')
}

function inferCategory(title: string): TripPointCategory {
  const t = title.toLowerCase()
  if (/(hotel|bnb|stay|sleep|residenza|suite)/.test(t)) return 'lodging'
  if (/(ristorante|osteria|trattoria|pizzeria|bar|cafe|caff|restaurant)/.test(t)) return 'food'
  return 'sight'
}



