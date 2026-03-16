import { PencilLine } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NotesEditor } from "@/components/my-library/book/notes-editor";

type BookNotesProps = {
  bookId: string;
  initialNotes: string;
};

export function BookNotes({ bookId, initialNotes }: BookNotesProps) {
  return (
    <Card className="bg-muted/40 max-h-125">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <PencilLine className="size-5 text-primary" />
          <p className="text-base font-semibold">Note personali</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <NotesEditor bookId={bookId} initialNotes={initialNotes} />
      </CardContent>
    </Card>
  );
}
