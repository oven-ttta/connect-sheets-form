import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadCropProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  fallbackText?: string;
}

export const ImageUploadCrop = ({ currentImageUrl, onImageUpload, fallbackText = "?" }: ImageUploadCropProps) => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setShowCropDialog(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      });
    },
    []
  );

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error("กรุณาเลือกพื้นที่ที่ต้องการครอป");
      return;
    }

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      
      await onImageUpload(file);
      
      setShowCropDialog(false);
      setImageSrc("");
      toast.success("อัปโหลดรูปภาพสำเร็จ!");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("เกิดข้อผิดพลาดในการครอปรูปภาพ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={currentImageUrl} />
          <AvatarFallback className="text-4xl">{fallbackText}</AvatarFallback>
        </Avatar>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            อัปโหลดรูป
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onSelectFile}
        />
      </div>

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ครอปรูปภาพ</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  style={{ maxHeight: "400px" }}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCropDialog(false);
                setImageSrc("");
              }}
              disabled={uploading}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleCropComplete} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังอัปโหลด...
                </>
              ) : (
                "บันทึกรูปภาพ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
