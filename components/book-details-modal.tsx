import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import Image from "next/image";

import {
  RatingStars,
  statusLabel,
  statusVariant,
  toneClass,
} from "./my-library-client";

interface Book {
  id?: string;
  title: string;
  author: string;
  cover: string | null;
  coverTone: keyof typeof toneClass;
  status: keyof typeof statusVariant;
  rating: number;
  year: number | null;
  pages: number | null;
  publisher: string | null;
  categories: string[];
  description: string | null;
  notes: string | null;
  progress: number;
}

interface BookDetailsModalProps {
  selectedBook: Book | null;
  setSelectedBookId: (id: string | null) => void;
}

export const BookDetailsModal = ({
  selectedBook,
  setSelectedBookId,
}: BookDetailsModalProps) => {
  const handleClose = () => {
    setSelectedBookId(null);
  };

  if (!selectedBook) return null;

  return (
    <Dialog
      open={Boolean(selectedBook)}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogDescription>Dettagli libro</DialogDescription>

          <DialogTitle className="text-xl font-semibold">
            {selectedBook.title}
          </DialogTitle>

          <DialogDescription>{selectedBook.author}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-56 overflow-hidden rounded-md">
              {selectedBook.cover ? (
                <Image
                  src={selectedBook.cover}
                  alt={`Copertina di ${selectedBook.title}`}
                  width={160}
                  height={224}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className={`h-full w-full bg-linear-to-br ${
                    toneClass[selectedBook.coverTone]
                  }`}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant={statusVariant[selectedBook.status]}>
                {statusLabel[selectedBook.status]}
              </Badge>

              <RatingStars rating={selectedBook.rating} />
            </div>

            <p className="text-sm text-center">
              <span className="font-medium">Anno:</span>{" "}
              {selectedBook.year ?? "-"}
              <span className="ml-3 font-medium">Pagine:</span>{" "}
              {selectedBook.pages ?? "-"}
            </p>

            <p className="text-sm text-center">
              <span className="font-medium">Editore:</span>{" "}
              {selectedBook.publisher ?? "-"}
            </p>

            <div className="flex flex-wrap gap-1 justify-center">
              {selectedBook.categories?.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 no-scrollbar">
            <p className="text-sm">
              <span className="font-medium">Descrizione:</span>{" "}
              {selectedBook.description ?? "-"}
            </p>

            {selectedBook.notes && (
              <p className="rounded-md bg-muted/40 p-2 text-sm">
                <span className="font-medium">Note:</span> {selectedBook.notes}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        {selectedBook.status === "reading" && (
          <DialogFooter>
            <div className="space-y-1 w-full">
              <Progress value={selectedBook.progress} />

              <p className="text-xs text-muted-foreground">
                {selectedBook.progress}% completato
              </p>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};