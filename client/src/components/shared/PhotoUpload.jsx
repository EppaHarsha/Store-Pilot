import React, { useRef, useState } from "react";
import { HiOutlinePhoto, HiOutlineTrash } from "react-icons/hi2";

const PhotoUpload = ({ onChange }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 px-4 py-6 text-center text-xs text-slate-400"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <HiOutlinePhoto className="h-6 w-6 text-slate-300" />
        <p className="mt-1 font-medium text-slate-100">
          Tap to upload or drag and drop
        </p>
        <p className="mt-1 text-[11px]">
          Mobile camera supported. JPG or PNG up to 5MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Order preview"
            className="h-28 w-28 rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-rose-300 shadow"
          >
            <HiOutlineTrash className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

