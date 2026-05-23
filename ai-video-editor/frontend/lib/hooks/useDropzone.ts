import { useState } from 'react'

export const useDropzone = (onDrop: (files: File[]) => void) => {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    onDrop(files)
  }

  return {
    getRootProps: () => ({
      onDragEnter: handleDrag,
      onDragLeave: handleDrag,
      onDragOver: handleDrag,
      onDrop: handleDrop,
    }),
    getInputProps: () => ({
      type: 'file',
      multiple: false,
      accept: 'video/*',
    }),
    isDragActive,
  }
}
