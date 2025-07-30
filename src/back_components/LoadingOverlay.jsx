import { motion, AnimatePresence } from 'framer-motion'
import { FaCloudUploadAlt, FaFile } from 'react-icons/fa'

const LoadingOverlay = ({ isVisible, progress = 0, currentFile = 0, totalFiles = 0 }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 text-center border dark:border-gray-700 shadow-2xl"
          >
            <motion.div
              animate={{ 
                rotate: progress < 100 ? 360 : 0,
                scale: progress === 100 ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 2, repeat: progress < 100 ? Infinity : 0, ease: "linear" },
                scale: { duration: 0.6, ease: "easeInOut" }
              }}
            >
              <FaCloudUploadAlt className={`text-6xl mx-auto mb-4 ${
                progress === 100 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-blue-500 dark:text-blue-400'
              }`} />
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
              {progress === 100 ? 'Upload Complete!' : 'Uploading Files'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {progress === 100 
                ? 'All files uploaded successfully!' 
                : `Uploading file ${currentFile} of ${totalFiles}...`
              }
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
              <motion.div
                className={`h-3 rounded-full transition-colors duration-300 ${
                  progress === 100 
                    ? 'bg-green-500 dark:bg-green-400' 
                    : 'bg-blue-500 dark:bg-blue-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Percentage Display */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaFile className="mr-2" />
                <span>{currentFile}/{totalFiles} files</span>
              </div>
              <motion.span 
                className={`font-bold text-lg ${
                  progress === 100 
                    ? 'text-green-500 dark:text-green-400' 
                    : 'text-blue-500 dark:text-blue-400'
                }`}
                key={progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {progress}%
              </motion.span>
            </div>

            {/* Upload Speed Indicator */}
            {progress > 0 && progress < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex justify-center"
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay