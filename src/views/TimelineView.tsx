import { motion } from 'framer-motion'
import { MapPin, Calendar, Car, Moon, Camera } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { tripData } from '../data'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'
import { translateLocation } from '../utils/translations'
import { useSettings } from '../state/SettingsContext'

export function TimelineView() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-16 px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black mb-4"
        >
          🗓️ Trip Timeline
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90"
        >
          Your journey through Italy, day by day
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full"
        >
          <Calendar className="h-5 w-5" />
          <span className="font-medium">October 6–15, 2025 • 10 Days</span>
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-6 py-16 relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 transform -translate-x-1/2 hidden md:block" />

        {tripData.days.map((day, index) => {
          const isLeft = index % 2 === 0
          const isHovered = hoveredDay === day.dayNumber

          return (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHoveredDay(day.dayNumber)}
              onMouseLeave={() => setHoveredDay(null)}
              className="relative mb-16"
            >
              {/* Mobile-only date badge */}
              <div className="md:hidden mb-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {format(parseISO(day.dateISO), 'EEEE, MMMM d')}
                </Badge>
              </div>

              <div className={cn(
                "flex items-center gap-8",
                "md:grid md:grid-cols-2 md:gap-16"
              )}>
                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    "w-full",
                    isLeft ? "md:col-start-1" : "md:col-start-2"
                  )}
                >
                  <Card className={cn(
                    "overflow-hidden border-2 transition-all duration-300",
                    isHovered 
                      ? "border-purple-400 dark:border-purple-600 shadow-2xl" 
                      : "border-transparent shadow-lg"
                  )}>
                    {/* Card Header with gradient */}
                    <div className={cn(
                      "p-6 bg-gradient-to-br",
                      day.dayNumber <= 2 ? "from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950" :
                      day.dayNumber <= 5 ? "from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950" :
                      day.dayNumber <= 7 ? "from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950" :
                      "from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg font-bold text-xl text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600"
                        >
                          {day.dayNumber}
                        </motion.div>
                        <div className="hidden md:block">
                          <Badge variant="secondary" className="bg-white/60 dark:bg-gray-800/60">
                            {format(parseISO(day.dateISO), 'EEE, MMM d')}
                          </Badge>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {day.cityArea}
                      </h3>
                      
                      {day.driveInfo && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                          <Car className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{day.driveInfo}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Summary */}
                      {day.summary && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {translateLocation(day.summary, language)}
                        </p>
                      )}

                      {/* Stops */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Highlights
                        </h4>
                        <div className="space-y-2">
                          {day.stops.map((stop, idx) => (
                            <motion.div
                              key={stop.id}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Badge variant={getBadgeVariant(stop.type)} className="text-xs shrink-0">
                                {getStopIcon(stop.type)}
                              </Badge>
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {translateLocation(stop.title, language)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Sleep Suggestion */}
                      {day.sleepSuggestion && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                          <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">
                              Where to Sleep
                            </div>
                            <div className="text-sm text-indigo-800 dark:text-indigo-200">
                              {day.sleepSuggestion}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* Timeline Node (desktop only) */}
                <div className={cn(
                  "hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2",
                  isLeft ? "md:order-2" : "md:order-1"
                )}>
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className={cn(
                      "w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10",
                      "bg-gradient-to-br from-indigo-500 to-purple-600",
                      isHovered && "ring-4 ring-purple-300 dark:ring-purple-700"
                    )}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* End Marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 mt-16"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🏁</span>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Journey Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              What an amazing adventure through Italy 🇮🇹
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getBadgeVariant(type: string) {
  const variants: Record<string, any> = {
    city: 'city',
    food: 'food',
    lodging: 'lodging',
    sight: 'sight',
    photo: 'default',
    other: 'default'
  }
  return variants[type] || 'default'
}

function getStopIcon(type: string) {
  const icons: Record<string, string> = {
    city: '🏙️',
    food: '🍽️',
    lodging: '🏨',
    sight: '🎯',
    photo: '📸',
    other: '📍'
  }
  return icons[type] || '📍'
}
