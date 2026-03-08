import { PetCard } from "@/components/pet-card";
import { PetSearchForm } from "@/components/pet-search-form";
import { getPets, searchPets } from "@/data/pet";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { setLocale } from "@/app/web/i18n/set-locale";

const searchParamsCache = createSearchParamsCache({
  name: parseAsString.withDefault(""),
});

export default async function PetsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await setLocale(params);
  const { name } = searchParamsCache.parse(await searchParams);
  const pets = name ? await searchPets(name) : await getPets();

  return (
    <div className="container py-10">
      <PetSearchForm />
      <h1 className="text-2xl font-bold mb-6">ペット一覧</h1>
      <div className="grid grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  );
}
