import Image from "next/image";

import { Card } from "@/components/ui/card";

type BookCoverProps = {
  cover: string | null;
  title: string;
};

export function BookCover({ cover, title }: BookCoverProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square sm:aspect-3/4 w-full bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={`Copertina di ${title}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Nessuna copertina
          </div>
        )}
      </div>
    </Card>
  );
}
