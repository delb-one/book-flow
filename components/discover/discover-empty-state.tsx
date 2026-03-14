"use client";

import { Card, CardContent } from "@/components/ui/card";

interface DiscoverEmptyStateProps {
  show: boolean;
}

export function DiscoverEmptyState({ show }: DiscoverEmptyStateProps) {
  if (!show) return null;

  return (
    <Card>
      <CardContent className="text-muted-foreground py-8 text-center text-sm">
        Nessun risultato trovato.
      </CardContent>
    </Card>
  );
}
