import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { DayView } from './views/DayView'
import { MapView } from './views/MapView'
import { TimelineView } from './views/TimelineView'

export type ViewType = 'day' | 'map' | 'timeline'

export default function App() {
  const [view, setView] = useState<ViewType>('day')
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header active={view} onChangeView={setView} />
      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          {view === 'day' && <DayView />}
          {view === 'map' && <MapView />}
          {view === 'timeline' && <TimelineView />}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
