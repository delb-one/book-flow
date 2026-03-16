"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function NotesEditor({
  bookId,
  initialNotes,
}: {
  bookId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState<string>(initialNotes);
  const [draft, setDraft] = useState<string>(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setDraft(notes);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(notes);
    setIsEditing(false);
  };

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/library/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, notes: draft }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        console.error(data?.error ?? "Errore aggiornamento note.");
        return;
      }

      setNotes(draft);
      setIsEditing(false);
    } catch (error) {
      console.error("Errore di rete durante il salvataggio note.", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {notes || "Nessuna nota inserita."}
        </p>
        <div>
          <Button variant="ghost" size="sm" onClick={startEditing}>
            Modifica
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={4}
        placeholder="Scrivi le tue note..."
        className="resize-none max-h-40 overflow-y-auto "
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={saveNotes} disabled={isSaving}>
          {isSaving ? "Salvataggio..." : "Salva"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelEditing}
          disabled={isSaving}
        >
          Annulla
        </Button>
      </div>
    </div>
  );
}
