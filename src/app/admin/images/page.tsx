"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { useAdminUi } from "@/components/admin/AdminUi";
import {
  GALLERY_FOLDERS,
  GALLERY_FOLDER_LABELS,
  type GalleryFolder,
} from "@/lib/gallery-folders";
import type { DisplayAspect } from "@/lib/gallery";

type GalleryImage = {
  _id: string;
  secureUrl: string;
  folder: string;
  alt: string;
  selected: boolean;
  sortOrder: number;
  displayAspect?: DisplayAspect;
  width?: number;
  height?: number;
};

const folders = GALLERY_FOLDERS;

const ASPECT_OPTIONS: { value: DisplayAspect; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "portrait", label: "9:16" },
  { value: "landscape", label: "16:9" },
];

function usesBentoAspect(folder: string) {
  return (
    folder === "creatives" ||
    folder === "invitations" ||
    folder === "work"
  );
}

export default function AdminImagesPage() {
  const { confirm, toast } = useAdminUi();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folder, setFolder] = useState<GalleryFolder | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState<GalleryFolder>("creatives");
  const [alt, setAlt] = useState("");
  const [selectedOnUpload, setSelectedOnUpload] = useState(true);
  const [uploadAspect, setUploadAspect] = useState<DisplayAspect>("auto");
  const [uploading, setUploading] = useState(false);

  const fieldClass =
    "mt-1 h-11 w-full rounded-lg border border-charcoal/15 bg-cream px-3 text-sm text-charcoal outline-none focus:border-charcoal/35";

  const load = useCallback(async () => {
    const query = folder ? `?folder=${folder}` : "";
    const res = await fetch(`/api/admin/images${query}`);
    if (!res.ok) {
      toast("Unable to load images.", "error");
      return;
    }
    const data = await res.json();
    setImages(data.images);
  }, [folder, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      toast("Choose an image to upload.", "error");
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", uploadFolder);
      body.append("alt", alt);
      body.append("selected", selectedOnUpload ? "true" : "false");
      body.append("displayAspect", uploadAspect);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Upload failed.", "error");
        return;
      }

      setFile(null);
      setAlt("");
      setUploadAspect("auto");
      toast("Image uploaded to Cloudinary.", "success");
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function toggleSelected(image: GalleryImage) {
    const res = await fetch("/api/admin/images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image._id, selected: !image.selected }),
    });
    if (!res.ok) {
      toast("Unable to update image.", "error");
      return;
    }
    toast(
      image.selected ? "Image hidden from the site." : "Image shown on the site.",
      "success",
    );
    await load();
  }

  async function setDisplayAspect(image: GalleryImage, displayAspect: DisplayAspect) {
    if ((image.displayAspect ?? "auto") === displayAspect) return;

    // Keep the dropdown in sync immediately; revert if the save fails.
    setImages((current) =>
      current.map((item) =>
        item._id === image._id ? { ...item, displayAspect } : item,
      ),
    );

    const res = await fetch("/api/admin/images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image._id, displayAspect }),
    });
    if (!res.ok) {
      setImages((current) =>
        current.map((item) =>
          item._id === image._id
            ? { ...item, displayAspect: image.displayAspect ?? "auto" }
            : item,
        ),
      );
      toast("Unable to update layout.", "error");
      return;
    }

    const data = (await res.json()) as {
      image?: { displayAspect?: DisplayAspect };
    };
    const savedAspect = data.image?.displayAspect ?? displayAspect;
    setImages((current) =>
      current.map((item) =>
        item._id === image._id
          ? { ...item, displayAspect: savedAspect }
          : item,
      ),
    );

    toast(
      savedAspect === "auto"
        ? "Layout set to Auto."
        : `Layout set to ${savedAspect === "portrait" ? "9:16" : "16:9"}.`,
      "success",
    );
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete this image?",
      description:
        "It will be removed from Cloudinary and the admin library. This cannot be undone.",
      confirmLabel: "Delete image",
      tone: "danger",
    });
    if (!ok) return;

    const res = await fetch(`/api/admin/images?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Unable to delete image.", "error");
      return;
    }
    toast("Image deleted.", "success");
    await load();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-charcoal">Images</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
          Upload to Cloudinary, then select which images appear on the site.
          For Invitations, Creatives, and Work, choose{" "}
          <span className="text-charcoal">9:16</span> or{" "}
          <span className="text-charcoal">16:9</span> for the bento layout —
          or leave Auto to detect from the file.
        </p>
      </header>

      <form
        onSubmit={onUpload}
        className="space-y-5 rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5 md:p-6"
      >
        <h2 className="font-display text-2xl text-charcoal">Upload image</h2>

        <label className="block text-sm">
          <span className="text-charcoal-muted">File</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-charcoal file:px-3 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-[0.12em] file:text-cream"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <label className="block text-sm">
            <span className="text-charcoal-muted">Folder</span>
            <select
              value={uploadFolder}
              onChange={(e) =>
                setUploadFolder(e.target.value as GalleryFolder)
              }
              className={fieldClass}
            >
              {folders.map((item) => (
                <option key={item} value={item}>
                  {GALLERY_FOLDER_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-charcoal-muted">Alt text</span>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image"
              className={fieldClass}
            />
          </label>
        </div>

        {usesBentoAspect(uploadFolder) ? (
          <label className="block text-sm sm:max-w-xs">
            <span className="text-charcoal-muted">Bento layout</span>
            <select
              value={uploadAspect}
              onChange={(e) =>
                setUploadAspect(e.target.value as DisplayAspect)
              }
              className={fieldClass}
            >
              {ASPECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex items-center gap-2.5 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={selectedOnUpload}
            onChange={(e) => setSelectedOnUpload(e.target.checked)}
            className="size-4 accent-button"
          />
          Show on website after upload
        </label>

        <AdminButton type="submit" disabled={uploading} className="sm:w-auto w-full">
          {uploading ? "Uploading…" : "Upload to Cloudinary"}
        </AdminButton>
      </form>

      <div className="flex flex-wrap gap-2">
        <AdminButton
          size="sm"
          variant={!folder ? "filterActive" : "filter"}
          onClick={() => setFolder("")}
        >
          All
        </AdminButton>
        {folders.map((item) => (
          <AdminButton
            key={item}
            size="sm"
            variant={folder === item ? "filterActive" : "filter"}
            onClick={() => setFolder(item)}
          >
            {GALLERY_FOLDER_LABELS[item]}
          </AdminButton>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <p className="text-charcoal-muted sm:col-span-2 lg:col-span-3">
            No images yet. Upload your first Cloudinary image above.
          </p>
        ) : (
          images.map((image) => (
            <article
              key={image._id}
              className="overflow-hidden rounded-xl border border-charcoal/10 bg-cream-soft/80"
            >
              <div className="relative aspect-[4/5] bg-charcoal/5">
                <Image
                  src={image.secureUrl}
                  alt={image.alt || "Gallery image"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-charcoal">
                      {image.alt || "Untitled"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.14em] text-charcoal-muted">
                      {GALLERY_FOLDER_LABELS[
                        image.folder as GalleryFolder
                      ] ?? image.folder}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-xs leading-none ${
                      image.selected
                        ? "bg-teal/15 text-teal"
                        : "bg-charcoal/10 text-charcoal-muted"
                    }`}
                  >
                    {image.selected ? "Selected" : "Hidden"}
                  </span>
                </div>

                {usesBentoAspect(image.folder) ? (
                  <label className="block text-sm">
                    <span className="text-charcoal-muted">Bento layout</span>
                    <select
                      value={image.displayAspect ?? "auto"}
                      onChange={(e) =>
                        void setDisplayAspect(
                          image,
                          e.target.value as DisplayAspect,
                        )
                      }
                      className={fieldClass}
                    >
                      {ASPECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    size="sm"
                    variant="charcoal"
                    onClick={() => void toggleSelected(image)}
                  >
                    {image.selected ? "Deselect" : "Select"}
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="dangerSoft"
                    onClick={() => void remove(image._id)}
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
