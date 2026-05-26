import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  onImageSelect: (base64: string) => void;
  preview?: string;
  variant?: "compact" | "full";
  className?: string;
}

export function ImageUploader({
  label,
  onImageSelect,
  preview,
  variant = "compact",
  className = "",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (variant === "full") {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {label}
        </label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-8
            transition-all duration-200 cursor-pointer
            ${
              isDragging
                ? "border-yellow-400 bg-yellow-400/5"
                : "border-white/20 bg-white/4 hover:border-white/30 hover:bg-white/6"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            ) : (
              <ImageIcon size={48} className="text-gray-600 mb-3" />
            )}

            <p className="text-white font-semibold text-center">
              {preview ? "Change image" : "Drop image here"}
            </p>
            <p className="text-gray-400 text-sm text-center mt-1">
              or click to browse
            </p>
            <p className="text-gray-500 text-xs text-center mt-2">
              Max 5MB • PNG, JPG, WEBP
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />
      </div>
    );
  }

  // Compact variant
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-xl border transition-all duration-200 cursor-pointer
          flex items-center justify-center gap-2 py-3 px-4
          ${
            isDragging
              ? "border-yellow-400 bg-yellow-400/10"
              : "border-white/15 bg-white/4 hover:border-white/25 hover:bg-white/6"
          }
        `}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Image uploaded</p>
              <p className="text-gray-400 text-xs">Click to change</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect("");
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <Upload size={16} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-gray-300 text-sm font-medium">Upload image</p>
              <p className="text-gray-500 text-xs">Max 5MB</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
