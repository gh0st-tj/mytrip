import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Map, Calendar, MapPin, List } from 'lucide-react'
import { useSettings } from '../state/SettingsContext'
import { cn } from '../utils/cn'
import type { ViewType } from '../App'

export function Header({ active, onChangeView }: { active: ViewType, onChangeView: (v: ViewType) => void }) {
  const { t } = useTranslation()
  const { language, setLanguage, theme, setTheme } = useSettings()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/98 backdrop-blur-lg dark:bg-gray-950/98 shadow-sm safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent truncate">
                <span className="hidden sm:inline">{t('appTitle')}</span>
                <span className="sm:hidden">Italy Trip</span>
              </h1>
            </div>
            
            <nav className="hidden sm:flex">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-gray-50 dark:bg-gray-900">
                {[
                  { key: 'day', icon: Calendar, label: t('viewDayByDay') },
                  { key: 'timeline', icon: List, label: 'Timeline' },
                  { key: 'map', icon: Map, label: t('viewMap') }
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => onChangeView(key as ViewType)}
                    className={cn(
                      'relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-200',
                      'rounded-md',
                      active === key
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    )}
                  >
                    {active === key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white dark:bg-gray-950 rounded-md shadow-sm"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-900">
              {[
                { code: 'en', label: 'EN', flag: '🇺🇸' },
                { code: 'he', label: 'עב', flag: '🇮🇱' }
              ].map(({ code, label, flag }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as 'en' | 'he')}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-all duration-200 min-h-[32px]',
                    language === code
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  <span>{flag}</span>
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-900">
              {[
                { value: 'light', icon: '☀️', label: 'Light' },
                { value: 'dark', icon: '🌙', label: 'Dark' },
                { value: 'system', icon: '💻', label: 'Auto' }
              ].map(({ value, icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as any)}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-base font-medium rounded transition-all duration-200',
                    theme === value
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                  title={label}
                  aria-label={label}
                >
                  <span>{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile nav - Touch Optimized */}
        <div className="sm:hidden mt-2.5">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-900">
            {[
              { key: 'day', icon: Calendar, shortLabel: 'Day' },
              { key: 'timeline', icon: List, shortLabel: 'Timeline' },
              { key: 'map', icon: Map, shortLabel: 'Map' }
            ].map(({ key, icon: Icon, shortLabel }) => (
              <button
                key={key}
                onClick={() => onChangeView(key as ViewType)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs font-semibold transition-all duration-200 min-h-[56px]',
                  'rounded-md',
                  active === key
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                    : 'text-gray-600 active:text-gray-900 dark:text-gray-400 dark:active:text-white active:bg-gray-100 dark:active:bg-gray-800'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}


