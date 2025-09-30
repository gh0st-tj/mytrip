import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Filter, Camera } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMemo, useRef, useState, useEffect } from 'react'
import { tripData } from '../data'
import type { GeoPoint, MapFilter, CityInfo, PhotoEntry, LocationNote } from '../types'
import { importGeoPointsFromFile } from '../utils/importers'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { cn } from '../utils/cn'
import { translateLocation } from '../utils/translations'
import { useSettings } from '../state/SettingsContext'
import { NotesPanel } from '../components/NotesPanel'
import { PhotoLightbox } from '../components/PhotoLightbox'

// Enhanced Leaflet icons
import L from 'leaflet'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow })

const createMapIcon = (color: string, size: 'small' | 'medium' | 'large' = 'medium', isSpecial = false, emoji = '', number?: number, title?: string) => {
  const sizes = { small: 24, medium: 32, large: 48 }
  const iconSize = sizes[size]
  
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        ${title ? `<div style="
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          margin-bottom: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${title}</div>` : ''}
        <div class="relative flex items-center justify-center">
          <div style="
            width: ${iconSize}px; 
            height: ${iconSize}px; 
            background: linear-gradient(135deg, ${color}, ${color}dd); 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${iconSize * 0.4}px;
            font-weight: bold;
            color: white;
            ${isSpecial ? 'animation: bounce 2s infinite;' : ''}
          ">${number ? number : emoji}</div>
          ${isSpecial ? `<div style="
            position: absolute;
            width: ${iconSize + 10}px;
            height: ${iconSize + 10}px;
            border: 2px solid ${color};
            border-radius: 50%;
            animation: ping 2s infinite;
            opacity: 0.5;
          "></div>` : ''}
        </div>
      </div>
      <style>
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.5; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
        }
      </style>
    `,
    className: 'custom-animated-icon',
    iconSize: [iconSize, title ? iconSize + 30 : iconSize],
    iconAnchor: [iconSize/2, title ? iconSize + 15 : iconSize/2],
  })
}

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : initial
  })
  const set = (v: T) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }
  return [value, set] as const
}

export function MapView() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [points, setPoints] = useState<GeoPoint[]>(tripData.points)
  const [mapFilter, setMapFilter] = useState<MapFilter>({ showRoute: true })
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackDay, setPlaybackDay] = useState(1)
  const [playbackStep, setPlaybackStep] = useState(0)
  const [selectedPoint, setSelectedPoint] = useState<GeoPoint | null>(null)
  const [pointPhotos, setPointPhotos] = useLocalState<Record<string, PhotoEntry[]>>('pointPhotos', {})
  const [locationNotes, setLocationNotes] = useLocalState<Record<string, LocationNote[]>>('locationNotes', {})
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [lightboxPhotos, setLightboxPhotos] = useState<{ url: string; caption?: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(4000) // milliseconds per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement|null>(null)
  const photoInputRef = useRef<HTMLInputElement|null>(null)
  const playbackStateRef = useRef({ day: 1, step: 0, isPlaying: false })
  
  // Calculate city information
  const cityInfo = useMemo<CityInfo[]>(() => {
    const cityMap = new Map<string, CityInfo>()
    
    points.forEach(point => {
      if (point.region && point.day) {
        const existing = cityMap.get(point.region)
        if (existing) {
          existing.pointCount++
          if (!existing.days.includes(point.day)) {
            existing.days.push(point.day)
          }
        } else {
          cityMap.set(point.region, {
            name: point.region,
            region: point.region,
            days: [point.day],
            pointCount: 1,
            center: [point.lat, point.lng],
            photos: pointPhotos[point.region] || []
          })
        }
      }
    })
    
    return Array.from(cityMap.values()).sort((a, b) => Math.min(...a.days) - Math.min(...b.days))
  }, [points, pointPhotos])

  const filteredPoints = useMemo(() => {
    let result = points

    if (mapFilter.selectedCity) {
      result = result.filter(p => p.region === mapFilter.selectedCity)
    }
    
    if (mapFilter.selectedCategory) {
      result = result.filter(p => p.category === mapFilter.selectedCategory)
    }
    
    if (mapFilter.selectedDay) {
      result = result.filter(p => p.day === mapFilter.selectedDay)
    }

    // Add visit order numbers for better navigation
    return result.map((point, index) => ({
      ...point,
      visitOrder: index + 1
    }))
  }, [points, mapFilter])

  const currentDayAllPoints = useMemo(() => {
    if (!isPlaying) return []
    
    return points // Use all points, not filtered
      .filter(p => p.day === playbackDay)
      .sort((a, b) => {
        const aIndex = tripData.points.findIndex(point => point.id === a.id)
        const bIndex = tripData.points.findIndex(point => point.id === b.id)
        return aIndex - bIndex
      })
      .map((point, index) => ({
        ...point,
        visitOrder: index + 1
      }))
  }, [points, isPlaying, playbackDay])

  const playbackPoints = useMemo(() => {
    if (!isPlaying) return filteredPoints
    
    // Show only points up to current step in current day
    return currentDayAllPoints.slice(0, playbackStep + 1)
  }, [isPlaying, currentDayAllPoints, playbackStep, filteredPoints])

  const currentActivity = useMemo(() => {
    if (!isPlaying || currentDayAllPoints.length === 0) return null
    const currentPoint = currentDayAllPoints[playbackStep]
    return currentPoint ? translateLocation(currentPoint.title, language) : null
  }, [isPlaying, currentDayAllPoints, playbackStep, language])

  // Update ref when state changes
  useEffect(() => {
    playbackStateRef.current = { day: playbackDay, step: playbackStep, isPlaying }
  }, [playbackDay, playbackStep, isPlaying])

  const startPlayback = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPlaying(false)
      return
    }
    
    // Reset all filters before starting playback
    setMapFilter({ showRoute: true })
    setPlaybackDay(1)
    setPlaybackStep(0)
    setIsPlaying(true)
    
    intervalRef.current = setInterval(() => {
      const currentDay = playbackStateRef.current.day
      const currentStep = playbackStateRef.current.step
      
      const dayPoints = points
        .filter(p => p.day === currentDay)
        .sort((a, b) => {
          const aIndex = tripData.points.findIndex(point => point.id === a.id)
          const bIndex = tripData.points.findIndex(point => point.id === b.id)
          return aIndex - bIndex
        })
      
      if (currentStep + 1 >= dayPoints.length) {
        // Finished current day, move to next day
        if (currentDay >= 10) {
          setIsPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }
        setPlaybackDay(currentDay + 1)
        setPlaybackStep(0)
      } else {
        // Move to next step in current day
        setPlaybackStep(currentStep + 1)
      }
    }, playbackSpeed)
  }

  // Update interval speed when playbackSpeed changes during playback
  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        const currentDay = playbackStateRef.current.day
        const currentStep = playbackStateRef.current.step
        
        const dayPoints = points
          .filter(p => p.day === currentDay)
          .sort((a, b) => {
            const aIndex = tripData.points.findIndex(point => point.id === a.id)
            const bIndex = tripData.points.findIndex(point => point.id === b.id)
            return aIndex - bIndex
          })
        
        if (currentStep + 1 >= dayPoints.length) {
          if (currentDay >= 10) {
            setIsPlaying(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
          }
          setPlaybackDay(currentDay + 1)
          setPlaybackStep(0)
        } else {
          setPlaybackStep(currentStep + 1)
        }
      }, playbackSpeed)
    }
  }, [playbackSpeed, isPlaying, points])

  const getIconForPoint = (point: GeoPoint, isCurrentStep = false) => {
    const visitOrder = point.visitOrder || 0
    const title = translateLocation(point.title, language)
    
    if (point.isStart) return createMapIcon('#10b981', 'large', true, '🚀', undefined, title)
    if (point.isEnd) return createMapIcon('#ef4444', 'large', true, '🏁', undefined, title)
    
    if (isPlaying && visitOrder > 0) {
      // Show numbered markers during playback with colors based on category
      let color = '#3b82f6' // default blue
      if (point.category === 'food') color = '#f59e0b'
      else if (point.category === 'lodging') color = '#06b6d4'
      else if (point.category === 'sight') color = '#8b5cf6'
      
      // Make current step extra special
      const size = isCurrentStep ? 'large' : 'medium'
      const special = isCurrentStep
      
      return createMapIcon(color, size, special, '', visitOrder, title)
    }
    
    // Always show titles above markers
    if (point.category === 'city') return createMapIcon('#3b82f6', 'large', isCurrentStep, '🏙️', undefined, title)
    if (point.category === 'food') return createMapIcon('#f59e0b', 'medium', isCurrentStep, '🍽️', undefined, title)
    if (point.category === 'lodging') return createMapIcon('#06b6d4', 'medium', isCurrentStep, '🏨', undefined, title)
    return createMapIcon('#8b5cf6', 'medium', isCurrentStep, '🎯', undefined, title)
  }

  const addPhotoToPoint = async (pointId: string, file: File) => {
    const dataUrl = await fileToDataUrl(file)
    const photo: PhotoEntry = {
      id: `${pointId}-${Date.now()}`,
      url: dataUrl,
      timestamp: new Date().toISOString(),
      locationId: pointId,
      caption: ''
    }
    
    const existing = pointPhotos[pointId] || []
    setPointPhotos({
      ...pointPhotos,
      [pointId]: [...existing, photo]
    })
  }

  const addNoteToLocation = (locationId: string, author: string, content: string) => {
    const note: LocationNote = {
      id: `${locationId}-note-${Date.now()}`,
      locationId,
      author,
      content,
      timestamp: new Date().toISOString(),
      color: undefined
    }
    
    const existing = locationNotes[locationId] || []
    setLocationNotes({
      ...locationNotes,
      [locationId]: [...existing, note]
    })
  }

  const deleteNoteFromLocation = (locationId: string, noteId: string) => {
    const existing = locationNotes[locationId] || []
    setLocationNotes({
      ...locationNotes,
      [locationId]: existing.filter(n => n.id !== noteId)
    })
  }

  const openPhotoLightbox = (photos: { url: string; caption?: string }[], index: number) => {
    setLightboxPhotos(photos)
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <div className="h-[calc(100vh-56px)] relative">
      {/* Clean Minimal Top Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute z-[1000] left-4 top-4 right-4 flex items-start justify-between gap-4 pointer-events-none"
      >
        {/* Left Side - Main Actions */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Play Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={startPlayback}
              size="lg"
              className={cn(
                "shadow-lg font-medium transition-all",
                isPlaying 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isPlaying ? "Stop" : "Play Tour"}
            </Button>
          </motion.div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Right Side - Info & Speed */}
        <div className="flex flex-col gap-2 items-end pointer-events-auto">
          {/* Current Activity */}
          <AnimatePresence>
            {isPlaying && currentActivity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 max-w-xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Day {playbackDay}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {currentActivity}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speed Control - Compact */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Speed:
                  </span>
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    step="1000"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="w-32 h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        rgb(59, 130, 246) 0%, 
                        rgb(59, 130, 246) ${((8000 - playbackSpeed) / 7000) * 100}%, 
                        rgb(229, 231, 235) ${((8000 - playbackSpeed) / 7000) * 100}%, 
                        rgb(229, 231, 235) 100%)`
                    }}
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {playbackSpeed === 1000 && '🐇'}
                    {playbackSpeed === 2000 && '🏃'}
                    {playbackSpeed === 4000 && '🚶'}
                    {playbackSpeed === 6000 && '🐢'}
                    {playbackSpeed === 8000 && '🦥'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden Import Input */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".csv,.json,.geojson" 
          className="hidden" 
          onChange={async (e) => {
            const f = e.target.files?.[0]; 
            if (!f) return;
            try { 
              const imported = await importGeoPointsFromFile(f); 
              setPoints(mergePoints(points, imported));
            } catch(err) { 
              alert((err as Error).message);
            }
          }} 
        />
      </motion.div>

      {/* Compact Day Pills - Top Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute z-[1000] left-1/2 top-4 transform -translate-x-1/2 pointer-events-none"
      >
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-2 flex items-center gap-1.5 pointer-events-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(day => {
            const isSelected = mapFilter.selectedDay === day
            const isPlayingThisDay = isPlaying && playbackDay === day
            
            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMapFilter(prev => ({ 
                  ...prev, 
                  selectedDay: isSelected ? undefined : day 
                }))}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                  isSelected
                    ? "bg-blue-600 text-white shadow-md"
                    : isPlayingThisDay
                    ? "bg-red-500 text-white shadow-md animate-pulse"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
                title={`Day ${day}`}
              >
                {day}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Clean Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[999] left-4 top-32 pointer-events-none"
          >
            <Card className="w-64 bg-white dark:bg-gray-800 shadow-xl pointer-events-auto">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMapFilter({ showRoute: true })}
                    className="h-6 text-xs"
                  >
                    Clear
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    City
                  </label>
                  <select 
                    value={mapFilter.selectedCity || ''} 
                    onChange={(e) => setMapFilter(prev => ({ ...prev, selectedCity: e.target.value || undefined }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  >
                    <option value="">All Cities</option>
                    {cityInfo.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Category
                  </label>
                  <select 
                    value={mapFilter.selectedCategory || ''} 
                    onChange={(e) => setMapFilter(prev => ({ ...prev, selectedCategory: e.target.value as any || undefined }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="sight">🎯 Sights</option>
                    <option value="food">🍽️ Food</option>
                    <option value="lodging">🏨 Lodging</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={[43.5, 12.0]} zoom={6} className="h-full w-full" preferCanvas>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!isPlaying && <AutoFitBounds points={filteredPoints} />}
        {isPlaying && <CurrentStepZoom day={playbackDay} step={playbackStep} allPoints={points} />}
        
        
        {/* Route visualization */}
        {mapFilter.showRoute && (
          <Polyline
            positions={
              isPlaying ? 
                // During playback, show route only for current day
                playbackPoints
                  .sort((a, b) => {
                    const aIndex = tripData.points.findIndex(point => point.id === a.id)
                    const bIndex = tripData.points.findIndex(point => point.id === b.id)
                    return aIndex - bIndex
                  })
                  .map(p => [p.lat, p.lng] as [number, number]) :
                // Normal view, show full route
                points
                  .filter(p => p.day && p.day >= 1 && p.day <= 10)
                  .sort((a, b) => (a.day || 0) - (b.day || 0))
                  .map(p => [p.lat, p.lng] as [number, number])
            }
            pathOptions={{
              color: isPlaying ? '#ef4444' : '#6366f1',
              weight: isPlaying ? 5 : 4,
              opacity: 0.8,
              dashArray: isPlaying ? '10, 5' : undefined,
            }}
          />
        )}
        
        {/* Markers */}
        {(isPlaying ? playbackPoints : filteredPoints).map((point) => {
          const isCurrentStep = isPlaying && point.visitOrder === playbackStep + 1
          
          return (
            <Marker 
              key={point.id}
              position={[point.lat, point.lng]}
              icon={getIconForPoint(point, isCurrentStep)}
              eventHandlers={{
                click: () => setSelectedPoint(point)
              }}
            >
              <Popup maxWidth={400}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{translateLocation(point.title, language)}</h3>
                      {point.description && (
                        <p className="text-sm text-gray-600 mt-1">{point.description}</p>
                      )}
                    </div>
                    {point.visitOrder && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        #{point.visitOrder}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {point.region && (
                      <Badge variant="secondary" className="text-xs">
                        📍 {point.region}
                      </Badge>
                    )}
                    {point.day && (
                      <Badge variant="outline" className="text-xs">
                        📅 {t('day', { num: point.day })}
                      </Badge>
                    )}
                    <Badge variant={getBadgeVariant(point.category)} className="text-xs">
                      {getCategoryIcon(point.category)} {getCategoryLabel(point.category, t)}
                    </Badge>
                  </div>

                  {/* Photos for this point */}
                  {(pointPhotos[point.id] || []).length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('locationPhotos')}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {(pointPhotos[point.id] || []).slice(0, 6).map((photo, idx) => (
                          <button
                            key={photo.id}
                            onClick={() => openPhotoLightbox(
                              (pointPhotos[point.id] || []).map(p => ({ url: p.url, caption: p.caption })),
                              idx
                            )}
                            className="aspect-square object-cover rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                          >
                            <img 
                              src={photo.url} 
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPoint(point)
                        photoInputRef.current?.click()
                      }}
                      className="text-xs"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      {t('addPhoto')}
                    </Button>
                    
                    <NotesPanel
                      locationId={point.id}
                      locationName={translateLocation(point.title, language)}
                      notes={locationNotes[point.id] || []}
                      onAddNote={(author, content) => addNoteToLocation(point.id, author, content)}
                      onDeleteNote={(noteId) => deleteNoteFromLocation(point.id, noteId)}
                    />
                  </div>

                  {(point.isStart || point.isEnd) && (
                    <div className={cn(
                      "mt-3 p-2 rounded-lg text-sm",
                      point.isStart && "bg-green-50 text-green-800",
                      point.isEnd && "bg-red-50 text-red-800"
                    )}>
                      {point.isStart && `🚀 ${t('startPoint')}`}
                      {point.isEnd && `🏁 ${t('endPoint')}`}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
        </MapContainer>
      </div>

      {/* Photo Upload Input */}
      <input 
        ref={photoInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file && selectedPoint) {
            await addPhotoToPoint(selectedPoint.id, file)
          }
        }} 
      />

      {/* Clean Bottom Panel - City Chips */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 pointer-events-auto">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
              Cities:
            </span>
            {cityInfo.map(city => {
              const isSelected = mapFilter.selectedCity === city.name
              
              return (
                <motion.button
                  key={city.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMapFilter(prev => ({ 
                    ...prev, 
                    selectedCity: isSelected ? undefined : city.name 
                  }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0",
                    isSelected
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <span>{city.name}</span>
                  <span className={cn(
                    "text-[10px]",
                    isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {city.pointCount}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Photo Lightbox */}
      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  )
}

function AutoFitBounds({ points }: { points: GeoPoint[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (points.length === 0) return
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]))
    map.fitBounds(bounds.pad(0.1))
  }, [points, map])

  return null
}

function CurrentStepZoom({ day, step, allPoints }: { day: number, step: number, allPoints: GeoPoint[] }) {
  const map = useMap()
  const previousStepRef = useRef({ day: 0, step: 0 })
  
  useEffect(() => {
    // Only zoom if day or step actually changed
    if (previousStepRef.current.day === day && previousStepRef.current.step === step) {
      return
    }
    
    // Get the current day's points in order
    const dayPoints = allPoints
      .filter(p => p.day === day && p.lat && p.lng) // Ensure valid coordinates
      .sort((a, b) => {
        const aIndex = tripData.points.findIndex(point => point.id === a.id)
        const bIndex = tripData.points.findIndex(point => point.id === b.id)
        return aIndex - bIndex
      })
    
    // Get the current step point
    const currentPoint = dayPoints[step]
    
    if (currentPoint && typeof currentPoint.lat === 'number' && typeof currentPoint.lng === 'number') {
      // Always zoom to the current step location
      map.setView([currentPoint.lat, currentPoint.lng], 14, {
        animate: true,
        duration: 0.8
      })
      
      // Update previous step tracking
      previousStepRef.current = { day, step }
    }
  }, [day, step, allPoints, map])

  return null
}

function getBadgeVariant(category: string): 'city' | 'food' | 'lodging' | 'sight' | 'default' {
  const variants: Record<string, 'city' | 'food' | 'lodging' | 'sight' | 'default'> = {
    city: 'city',
    food: 'food',
    lodging: 'lodging',
    sight: 'sight',
    photo: 'default',
    other: 'default'
  }
  return variants[category] || 'default'
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    city: '🏙️',
    food: '🍽️',
    lodging: '🏨',
    sight: '🎯',
    photo: '📸',
    other: '📍'
  }
  return icons[category] || '📍'
}

function getCategoryLabel(category: string, t: any): string {
  const labels: Record<string, string> = {
    city: t('cities'),
    food: t('food'),
    lodging: t('lodging'),
    sight: t('sights'),
    photo: 'Photos',
    other: 'Other'
  }
  return labels[category] || 'Other'
}

function mergePoints(existing: GeoPoint[], imported: GeoPoint[]): GeoPoint[] {
  const map = new Map(existing.map(p => [p.id, p]))
  for (const p of imported) { 
    map.set(p.id, p) 
  }
  return Array.from(map.values())
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}