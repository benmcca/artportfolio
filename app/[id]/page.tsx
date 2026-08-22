import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { placeholderArt } from "../../data/placeholderArt";

export function generateStaticParams() {
  return placeholderArt.map((art) => ({ id: String(art.id) }));
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = placeholderArt.find((item) => String(item.id) === id);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-6 text-foreground">
      <div className="mx-auto w-[70vw] min-w-[700px] max-w-[1200px]">
        <Link
          href="/"
          aria-label="Back to portfolio"
          className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </Link>

        <div className="mt-4 grid grid-cols-[60%_40%]">
          <div>
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              width={800}
              height={800}
              className="h-auto w-full"
            />
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-foreground">
              {artwork.title}
              <span className="ml-3 text-xl font-normal italic text-muted-foreground">
                {artwork.date.slice(0, 4)}
              </span>
            </h1>
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-4 text-muted-foreground last:mb-0">
                    {children}
                  </p>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-3 text-xl font-semibold text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 text-md font-semibold text-foreground">
                    {children}
                  </h3>
                ),
              }}
            >
              {artwork.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
