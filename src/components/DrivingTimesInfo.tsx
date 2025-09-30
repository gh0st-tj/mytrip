import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { tripData } from '../data'

interface DrivingTimesInfoProps {
  driveInfo?: string
}

export function DrivingTimesInfo({ driveInfo }: DrivingTimesInfoProps) {
  if (!driveInfo || !tripData.drivingTimes) return null

  // Extract city names from driveInfo to find relevant times
  const routes = tripData.drivingTimes.filter(dt => 
    driveInfo.includes(dt.from) && driveInfo.includes(dt.to)
  )

  if (routes.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 space-y-2"
    >
      {routes.map((route, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg px-3 py-2"
        >
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="font-medium">{route.from} → {route.to}:</span>
          <span className="font-semibold">{route.duration}</span>
          <span className="text-gray-500 dark:text-gray-400">({route.distance})</span>
        </div>
      ))}
    </motion.div>
  )
}
