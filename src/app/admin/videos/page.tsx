"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { useAdminUi } from "@/components/admin/AdminUi";

type GalleryVideo = {
  _id: string;
  publicId: string;
  secureUrl: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  duration?: number;
  format?: string;
  bytes?: number;
  selected: boolean;
  sortOrder: number;
  createdAt: string;
};

const MAX_BYTES = 100 * 1024 * 1024; // Cloudinary Free plan max video size

function formatBytes(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AdminVideosPage() {
  const { confirm, toast } = useAdminUi();
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOnUpload, setSelectedOnUpload] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fieldClass =
    "mt-1 h-11 w-full rounded-lg border border-charcoal/15 bg-cream px-3 text-sm text-charcoal outline-none focus:border-charcoal/35";

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/videos");
    if (!res.ok) {
      toast("Unable to load videos.", "error");
      return;
    }
    const data = await res.json();
    setVideos(data.videos);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      toast("Choose a video file to upload.", "error");
      return;
    }
    if (!title.trim()) {
      toast("Add a title for the video.", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast(
        "This file is over 100MB. Cloudinary Free allows up to 100MB — compress the video or upgrade your Cloudinary plan.",
        "error",
      );
      return;
    }

    setUploading(true);
    setProgress(5);

    try {
      // 1) Get unsigned preset — browser uploads straight to Cloudinary (fast).
      const signRes = await fetch("/api/admin/videos/sign", { method: "POST" });
      const signed = await signRes.json();
      if (!signRes.ok) {
        toast(signed.error || "Unable to start upload.", "error");
        return;
      }

      setProgress(12);

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", signed.uploadPreset);

      const uploadRes = await new Promise<Record<string, unknown>>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`,
          );
          xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) return;
            const pct = 12 + Math.round((e.loaded / e.total) * 78);
            setProgress(pct);
          };
          xhr.onload = () => {
            try {
              const json = JSON.parse(xhr.responseText) as Record<
                string,
                unknown
              >;
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(json);
                return;
              }
              const errObj = json.error;
              const message =
                typeof errObj === "object" &&
                errObj &&
                "message" in errObj &&
                typeof (errObj as { message?: unknown }).message === "string"
                  ? (errObj as { message: string }).message
                  : typeof json.error === "string"
                    ? json.error
                    : "Cloudinary upload failed.";
              reject(new Error(message));
            } catch {
              reject(new Error("Cloudinary upload failed."));
            }
          };
          xhr.onerror = () =>
            reject(
              new Error(
                "Direct upload blocked or network failed. Check connection and try again.",
              ),
            );
          xhr.send(body);
        },
      );

      setProgress(94);

      // 2) Save metadata only (tiny request) — video is already on Cloudinary.
      const saveRes = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: uploadRes.public_id,
          url: uploadRes.url,
          secureUrl: uploadRes.secure_url,
          title: title.trim(),
          description: description.trim(),
          duration: uploadRes.duration,
          width: uploadRes.width,
          height: uploadRes.height,
          format: uploadRes.format,
          bytes: uploadRes.bytes,
          selected: selectedOnUpload,
        }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) {
        toast(saved.error || "Upload succeeded but saving failed.", "error");
        return;
      }

      setFile(null);
      setTitle("");
      setDescription("");
      setProgress(100);
      toast("Video uploaded to Cloudinary and saved.", "success");
      await load();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload video right now.";
      toast(
        /file size too large/i.test(message)
          ? "Cloudinary Free plan max is 100MB. Compress the video or upgrade Cloudinary."
          : message,
        "error",
      );
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }

  async function toggleSelected(video: GalleryVideo) {
    const res = await fetch("/api/admin/videos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: video._id, selected: !video.selected }),
    });
    if (!res.ok) {
      toast("Unable to update video.", "error");
      return;
    }
    toast(
      video.selected ? "Video hidden from the site." : "Video shown on the site.",
      "success",
    );
    await load();
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete this video?",
      description:
        "It will be removed from Cloudinary and the Videography library. This cannot be undone.",
      confirmLabel: "Delete video",
      tone: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Unable to delete video.", "error");
      return;
    }
    toast("Video deleted.", "success");
    await load();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl text-charcoal">Videos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-muted md:text-base">
          Upload performance films and reels to Cloudinary. Selected videos
          appear on the public Videography page.
        </p>
      </header>

      <form
        onSubmit={onUpload}
        className="space-y-5 rounded-xl border border-charcoal/10 bg-cream-soft/80 p-5 md:p-6"
      >
        <h2 className="font-display text-2xl text-charcoal">Upload video</h2>

        <label className="block text-sm">
          <span className="text-charcoal-muted">Video file</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              if (next && !title.trim()) {
                setTitle(next.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
              }
            }}
            className="mt-1 block w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-charcoal file:px-3 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-[0.12em] file:text-cream"
          />
          <span className="mt-1 block text-xs text-charcoal-muted">
            MP4 or MOV works best. Max 100MB on Cloudinary Free. Uploads go
            directly to Cloudinary for speed.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <label className="block text-sm sm:col-span-2">
            <span className="text-charcoal-muted">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Arangetram highlight reel"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-charcoal-muted">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional short caption for the videography page"
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-cream px-3 py-2 text-sm outline-none focus:border-charcoal/35"
            />
          </label>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={selectedOnUpload}
            onChange={(e) => setSelectedOnUpload(e.target.checked)}
            className="size-4 accent-button"
          />
          Show on Videography page after upload
        </label>

        {progress > 0 ? (
          <div className="space-y-1">
            <div className="h-2 overflow-hidden rounded-full bg-charcoal/10">
              <div
                className="h-full rounded-full bg-button transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-charcoal-muted">
              Uploading… {progress}%
            </p>
          </div>
        ) : null}

        <AdminButton type="submit" disabled={uploading} size="lg" className="w-full sm:w-auto">
          {uploading ? "Uploading…" : "Upload to Cloudinary"}
        </AdminButton>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {videos.length === 0 ? (
          <p className="text-charcoal-muted sm:col-span-2">
            No videos yet. Upload your first performance film above.
          </p>
        ) : (
          videos.map((video) => (
            <article
              key={video._id}
              className="overflow-hidden rounded-xl border border-charcoal/10 bg-cream-soft/80"
            >
              <div className="relative aspect-video bg-charcoal/90">
                <video
                  src={video.secureUrl}
                  poster={video.thumbnailUrl || undefined}
                  controls
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-charcoal">
                      {video.title}
                    </p>
                    {video.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-charcoal-muted">
                        {video.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-charcoal-muted">
                      {formatDuration(video.duration)} ·{" "}
                      {formatBytes(video.bytes)}
                      {video.format ? ` · ${video.format.toUpperCase()}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-xs leading-none ${
                      video.selected
                        ? "bg-teal/15 text-teal"
                        : "bg-charcoal/10 text-charcoal-muted"
                    }`}
                  >
                    {video.selected ? "On site" : "Hidden"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    size="sm"
                    variant="charcoal"
                    onClick={() => void toggleSelected(video)}
                  >
                    {video.selected ? "Hide from site" : "Show on site"}
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="dangerSoft"
                    onClick={() => void remove(video._id)}
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
