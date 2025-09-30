import { useMemo, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Save, X, Play, Pause, SkipForward, SkipBack, MapPin, Clock, Camera, BookOpen, Car } from 'lucide-react'
import { tripData } from '../data'
import type { DayPlan, StopItem } from '../types'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { cn } from '../utils/cn'
import { translateLocation } from '../utils/translations'
import { useSettings } from '../state/SettingsContext'
import { PhotoLightbox } from '../components/PhotoLightbox'

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

export function DayView() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [days, setDays] = useLocalState<DayPlan[]>('days', tripData.days)
  const [journal, setJournal] = useLocalState<Record<number, { text: string, photos: string[] }>>('journal', {})
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lightboxPhotos, setLightboxPhotos] = useState<{ url: string; caption?: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const sorted = useMemo(() => [...days].sort((a,b)=>a.dayNumber-b.dayNumber), [days])

  const playthrough = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPlaying(false)
      return
    }
    
    setIsPlaying(true)
    intervalRef.current = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= 10) {
          setIsPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 1
        }
        return prev + 1
      })
    }, 8000) // Increased to 8 seconds per day
  }

  const onSaveDay = (dayNumber: number, partial: Partial<DayPlan>) => {
    const next = days.map(d => d.dayNumber===dayNumber ? { ...d, ...partial } : d)
    setDays(next)
    setEditingDay(null)
  }


  const onAddNote = (dayNumber: number, note: string) => {
    const next = days.map(d => d.dayNumber===dayNumber ? { ...d, summary: note } : d)
    setDays(next)
  }

  const onPhoto = async (dayNumber: number, file: File) => {
    const dataUrl = await fileToDataUrl(file)
    const entry = journal[dayNumber] || { text: '', photos: [] }
    const updated = { ...journal, [dayNumber]: { ...entry, photos: [...entry.photos, dataUrl] } }
    setJournal(updated)
  }

  const currentDayData = sorted.find(d => d.dayNumber === currentDay)

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div 
              className="text-white/80 text-lg tracking-wider uppercase font-light mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ✈️ Tom & Alina's
            </motion.div>
            <motion.h1 
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              ITALY
            </motion.h1>
            <motion.div 
              className="text-3xl sm:text-4xl font-light text-white/90 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              October 6–15, 2025
            </motion.div>
            <motion.p 
              className="mt-8 text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Rome → Val d'Orcia → Chianti → Florence → Venice
            </motion.p>
            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl"
                onClick={() => {
                  setCurrentDay(1)
                  // Scroll to content after hero
                  setTimeout(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                  }, 100)
                }}
              >
                <Play className="h-5 w-5 mr-2" />
                {t('beginJourney')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur"
                onClick={() => {
                  playthrough()
                  // Scroll to content after hero
                  setTimeout(() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                  }, 100)
                }}
              >
                {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isPlaying ? t('pauseTour') : t('autoTour')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Playback Controls */}
      <motion.div 
        className="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={playthrough}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCurrentDay(Math.min(10, currentDay + 1))}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm font-medium">
                {t('dayOf', { current: currentDay, total: 10 })}
              </div>
            </div>
            
            {/* Day selector dots */}
            <div className="flex gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-all duration-300",
                    currentDay === day 
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 shadow-lg" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Day Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentDayData && (
            <motion.div
              key={currentDay}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="mb-16"
            >
              <Card className="overflow-hidden shadow-2xl border-0">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl shadow-lg"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentDayData.dayNumber}
                        </motion.div>
                        <div>
                          <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                            {t('day', { num: currentDayData.dayNumber })} · {format(parseISO(currentDayData.dateISO), 'EEEE, MMMM d')}
                          </div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {currentDayData.cityArea}
                          </h2>
                        </div>
                      </div>
                      {currentDayData.driveInfo && (
                        <motion.div 
                          className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Car className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">{t('drive')}: {currentDayData.driveInfo}</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <AnimatePresence mode="wait">
                        {editingDay === currentDayData.dayNumber ? (
                          <motion.div
                            key="editing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex gap-3"
                          >
                            <Button onClick={() => onSaveDay(currentDayData.dayNumber, currentDayData)} className="shadow-lg">
                              <Save className="h-4 w-4 mr-2" />
                              {t('save')}
                            </Button>
                            <Button variant="outline" onClick={() => setEditingDay(null)} className="shadow-lg">
                              <X className="h-4 w-4 mr-2" />
                              {t('cancel')}
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="not-editing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Button variant="outline" onClick={() => setEditingDay(currentDayData.dayNumber)} className="shadow-lg">
                              <Edit3 className="h-4 w-4 mr-2" />
                              {t('edit')}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <motion.h3 
                          className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                          <MapPin className="h-5 w-5" />
                          {t('itinerary')}
                        </motion.h3>
                        <motion.div 
                          className="space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, staggerChildren: 0.1 }}
                        >
                          <AnimatePresence>
                            {currentDayData.stops.map((s, i) => (
                              <motion.div
                                key={s.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                              >
                                <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 hover:shadow-lg transition-all duration-300">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Badge variant={getBadgeVariant(s.type)} className="text-sm px-3 py-1">
                                      {getStopIcon(s.type)}
                                    </Badge>
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    {editingDay === currentDayData.dayNumber ? (
                                      <input 
                                        value={s.title} 
                                        onChange={(e) => updateStop(setDays, days, currentDayData.dayNumber, i, { title: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none font-semibold text-lg pb-2"
                                      />
                                    ) : (
                                      <div className="font-semibold text-lg text-gray-900 dark:text-white">
                                        {translateLocation(s.title, language)}
                                      </div>
                                    )}
                                    {s.time && (
                                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        {s.time}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                          <BookOpen className="h-5 w-5" />
                          {t('notes')}
                        </h3>
                        {editingDay === currentDayData.dayNumber ? (
                          <textarea 
                            defaultValue={currentDayData.summary || ''} 
                            onBlur={(e) => onAddNote(currentDayData.dayNumber, e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none resize-none shadow-lg"
                            rows={4}
                            placeholder={t('addNotesAboutDay')}
                          />
                        ) : (
                          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-4 min-h-[80px] shadow-inner">
                            {currentDayData.summary ? translateLocation(currentDayData.summary, language) : <span className="text-gray-400 italic">{t('noNotesYet')}</span>}
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />
                          <BookOpen className="h-5 w-5" />
                          {t('journal')}
                        </h3>
                        <textarea 
                          placeholder={t('writeExperience')}
                          value={journal[currentDayData.dayNumber]?.text || ''} 
                          onChange={(e) => setJournal({ 
                            ...journal, 
                            [currentDayData.dayNumber]: { 
                              ...(journal[currentDayData.dayNumber] || { text: '', photos: [] }), 
                              text: e.target.value 
                            } 
                          })}
                          className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 focus:border-green-500 dark:focus:border-green-400 focus:outline-none resize-none shadow-lg"
                          rows={6}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                          <Camera className="h-5 w-5" />
                          {t('addPhoto')}
                        </h3>
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => { 
                              const f = e.target.files?.[0]; 
                              if (f) onPhoto(currentDayData.dayNumber, f) 
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-300 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            </motion.div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('clickToUpload')}</p>
                            <p className="text-xs text-gray-400 mt-1">{t('dragDropClick')}</p>
                          </div>
                        </motion.div>
                        
                        {(journal[currentDayData.dayNumber]?.photos?.length ?? 0) > 0 && (
                          <motion.div 
                            className="grid grid-cols-2 gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <AnimatePresence>
                              {(journal[currentDayData.dayNumber]?.photos || []).map((src, idx) => (
                                <motion.button
                                  key={idx}
                                  onClick={() => {
                                    setLightboxPhotos((journal[currentDayData.dayNumber]?.photos || []).map(url => ({ url })))
                                    setLightboxIndex(idx)
                                    setIsLightboxOpen(true)
                                  }}
                                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                  whileHover={{ scale: 1.05, rotate: 2 }}
                                  className="relative group"
                                >
                                  <img 
                                    src={src} 
                                    alt={`Memory ${idx + 1}`}
                                    className="aspect-square object-cover rounded-xl shadow-lg border-2 border-white dark:border-gray-700"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                  <div className="absolute bottom-2 left-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Memory {idx + 1}
                                  </div>
                                </motion.button>
                              ))}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

function getBadgeVariant(type: StopItem['type']) {
  const variants = {
    city: 'city',
    food: 'food',
    lodging: 'lodging',
    sight: 'sight',
    photo: 'default',
    other: 'default'
  }
  return variants[type] || 'default'
}

function getStopIcon(type: StopItem['type']) {
  const icons = {
    city: '🏙️',
    food: '🍽️',
    lodging: '🏨',
    sight: '🎯',
    photo: '📸',
    other: '📍'
  }
  return icons[type] || '📍'
}

function updateStop(setDays: (d: DayPlan[])=>void, days: DayPlan[], dayNumber: number, index: number, partial: Partial<StopItem>){
  const next = days.map(d => {
    if (d.dayNumber !== dayNumber) return d
    const copy = [...d.stops]
    copy[index] = { ...copy[index], ...partial }
    return { ...d, stops: copy }
  })
  setDays(next)
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve,reject)=>{
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}