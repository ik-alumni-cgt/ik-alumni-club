"use client";

type Video = {
  id: string;
  title: string;
  videoDate: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
  viewCount: number;
};

function getYouTubeEmbedUrl(url: string): string | null {
  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
}

export function VideoDetail({ item }: { item: Video }) {
  const embedUrl = getYouTubeEmbedUrl(item.videoUrl);

  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <h1 className="main-text mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {item.authorName && <span>{item.authorName}</span>}
          <span>{new Date(item.videoDate).toLocaleDateString("ja-JP")}</span>
          <span>{item.viewCount} views</span>
        </div>
      </header>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              動画を見る
            </a>
          </div>
        )}
      </div>

      {item.isMemberOnly && (
        <p className="text-sm text-gray-500 text-center">
          この動画は会員限定コンテンツです。URLの共有や第三者への転送はご遠慮ください。
        </p>
      )}
    </article>
  );
}
