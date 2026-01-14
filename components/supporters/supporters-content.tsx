import video01 from "@/components/supporters/video/01.jpg";
import video02 from "@/components/supporters/video/02.jpg";
import video03 from "@/components/supporters/video/03.jpg";
import newsletter1 from "@/components/supporters/newsletter/newsletter1.jpg";
import newsletter2 from "@/components/supporters/newsletter/newsletter2.jpg";
import newsletter3 from "@/components/supporters/newsletter/newsletter3.jpg";

// Photo imports
import photo1 from "@/components/supporters/photo/2e374c8a-91cf-4136-83d0-2dbb66bc500b.jpeg";
import photo2 from "@/components/supporters/photo/6beddb67-ee50-479e-b8b7-2fe5a169a864.jpeg";
import photo3 from "@/components/supporters/photo/img_6179.jpg";
import photo4 from "@/components/supporters/photo/img_6180.jpg";
import photo5 from "@/components/supporters/photo/img_6182.jpg";
import photo6 from "@/components/supporters/photo/img_6183.jpg";
import photo7 from "@/components/supporters/photo/img_6202.jpg";
import photo8 from "@/components/supporters/photo/img_6203.jpg";
import photo9 from "@/components/supporters/photo/img_6204.jpg";
import photo10 from "@/components/supporters/photo/img_6205.jpg";
import photo11 from "@/components/supporters/photo/img_6206.jpg";
import photo12 from "@/components/supporters/photo/img_6207.jpg";
import photo13 from "@/components/supporters/photo/img_6210.jpg";
import photo14 from "@/components/supporters/photo/img_6212.jpg";
import photo15 from "@/components/supporters/photo/img_6213.jpg";
import photo16 from "@/components/supporters/photo/img_6218.jpg";
import photo17 from "@/components/supporters/photo/img_6219.jpg";

import { getRecentBlogs } from "@/data/blog";
import { VideoCard } from "./cards/video-card";
import { NewsletterCard } from "./cards/newsletter-card";
import { PhotoLibraryCard } from "./cards/photo-library-card";
import { ExclusiveBlogCard } from "./cards/exclusive-blog-card";

const videoImages = [video01, video02, video03];
const newsletterImages = [newsletter1, newsletter2, newsletter3];
const photoImages = [
  photo1, photo2, photo3, photo4, photo5, photo6,
  photo7, photo8, photo9, photo10, photo11, photo12,
  photo13, photo14, photo15, photo16, photo17
];

export async function SupportersContent() {
  const sampleBlogs = await getRecentBlogs(1);
  const sampleBlog = sampleBlogs[0] ?? null;

  return (
    <div className="mb-16 md:mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
        Supporter&apos;s Content
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VideoCard videoImages={videoImages} />
        <NewsletterCard newsletterImages={newsletterImages} />
        <PhotoLibraryCard photoImages={photoImages} />
        <ExclusiveBlogCard sampleBlog={sampleBlog} />
      </div>
    </div>
  );
}
