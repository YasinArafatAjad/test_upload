import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "./UploadZone";
import Gallery from "./Gallery";
import LoadingOverlay from "./LoadingOverlay";
import ErrorHandler from "./ErrorHandler";
import SuccessNotification from "./SuccessNotification";
import useAxiosSecure from "./useAxiosSecure";
import { useCloudinaryLinks } from "./useCloudinaryLinks";

function Upload() {
  const axiosSecure = useAxiosSecure();

  // React Query: fetch stored Cloudinary links
  const { data: cloudinaryLinks = [], refetch: refetchCloudinaryLinks } =
    useCloudinaryLinks();
  // console.log('Cloudinary Links:', cloudinaryLinks);

  // Local state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const appName = "FreeFeel Upload";
  const appDescription =
    "Lightning-fast file uploads with unlimited storage. Drag, drop, and share your media instantly.";

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setTotalFiles(files.length);

    try {
      const uploadPromises = Array.from(files).map((file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const fileProgress = (event.loaded / event.total) * 100;
              const overallProgress =
                ((index + fileProgress / 100) / files.length) * 100;
              setUploadProgress(Math.round(overallProgress));
              setCurrentFileIndex(index + 1);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed for ${file.name}`));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error(`Upload failed for ${file.name}`));
          });

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            }/auto/upload`
          );
          xhr.send(formData);
        });
      });

      const results = await Promise.all(uploadPromises);
      setUploadProgress(100);

      // Save uploaded file info to backend
      for (const file of results) {
        await axiosSecure.post("/cloudinary/upload-link", {
          url: file.secure_url,
          public_id: file.public_id,
          original_filename: file.original_filename,
          resource_type: file.resource_type,
          bytes: file.bytes,
          created_at: file.created_at,
        });
      }

      await refetchCloudinaryLinks(); // 🔁 Refresh gallery

      const message =
        results.length === 1
          ? `Successfully uploaded 1 file!`
          : `Successfully uploaded ${results.length} files!`;
      setSuccessMessage(message);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentFileIndex(0);
        setTotalFiles(0);
      }, 500);
    }
  };
  // delete function
  const handleDeleteFile = async (file) => {
    try {
      await axiosSecure.delete(`/cloudinary/delete-link/${file.public_id}`);
      await refetchCloudinaryLinks(); // update UI after deletion
    } catch (err) {
      setError(`Failed to delete ${file.original_filename}`);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setShowSuccess(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f4f4] via-gray-50 to-[#f4f4f4] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-4 text-blue-500 dark:text-blue-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {appName}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {appDescription}
            </motion.p>
          </div>

          <UploadZone
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />

          <AnimatePresence>
            {cloudinaryLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-16"
              >
                <Gallery
                  onDeleteFile={handleDeleteFile}
                  files={cloudinaryLinks.map((file) => ({
                    ...file,
                    secure_url: file.url, // ✅ Needed for image/video display and copy field
                    created_at: file.uploadedAt, // ✅ Needed for date formatting
                    resource_type: file.url.match(/\.(mp4|mov|avi|webm)$/i)
                      ? "video"
                      : "image", // ✅ Needed for type badge
                    bytes: file.bytes || 0, // Optional: fallback if not stored
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <LoadingOverlay
        isVisible={isUploading}
        progress={uploadProgress}
        currentFile={currentFileIndex}
        totalFiles={totalFiles}
      />
      <ErrorHandler error={error} onClear={clearError} />
      <SuccessNotification
        isVisible={showSuccess}
        message={successMessage}
        onClear={clearSuccess}
      />
    </div>
  );
}

export default Upload;
