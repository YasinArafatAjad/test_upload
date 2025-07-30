import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCopy, FaCheck, FaDownload, FaEye } from 'react-icons/fa'

const PreviewCard = ({ file }) => {
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
      className="glass-effect dark:bg-gray-800/80 dark:border-gray-700/20 rounded-2xl overflow-hidden"
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative group">
        {isVideo ? (
          <video
            src={file.secure_url}
            className="w-full h-48 object-cover"
            controls
            poster={file.secure_url.replace(/\.[^/.]+$/, ".jpg")}
          />
        ) : (
          <div className="relative">
            <img
              src={file.secure_url}
              alt={file.public_id}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
              </div>
            )}
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={() => window.open(file.secure_url, '_blank')}
            className="p-2 bg-black/50 dark:bg-black/70 text-white rounded-full hover:bg-black/70 dark:hover:bg-black/90 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaEye className="text-sm" />
          </motion.button>
          <motion.a
            href={file.secure_url}
            download
            className="p-2 bg-black/50 dark:bg-black/70 text-white rounded-full hover:bg-black/70 dark:hover:bg-black/90 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaDownload className="text-sm" />
          </motion.a>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
              {file.original_filename || file.public_id}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatFileSize(file.bytes)} • {formatDate(file.created_at)}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isVideo 
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          }`}>
            {isVideo ? 'Video' : 'Image'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={file.secure_url}
            readOnly
            className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-700 dark:text-gray-200"
          />
          <motion.button
            onClick={copyToClipboard}
            className={`p-2 rounded-lg font-medium transition-all ${
              copied 
                ? 'bg-green-500 dark:bg-green-600 text-white' 
                : 'bg-rose-500 dark:bg-rose-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default PreviewCard