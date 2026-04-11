interface ShortsItem {
  videoUrl: string;
  title: string;
}

interface ShortsListProps {
  items: ShortsItem[];
}

function getEmbedUrl(url: string): string {
  // Instagram Reel
  const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
  if (reelMatch) {
    return `https://www.instagram.com/reel/${reelMatch[1]}/embed/`;
  }

  // YouTube (Shorts, watch, embed, etc.)
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=|\/shorts\/))([^&?\/#]+)/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
}

export function ShortsList({ items }: ShortsListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 md:gap-6 pb-4">
        {items.map((item) => (
          <div
            key={item.videoUrl}
            className="flex-shrink-0 flex flex-col items-center gap-3"
          >
            <div className="relative w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/16]">
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg"
                src={getEmbedUrl(item.videoUrl)}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-xs md:text-sm text-center w-[200px] sm:w-[220px] md:w-[240px] truncate">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
