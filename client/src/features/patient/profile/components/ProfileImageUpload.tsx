"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  name: string;
  onUpload: (file: File) => Promise<unknown>;
  isUploading?: boolean;
}

export function ProfileImageUpload({
  currentImageUrl,
  name,
  onUpload,
  isUploading = false,
}: ProfileImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB");
      return;
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, or WebP)");
      return;
    }

    // Generate local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      await onUpload(file);
    } catch {
      // Revert preview on failure
      setPreviewUrl(null);
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-center gap-5 p-4 rounded-xl border border-border/80 bg-card">
      <div className="relative group">
        <div className="flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted/60 items-center justify-center shadow-xs">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={name || "Profile Photo"}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/60" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50"
          title="Upload new profile photo"
          aria-label="Upload profile photo"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="space-y-1.5 text-center sm:text-left">
        <h4 className="text-sm font-semibold text-foreground">Profile Photo</h4>
        <p className="text-xs text-muted-foreground max-w-xs">
          Upload a clear photo. Supported formats: PNG, JPG, or WebP (max 5MB).
        </p>
        <div className="pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Change Photo"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileImageUpload;
