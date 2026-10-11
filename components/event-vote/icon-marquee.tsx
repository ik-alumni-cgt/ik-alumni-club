import Image from "next/image";

const ICONS = [
  "aoi1",
  "hiroaki",
  "kaho",
  "natuki",
  "ryo",
  "sakura",
  "taisei",
  "yuma",
] as const;

export const IconMarquee = () => {
  // 継ぎ目なくループさせるため 2 セット並べて -50% まで動かす
  const loopedIcons = [...ICONS, ...ICONS];

  return (
    <div className="overflow-hidden py-4" aria-hidden="true">
      <style>{`
        @keyframes event-vote-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .event-vote-marquee { animation: none !important; }
        }
      `}</style>
      <div
        className="event-vote-marquee flex w-max gap-4"
        style={{ animation: "event-vote-marquee 28s linear infinite" }}
      >
        {loopedIcons.map((name, index) => (
          <Image
            key={`${name}-${index}`}
            src={`/icons/${name}.png`}
            alt=""
            width={96}
            height={96}
            className="size-24 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
};
