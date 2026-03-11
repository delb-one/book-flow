import Image from "next/image";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  cover: string | null;
  title: string;
  tone?: string;
  className?: string;
}

export function BookCover({ cover, title, tone, className }: BookCoverProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-linear-to-br shadow transition-all hover:-translate-y-0.5",
        tone,
        className
      )}
    >
      {cover && (
        <Image
          src={cover}
          alt={`Copertina di ${title}`}
          width={200}
          height={280}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}