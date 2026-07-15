'use client';

import { ImageUp, Loader2, Trash2 } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { getCroppedImageDataUrl } from '@/features/profile/lib/crop-image';

const MAX_FILE_SIZE_BYTES = 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const OUTPUT_SIZE = 500;

type AvatarUploaderProps = {
  firstName: string;
  lastName: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function AvatarUploader({
  firstName,
  lastName,
  value,
  onChange,
  disabled,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetCropState = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please select a PNG, JPEG, WEBP, or GIF image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('Image must be 1MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.onerror = () => toast.error('Failed to read the selected file.');
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);

    try {
      const dataUrl = await getCroppedImageDataUrl(imageSrc, croppedAreaPixels, OUTPUT_SIZE);
      onChange(dataUrl);
      resetCropState();
    } catch {
      toast.error('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-muted/30 flex items-center gap-4 border p-4">
      <UserAvatar
        firstName={firstName}
        lastName={lastName}
        avatar={value}
        size="xl"
        className="ring-background shadow-sm ring-2"
      />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageUp data-icon="inline-start" />
            Upload photo
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onChange('')}
            >
              <Trash2 data-icon="inline-start" />
              Remove
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-xs">
          PNG, JPEG, WEBP or GIF. Max 1MB — cropped to 500x500.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={Boolean(imageSrc)} onOpenChange={(open) => !open && resetCropState()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop your photo</DialogTitle>
            <DialogDescription>
              Drag to reposition, and use the slider to zoom. Your photo will be saved as a 500x500
              image.
            </DialogDescription>
          </DialogHeader>

          {imageSrc && (
            <div className="bg-muted relative h-72 w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>
          )}

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="accent-primary w-full"
            aria-label="Zoom"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetCropState}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmCrop} disabled={isProcessing}>
              {isProcessing && <Loader2 className="size-4 animate-spin" />}
              {isProcessing ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
