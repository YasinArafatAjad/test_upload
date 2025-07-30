import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck, FaTrash, FaDownload, FaEye } from "react-icons/fa";

const PreviewCard = ({ file, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.secure_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVideo = file.resource_type === "video";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
    >
      <div className="relative group">
        {isVideo ? (
          <video
            src={file.secure_url}
            poster={file.secure_url.replace(/\.[^/.]+$/, ".jpg")}
            controls
            className="w-full h-48 object-cover"
          />
        ) : (
          <>
            <img
              src={file.secure_url}
              alt={file.original_filename || file.public_id || "preview"}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-400"></div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={() => window.open(file.secure_url, "_blank")}
            className="p-2 rounded-full bg-black/60 dark:bg-white/20 text-white hover:bg-black/80 dark:hover:bg-white/30 transition-colors"
            title="View"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="View file"
          >
            <FaEye />
          </motion.button>
          <motion.a
            href={file.secure_url}
            download
            className="p-2 rounded-full bg-black/60 dark:bg-white/20 text-white hover:bg-black/80 dark:hover:bg-white/30 transition-colors"
            title="Download"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Download file"
          >
            <FaDownload />
          </motion.a>
        </div>
      </div>

      {/* Info & Actions */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
              {file.original_filename || file.public_id}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatFileSize(file.bytes)} • {formatDate(file.created_at)}
            </p>
          </div>
          <span
            className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
              isVideo
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            }`}
          >
            {isVideo ? "Video" : "Image"}
          </span>
        </div>
        <div className="Link">
          <input
            type="text"
            value={file.secure_url}
            readOnly
            className="px-3 py-2 mb-2 w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="mt-auto flex space-x-2">
          <motion.button
            onClick={copyToClipboard}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg font-semibold transition-colors ${
              copied
                ? "bg-green-500 text-white dark:bg-green-600"
                : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            }`}
            title="Copy URL"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <FaCheck /> : <FaCopy />} {copied ? "Copied" : "Copy URL"}
          </motion.button>

          <motion.button
            onClick={() => onDelete?.(file)}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-200 text-red-600 hover:bg-red-100 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900 transition-colors font-semibold"
            title="Delete file"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash /> Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewCard;
