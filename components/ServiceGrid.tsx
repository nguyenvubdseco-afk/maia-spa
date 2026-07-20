import Link from "next/link";
import { getServices } from "@/lib/services";

export default async function ServiceGrid() {
  const featured = (await getServices()).slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {featured.map((s) => (
        <Link
          key={s.slug}
          href={`/dich-vu/${s.slug}`}
          className="group relative rounded-lg overflow-hidden min-h-[200px] bg-cover bg-center flex items-end"
          style={{ backgroundImage: `url('${s.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark/85 to-dark/5" />
          <span className="relative z-10 inline-block text-white font-heading text-base p-4 transition-transform duration-200 group-hover:scale-110">
            {s.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
