import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  currentImage?: string;
}

export function ImageUploader({ onImageSelect, currentImage }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      setError('Please upload a valid image file (JPG or PNG)');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-border">
          <img
            src={preview}
            alt="Wound preview"
            className="w-full max-h-80 object-contain bg-muted"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-primary bg-accent'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            error && 'border-destructive bg-destructive/5'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'p-4 rounded-full',
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            )}>
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {isDragActive ? 'Drop your image here' : 'Upload wound image'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse. JPG or PNG, max 10MB.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
