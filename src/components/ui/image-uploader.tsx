"use client";

import { useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export default function ImageUploader({
  onUploadComplete,
  existingImages = [],
  maxImages = 5,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const urls = res.map((file) => file.url);
      setImages((prev) => [...prev, ...urls]);
      onUploadComplete(urls);
      setFiles([]);
      setIsUploading(false);
      toast.success("Imágenes subidas correctamente");
    },
    onUploadError: (error) => {
      toast.error(`Error al subir imágenes: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const filesArray = Array.from(fileList);
    
    // Validar el número máximo de imágenes
    if (images.length + filesArray.length > maxImages) {
      toast.error(`Solo puedes subir un máximo de ${maxImages} imágenes`);
      return;
    }

    setFiles(filesArray);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    startUpload(files);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Imágenes existentes */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div 
              key={`image-${index}`}
              className="relative h-24 w-24 overflow-hidden rounded-md"
            >
              <img
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Archivos seleccionados pendientes de subir */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <div
                key={`file-${index}`}
                className="relative flex h-24 w-24 items-center justify-center rounded-md border border-gray-300 bg-gray-50"
              >
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-1 block text-xs">{file.name.slice(0, 10)}...</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            {isUploading ? "Subiendo..." : "Subir archivos"}
          </Button>
        </div>
      )}

      {/* Selector de archivos */}
      <div className="mt-2">
        <label
          htmlFor="image-upload"
          className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-6 transition-colors hover:bg-gray-50"
        >
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Haz clic para seleccionar imágenes
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, WEBP (Máx. {maxImages} imágenes)
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading || images.length >= maxImages}
          />
        </label>
      </div>
    </div>
  );
}