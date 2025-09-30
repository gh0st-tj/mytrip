import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User } from 'lucide-react'
import type { LocationNote } from '../types'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { cn } from '../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface NotesPanelProps {
  locationId: string
  locationName: string
  notes: LocationNote[]
  onAddNote: (author: string, content: string) => void
  onDeleteNote?: (noteId: string) => void
}

const NOTE_COLORS = [
  '#fef3c7', // yellow
  '#dbeafe', // blue
  '#fce7f3', // pink
  '#d1fae5', // green
  '#e0e7ff', // indigo
  '#fecaca', // red
  '#fed7aa', // orange
]

export function NotesPanel({ locationName, notes, onAddNote, onDeleteNote }: NotesPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [author, setAuthor] = useState(() => localStorage.getItem('tripNotesAuthor') || '')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    
    localStorage.setItem('tripNotesAuthor', author)
    onAddNote(author.trim(), content.trim())
    setContent('')
  }

  return (
    <>
      {/* Floating Notes Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm",
          "hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
        )}
      >
        <MessageCircle className="h-4 w-4" />
        <span>Notes</span>
        {notes.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {notes.length}
          </motion.div>
        )}
      </motion.button>

      {/* Notes Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000]"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-gray-900 shadow-2xl z-[2001] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">📝 Location Notes</h2>
                    <p className="text-blue-100 text-sm">{locationName}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <AnimatePresence mode="popLayout">
                  {notes.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <MessageCircle className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No notes yet. Be the first to add one!</p>
                    </motion.div>
                  ) : (
                    notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <Card 
                          className="p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4"
                          style={{ 
                            backgroundColor: note.color || NOTE_COLORS[index % NOTE_COLORS.length],
                            borderLeftColor: 'rgba(0,0,0,0.2)'
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-full">
                                <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{note.author}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                            {onDeleteNote && (
                              <button
                                onClick={() => onDeleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap pl-12">
                            {note.content}
                          </p>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Add Note Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Tom, Alina, etc."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Note
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Add your thoughts, tips, or memories about this place..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!author.trim() || !content.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
