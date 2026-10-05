import Image from "next/image"

/** 活動写真（public/anniversary/history 配下） */
const PHOTOS = [
  { file: "01", width: 1400, height: 933 },
  { file: "03", width: 1400, height: 933 },
  { file: "17", width: 1400, height: 936 },
  { file: "40", width: 1400, height: 933 },
  { file: "28", width: 1400, height: 933 },
  { file: "62", width: 1400, height: 1050 },
  { file: "30", width: 1400, height: 933 },
  { file: "14", width: 1400, height: 933 },
  { file: "66", width: 1400, height: 933 },
  { file: "19", width: 1400, height: 933 },
  { file: "33", width: 1400, height: 933 },
  { file: "36", width: 1400, height: 933 },
  { file: "50", width: 1400, height: 790 },
  { file: "70", width: 1400, height: 933 },
] as const

export function HistorySection() {
  return (
    <div className="max-w-5xl mx-auto">
      <Image
        src="/anniversary/history-title.webp"
        alt="2022 - 2027"
        width={600}
        height={80}
        className="mx-auto mb-10 h-auto w-48 md:w-64"
      />

      {/* 写真グリッド（縦横比そのままで段組み） */}
      <div className="columns-2 md:columns-3 gap-3 md:gap-4">
        {PHOTOS.map(({ file, width, height }, index) => (
          <Image
            key={file}
            src={`/anniversary/history/${file}.webp`}
            alt={`IK ALUMNI CGT の活動写真 ${index + 1}`}
            width={width}
            height={height}
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 50vw"
            className="mb-3 md:mb-4 h-auto w-full break-inside-avoid rounded-md border border-[#c9a227]/40"
          />
        ))}
      </div>
    </div>
  )
}
