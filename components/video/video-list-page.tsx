"use client";

import { useState } from "react";
import { VideoList } from "./list";
import { ShortsList } from "./shorts-card";

type Video = {
  id: string;
  title: string;
  videoDate: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  published: boolean;
  isMemberOnly: boolean;
  authorName: string | null;
};

interface ShortsItem {
  videoUrl: string;
  title: string;
}

interface VideoListPageProps {
  videoItems: Video[];
  shortsItems: ShortsItem[];
}

type Tab = "all" | "shorts" | "video";

export function VideoListPage({ videoItems, shortsItems }: VideoListPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "shorts", label: "Shorts" },
    { key: "video", label: "Video" },
  ];

  return (
    <div>
      <div className="flex gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {(activeTab === "all" || activeTab === "shorts") &&
        shortsItems.length > 0 && (
          <div className={activeTab === "all" ? "mb-10" : ""}>
            <ShortsList items={shortsItems} />
          </div>
        )}
      {(activeTab === "all" || activeTab === "video") && (
        <VideoList items={videoItems} />
      )}
    </div>
  );
}
