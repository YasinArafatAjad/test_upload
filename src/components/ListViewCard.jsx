import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaCopy, FaCheck, FaDownload, FaEye, FaImage,
  FaVideo, FaCalendarAlt, FaHdd, FaTrash
} from 'react-icons/fa'

const ListViewCard = ({ file, onDelete }) => {
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
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
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
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
        {isVideo ? (
          <video
            src={file.secure_url}
            poster={file.secure_url.replace(/\.[^/.]+$/, '.jpg')}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <>
            <img
              src={file.secure_url}
              alt={file.original_filename}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 border-b-2 border-blue-600 animate-spin rounded-full" />
              </div>
            )}
          </>
        )}
        <div className="absolute top-1 right-1 p-1 rounded-full bg-white dark:bg-gray-800">
          {isVideo ? (
            <FaVideo className="text-purple-500 text-xs" />
          ) : (
            <FaImage className="text-green-500 text-xs" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {file.original_filename || file.public_id}
            </h3>
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <FaHdd /> {formatFileSize(file.bytes)}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> {formatDate(file.created_at)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  isVideo
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}
              >
                {isVideo ? 'Video' : 'Image'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 ml-4">
            <motion.button
              onClick={() => window.open(file.secure_url, '_blank')}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="View"
            >
              <FaEye className="text-sm" />
            </motion.button>

            <motion.a
              href={file.secure_url}
              download
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
              whileTap={{ scale: 0.95 }}
              title={copied ? 'Copied!' : 'Copy URL'}
            >
              {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
            </motion.button>

            <motion.button
              onClick={() => onDelete?.(file)}
              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Delete"
            >
              <FaTrash className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* URL */}
        <div className="mt-3">
          <input
            type="text"
            value={file.secure_url}
            readOnly
            className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-200 font-mono"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default ListViewCard
