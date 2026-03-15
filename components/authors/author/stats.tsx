import { Book, BookCheck, Star } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatsProps = {
  totalOwnedBooks: number;
  totalWishlistBooks: number;
  booksRead: number;
  averageRating: number | null;
};

export function Stats({
  totalOwnedBooks,
  totalWishlistBooks,
  booksRead,
  averageRating,
}: StatsProps) {
  const primaryCount = totalOwnedBooks > 0 ? totalOwnedBooks : totalWishlistBooks;
  const primaryLabel = totalOwnedBooks > 0 ? "Libri posseduti" : "Libri da comprare";
  const PrimaryIcon = totalOwnedBooks > 0 ? Book : BookCheck;

  return (
    <div className="flex flex-row gap-2 w-full justify-between">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardDescription className="text-sm">
                {primaryLabel}
              </CardDescription>
              <CardTitle className="font-bold text-2xl">
                {primaryCount}
              </CardTitle>
            </div>
            <PrimaryIcon className="size-5 text-primary" aria-hidden />
          </div>
        </CardHeader>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardDescription className="text-sm">
                Libri letti
              </CardDescription>
              <CardTitle className="font-bold text-2xl">
                {booksRead}
              </CardTitle>
            </div>
            <BookCheck className="size-5 text-primary" aria-hidden />
          </div>
        </CardHeader>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardDescription className="text-sm">
                Media Voti
              </CardDescription>
              <CardTitle className="font-bold text-2xl">
                {averageRating ? averageRating.toFixed(1) : "n/a"}{" "}
              </CardTitle>
            </div>
            <Star className="size-5 text-primary" aria-hidden />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
