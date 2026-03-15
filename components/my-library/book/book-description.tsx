import { BookText } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type BookDescriptionProps = {
  description: string;
};

export function BookDescription({ description }: BookDescriptionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BookText className="size-5 text-primary" />
        <p className="text-base font-semibold">Trama</p>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm leading-relaxed p-4">
        {description || "Nessuna descrizione disponibile."}
      </CardContent>
    </Card>
  );
}
