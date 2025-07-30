import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

const ErrorHandler = ({ error, onClear }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 max-w-md z-50"
        >
          <div className="bg-red-500 dark:bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start space-x-3 border dark:border-red-500">
            <FaExclamationTriangle className="text-xl mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Upload Error</h4>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <motion.button
              onClick={onClear}
              className="text-white hover:text-red-200 dark:hover:text-red-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ErrorHandler