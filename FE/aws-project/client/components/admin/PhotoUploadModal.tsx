/**
 * PhotoUploadModal - Modal upload ảnh xe
 * Hiển thị sau khi tạo/sửa xe thành công
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  PlusOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

interface PhotoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleName: string;
  onUpload: (files: File[]) => Promise<void>;
  onSkip: () => void;
}

export default function PhotoUploadModal({
  open,
  onOpenChange,
  vehicleName,
  onUpload,
  onSkip,
}: PhotoUploadModalProps) {
  const { toast } = useToast();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setPhotoFiles((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    const fileReaders = newFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(fileReaders);
      setPhotoPreviews((prev) => [...prev, ...base64Images]);

      toast({
        title: "Ảnh đã được chọn",
        description: `${newFiles.length} ảnh đã được thêm vào.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đọc file ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photoFiles.length === 0) {
      toast({
        title: "Chưa chọn ảnh",
        description: "Vui lòng chọn ít nhất 1 ảnh hoặc bỏ qua bước này.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onUpload(photoFiles);
      // Reset state
      setPhotoFiles([]);
      setPhotoPreviews([]);
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setPhotoFiles([]);
    setPhotoPreviews([]);
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            📸 Thêm ảnh cho xe {vehicleName}
          </DialogTitle>
          <DialogDescription>
            Tải lên ảnh xe để khách hàng dễ dàng nhận biết (Có thể bỏ qua)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File upload zone */}
          <div
            onClick={() =>
              document.getElementById("photo-upload-modal")?.click()
            }
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20 hover:bg-muted/40"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload-modal"
            />
            <div className="flex flex-col items-center gap-3">
              <PlusOutlined className="text-5xl text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Chọn ảnh để tải lên</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Hỗ trợ nhiều ảnh cùng lúc (JPG, PNG, GIF)
                </p>
              </div>
              <div className="px-6 py-3 bg-primary/10 text-primary rounded-md text-base font-medium">
                📁 Chọn file từ máy tính
              </div>
            </div>
          </div>

          {/* Preview grid */}
          {photoPreviews.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">
                Đã chọn {photoPreviews.length} ảnh:
              </p>
              <div className="grid grid-cols-4 gap-3">
                {photoPreviews.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150?text=Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CloseOutlined style={{ fontSize: 12 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photoPreviews.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Chưa có ảnh nào được chọn
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
          >
            Bỏ qua
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || photoFiles.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading && <LoadingOutlined className="mr-2 animate-spin" />}
            {loading ? "Đang upload..." : `Upload ${photoFiles.length} ảnh`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
