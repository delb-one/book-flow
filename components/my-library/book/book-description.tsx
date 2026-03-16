"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BookDescription({ description }: { description: string }) {
  const [maxHeight, setMaxHeight] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBottom = window.innerHeight - rect.top - 70;
        setMaxHeight(spaceBottom);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BookText className="size-5 text-primary" />
        <p className="text-base font-semibold">Trama</p>
      </CardHeader>

      <CardContent className="relative">
        <div
          ref={containerRef}
          style={{ maxHeight }}
          className="prose prose-sm max-w-none overflow-y-auto no-scrollbar transition-all dark:prose-invert"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description || "Nessuna descrizione disponibile."}
          </ReactMarkdown>
        </div>

        {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background/95 to-transparent" /> */}
      </CardContent>
    </Card>
  );
}
