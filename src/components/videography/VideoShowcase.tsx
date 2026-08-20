import type { PublicVideo } from "@/lib/videos";

function isPortraitVideo(video: PublicVideo) {
  if (video.width && video.height) {
    return video.height >= video.width;
  }
  return false;
}

function VideoFrame({ video }: { video: PublicVideo }) {
  const portrait = isPortraitVideo(video);

  return (
    <div
      className={
        portrait
          ? "mx-auto w-full max-w-[22rem] overflow-hidden border border-charcoal/10 bg-charcoal sm:max-w-sm md:max-w-md"
          : "w-full overflow-hidden border border-charcoal/10 bg-charcoal"
      }
      style={{ aspectRatio: portrait ? "9 / 16" : "16 / 9" }}
    >
      <video
        controls
        playsInline
        preload="metadata"
        poster={video.thumbnailUrl || undefined}
        className="h-full w-full object-contain"
      >
        <source src={video.secureUrl} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function VideoShowcase({ videos }: { videos: PublicVideo[] }) {
  if (videos.length === 0) return null;

  const [featured, ...rest] = videos;

  return (
    <div className="space-y-10">
      <article className="space-y-4">
        <VideoFrame video={featured} />
        <div className="max-w-3xl">
          <h3 className="font-display text-2xl text-charcoal md:text-3xl">
            {featured.title}
          </h3>
          {featured.description ? (
            <p className="mt-2 text-charcoal-muted leading-relaxed">
              {featured.description}
            </p>
          ) : null}
        </div>
      </article>

      {rest.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((video) => (
            <article key={video.id} className="space-y-3">
              <VideoFrame video={video} />
              <div>
                <h3 className="font-display text-xl text-charcoal">
                  {video.title}
                </h3>
                {video.description ? (
                  <p className="mt-1 text-sm text-charcoal-muted leading-relaxed">
                    {video.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
