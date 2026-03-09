"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  folder?: "pujas" | "products" | "pandits" | "blogs" | "banners" | "offers" | "sliders" | "testimonials" | "combos" | "misc";
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({
  value,
  onChange,
  folder = "misc",
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file: File) => {
      setError("");
      if (file.size > maxSize) {
        setError(`File too large (max ${maxSize / 1024 / 1024}MB)`);
        return null;
      }
      setUploading(true);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            folder,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        const { uploadUrl, publicUrl } = data;
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        return publicUrl;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
        return null;
      } finally {
        setUploading(false);
      }
    },
    [folder, maxSize]
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await upload(files[i]);
      if (url) urls.push(url);
    }
    if (urls.length) onChange(multiple ? [...(Array.isArray(value) ? value : value ? [value] : []), ...urls] : urls[0] || "");
    e.target.value = "";
  };

  const remove = (url: string) => {
    if (Array.isArray(value)) onChange(value.filter((u) => u !== url));
    else onChange("");
  };

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className="space-y-2">
      {uploading && (
        <div className="flex items-center gap-2 rounded-lg border border-saffron-200 bg-saffron-50/80 px-3 py-2 text-sm text-saffron-800">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Image upload ho raha hai, please wait...</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {urls.map((url) => (
          <div key={url} className="relative group">
            <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover border border-gold-200" />
            <button type="button" onClick={() => remove(url)} className="absolute -top-2 -right-2 rounded-full bg-maroon-500 p-0.5 text-white opacity-0 group-hover:opacity-100">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className={`flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gold-200 bg-saffron-50/50 text-gray-500 transition-opacity ${uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-saffron-50"}`}>
          <Upload className="h-6 w-6" />
          <span className="text-xs mt-1">{uploading ? "..." : "Add"}</span>
          <input type="file" accept={accept} multiple={multiple} onChange={handleChange} disabled={uploading} className="sr-only" />
        </label>
      </div>
      {error && <p className="text-sm text-maroon-600">{error}</p>}
    </div>
  );
}
