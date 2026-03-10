import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = "image/*", maxMB = 5 }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    if (file.size > maxMB * 1024 * 1024) {
      setError(`File size must be less than ${maxMB}MB`);
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (onFileSelect) onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
            ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className={`w-8 h-8 mb-3 ${dragActive ? 'text-primary-600' : 'text-neutral-400'}`} />
            <p className="mb-2 text-sm text-neutral-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-neutral-500">SVG, PNG, JPG or GIF (MAX. {maxMB}MB)</p>
          </div>
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl bg-white shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              <UploadCloud size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-neutral-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-neutral-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={removeFile}
            className="p-1.5 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {error && <p className="mt-2 text-sm text-danger-500">{error}</p>}
    </div>
  );
}
