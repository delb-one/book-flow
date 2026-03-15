import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  title: string;
  url?: string;
}

export function BackButton({ title, url }: BackButtonProps) {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href={url ?? "/"}>
        <ArrowLeft className="size-4" />
        {title}
      </Link>
    </Button>
  );
}
