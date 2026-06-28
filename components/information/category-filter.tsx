import Link from "next/link";

type Props = {
  categories: { slug: string; name: string }[];
  currentSlug?: string;
};

export function InformationCategoryFilter({ categories, currentSlug }: Props) {
  if (categories.length === 0) return null;

  const itemBase =
    "inline-block px-3 py-1 text-sm font-bold transition-colors border-b-2";
  const active = "text-red-500 border-red-500";
  const inactive = "text-gray-500 border-transparent hover:text-gray-800";

  return (
    <nav className="mb-8">
      <ul className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <li>
          <Link
            href="/information"
            className={`${itemBase} ${!currentSlug ? active : inactive}`}
          >
            ALL
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/information?category=${category.slug}`}
              className={`${itemBase} ${
                currentSlug === category.slug ? active : inactive
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
