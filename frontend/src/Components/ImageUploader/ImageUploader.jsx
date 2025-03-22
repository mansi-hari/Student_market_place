"use client"

import { useState, useRef } from "react"
import "./ImageUploader.css"

const ImageUploader = ({ onImagesChange, maxImages = 5, initialImages = [] }) => {
  const [images, setImages] = useState(initialImages)
  const [errors, setErrors] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    addImages(selectedFiles)
  }

  const addImages = (selectedFiles) => {
    // Clear previous errors
    setErrors([])

    // Validate file count
    if (images.length + selectedFiles.length > maxImages) {
      setErrors([`You can upload a maximum of ${maxImages} images`])
      return
    }

    // Validate file types and sizes
    const newErrors = []
    const validFiles = selectedFiles.filter((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        newErrors.push(`${file.name} is not an image file`)
        return false
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`${file.name} exceeds the 5MB size limit`)
        return false
      }

      return true
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    // Process valid files
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)

    // Notify parent component
    onImagesChange(updatedImages.map((img) => img.file))
  }

  const removeImage = (index) => {
    const updatedImages = [...images]

    // Revoke object URL to prevent memory leaks
    if (updatedImages[index].preview) {
      URL.revokeObjectURL(updatedImages[index].preview)
    }

    updatedImages.splice(index, 1)
    setImages(updatedImages)

    // Notify parent component
    onImagesChange(updatedImages.map((img) => img.file))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      addImages(droppedFiles)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="image-uploader">
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="alert alert-danger mb-3">
          <ul className="mb-0">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload area */}
      <div
        className={`upload-area ${isDragging ? "dragging" : ""}`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="d-none"
        />

        <div className="upload-icon">
          <i className="bi bi-cloud-arrow-up"></i>
        </div>
        <p className="upload-text">Drag and drop images here, or click to select files</p>
        <p className="upload-hint">Upload up to {maxImages} images (max 5MB each)</p>
        <p className="upload-count">
          {images.length} of {maxImages} images uploaded
        </p>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="image-previews mt-3">
          <div className="row g-2">
            {images.map((image, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <div className="image-preview-item">
                  <img src={image.preview || image} alt={`Preview ${index + 1}`} className="preview-image" />
                  <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                  <div className="image-name">{image.name}</div>
                </div>
              </div>
            ))}

            {/* Add more images button */}
            {images.length < maxImages && (
              <div className="col-6 col-md-4 col-lg-3">
                <div className="add-more-images" onClick={triggerFileInput}>
                  <i className="bi bi-plus-circle"></i>
                  <span>Add more</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader

