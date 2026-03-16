import ReactMarkdown from "react-markdown";
import { BookText } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import remarkGfm from "remark-gfm";

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

      <CardContent className="prose prose-sm max-w-none text-muted-foreground p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {description || "Nessuna descrizione disponibile."}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}