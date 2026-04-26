import Image from "next/image";
import { getWebsiteConsentedSponsors } from "@/data/sponsor";

export async function SponsorLogosSection() {
  const sponsors = await getWebsiteConsentedSponsors();

  if (sponsors.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-lg md:text-xl font-bold mb-8 md:mb-12">
          協賛企業
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center justify-center"
            >
              {sponsor.logoUrl ? (
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.companyName || "協賛企業"}
                  width={400}
                  height={200}
                  className="object-contain max-h-40 md:max-h-52 w-auto"
                />
              ) : (
                <span className="text-sm md:text-base font-medium text-muted-foreground">
                  {sponsor.companyName}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
