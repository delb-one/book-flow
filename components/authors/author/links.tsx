import Link from "next/link";
import { Globe } from "lucide-react";

type LinksProps = {
  wikipediaUrl: string | null;
  website: string | null;
  extraLinks: Array<{ title?: string; url: string }>;
};

export function Links({
  wikipediaUrl,
  website,
  extraLinks,
}: LinksProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {wikipediaUrl && (
          <Link
            href={wikipediaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition"
          >
            <Globe className="size-4" />
            Wikipedia
          </Link>
        )}

        {website && (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition"
          >
            <Globe className="size-4" />
            Sito ufficiale
          </Link>
        )}
      </div>

      {extraLinks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Altri collegamenti
          </h4>

          <div className="flex flex-wrap gap-2">
            {extraLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                {link.title ?? link.url}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
