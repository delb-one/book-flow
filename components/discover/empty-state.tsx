"use client";

import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  show: boolean;
}

export function EmptyState({ show }: EmptyStateProps) {
  if (!show) return null;

  return (
    <Card>
      <CardContent className="text-muted-foreground py-8 text-center text-sm">
        Nessun risultato trovato.
      </CardContent>
    </Card>
  );
}
