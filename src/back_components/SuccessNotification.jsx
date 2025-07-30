import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaTimes, FaCloudUploadAlt } from 'react-icons/fa'

const SuccessNotification = ({ isVisible, message, onClear }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-4 right-4 max-w-md z-50"
                >
                    <div className="bg-green-500 dark:bg-green-600 text-white rounded-lg shadow-2xl p-4 flex items-start space-x-3 border border-green-400 dark:border-green-500">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                        >
                            <FaCheckCircle className="text-2xl mt-0.5 flex-shrink-0" />
                        </motion.div>

                        <div className="flex-1">
                            <motion.h4
                                className="font-semibold mb-1 flex items-center"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FaCloudUploadAlt className="mr-2" />
                                Upload Complete!
                            </motion.h4>
                            <motion.p
                                className="text-sm opacity-90"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {message}
                            </motion.p>
                        </div>

                        <motion.button
                            onClick={onClear}
                            className="text-white hover:text-green-200 dark:hover:text-green-300 transition-colors p-1 rounded-full hover:bg-green-600 dark:hover:bg-green-700"
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <FaTimes className="text-sm" />
                        </motion.button>
                    </div>

                    {/* Auto-dismiss after 4 seconds */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-green-300 dark:bg-green-400 rounded-b-lg"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        onAnimationComplete={onClear}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SuccessNotification