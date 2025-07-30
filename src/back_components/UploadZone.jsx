import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCloudUploadAlt, FaImage, FaVideo, FaFileAlt } from 'react-icons/fa'

const UploadZone = ({ onFileUpload, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragActive(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setDragCounter(0)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileUpload(files)
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragActive 
            ? 'border-green-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl"
            >
              <div className="text-blue-500 dark:text-blue-400">
                <FaCloudUploadAlt className="text-6xl mx-auto mb-4 animate-bounce" />
                <p className="text-xl font-semibold">Drop files here!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaCloudUploadAlt className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-6 animate-pulse" />
          
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
            {isUploading ? 'Uploading...' : 'Drop your files here'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Upload images and videos of any size. Supports all major formats including 
            JPG, PNG, GIF, MP4, AVI, and more.
          </p>

          <motion.button
            onClick={openFileDialog}
            disabled={isUploading}
            className="inline-flex items-center px-8 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            <FaFileAlt className="mr-2" />
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </motion.button>
        </motion.div>

        <div className="flex justify-center space-x-8 mt-8">
          <motion.div 
            className="flex items-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FaImage className="text-2xl mr-2" />
            <span>Images</span>
          </motion.div>
          <motion.div 
            className="flex items-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FaVideo className="text-2xl mr-2" />
            <span>Videos</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default UploadZone