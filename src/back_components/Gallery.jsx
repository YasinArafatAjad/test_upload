import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaImages, FaVideo, FaFilter, FaSearch, FaTh, FaList } from 'react-icons/fa'
import PreviewCard from './PreviewCard'
import ListViewCard from './ListViewCard'

const Gallery = ({ files }) => {
  const [filter, setFilter] = useState('all') // 'all', 'images', 'videos'
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list'

  // Filter files based on type and search term
  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === 'all' || 
      (filter === 'images' && file.resource_type === 'image') ||
      (filter === 'videos' && file.resource_type === 'video')
    
    const matchesSearch = searchTerm === '' || 
      (file.original_filename || file.public_id).toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const imageCount = files.filter(file => file.resource_type === 'image').length
  const videoCount = files.filter(file => file.resource_type === 'video').length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div className="w-full">
      {/* Gallery Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            Media Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {files.length} total files • {imageCount} images • {videoCount} videos
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaTh />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaList />
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0"
      >
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setFilter('all')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilter className="mr-2" />
            All ({files.length})
          </motion.button>
          <motion.button
            onClick={() => setFilter('images')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'images' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaImages className="mr-2" />
            Images ({imageCount})
          </motion.button>
          <motion.button
            onClick={() => setFilter('videos')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'videos' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <FaVideo className="mr-2" />
            Videos ({videoCount})
          </motion.button>
        </div>
      </motion.div>

      {/* Gallery Grid/List */}
      <AnimatePresence mode="wait">
        {filteredFiles.length > 0 ? (
          <motion.div
            key={`${filter}-${viewMode}-${searchTerm}`}
            className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-3"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.public_id || index}
                variants={viewMode === 'list' ? listItemVariants : itemVariants}
                layout
              >
                {viewMode === 'list' ? (
                  <ListViewCard file={file} />
                ) : (
                  <PreviewCard file={file} />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FaImages className="text-6xl mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No files found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm 
                ? `No files match "${searchTerm}" in the ${filter} category.`
                : `No ${filter === 'all' ? 'files' : filter} found.`
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Stats */}
      {filteredFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Showing {filteredFiles.length} of {files.length} files
          {searchTerm && ` matching "${searchTerm}"`}
          {filter !== 'all' && ` in ${filter}`}
        </motion.div>
      )}
    </div>
  )
}

export default Gallery