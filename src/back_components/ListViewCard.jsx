import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCopy, FaCheck, FaDownload, FaEye, FaImage, FaVideo, FaCalendarAlt, FaHdd } from 'react-icons/fa'

const ListViewCard = ({ file }) => {
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.secure_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isVideo = file.resource_type === 'video'

  return (
    <motion.div
      className="glass-effect dark:bg-gray-800/80 dark:border-gray-700/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {isVideo ? (
            <video
              src={file.secure_url}
              className="w-full h-full object-cover"
              poster={file.secure_url.replace(/\.[^/.]+$/, ".jpg")}
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={file.secure_url}
                alt={file.public_id}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 dark:border-blue-400"></div>
                </div>
              )}
            </div>
          )}
          
          {/* File Type Indicator */}
          <div className="absolute top-1 right-1">
            {isVideo ? (
              <FaVideo className="text-purple-500 text-xs bg-white dark:bg-gray-800 rounded-full p-1 w-4 h-4" />
            ) : (
              <FaImage className="text-green-500 text-xs bg-white dark:bg-gray-800 rounded-full p-1 w-4 h-4" />
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate mb-1">
                {file.original_filename || file.public_id}
              </h3>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FaHdd className="mr-1" />
                  <span>{formatFileSize(file.bytes)}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  <span>{formatDate(file.created_at)}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isVideo 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {isVideo ? 'Video' : 'Image'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                onClick={() => window.open(file.secure_url, '_blank')}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="View"
              >
                <FaEye className="text-sm" />
              </motion.button>
              
              <motion.a
                href={file.secure_url}
                download
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Download"
              >
                <FaDownload className="text-sm" />
              </motion.a>
              
              <motion.button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg font-medium transition-all ${
                  copied 
                    ? 'bg-green-500 dark:bg-green-600 text-white' 
                    : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={copied ? 'Copied!' : 'Copy URL'}
              >
                {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
              </motion.button>
            </div>
          </div>

          {/* URL Preview */}
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={file.secure_url}
                readOnly
                className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none text-gray-600 dark:text-gray-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ListViewCard