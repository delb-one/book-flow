import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href="/authors">
        <ArrowLeft className="size-4" />
        Torna agli autori
      </Link>
    </Button>
  );
}
