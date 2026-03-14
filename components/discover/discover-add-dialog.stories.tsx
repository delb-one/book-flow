import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DiscoverAddDialog } from "./discover-add-dialog";
import type { AddStatus, SearchResult } from "./types";

const sampleBook: SearchResult = {
  id: "ol-1",
  title: "Dune",
  author: "Frank Herbert",
  authorKey: "OL123",
  year: 1965,
  publisher: "Chilton Books",
  pages: 412,
  cover: "https://covers.openlibrary.org/b/id/240726-S.jpg",
  categories: ["Fantascienza", "Avventura"],
  description: "Un classico della fantascienza.",
  source: "openlibrary",
};

const meta: Meta<typeof DiscoverAddDialog> = {
  title: "Discover/DiscoverAddDialog",
  component: DiscoverAddDialog,
  args: {
    open: true,
    onOpenChange: () => {},
    selectedBook: sampleBook,
    status: "unread",
    onStatusChange: () => {},
    rating: 3,
    onRatingChange: () => {},
    notes: "Appunti di prova...",
    onNotesChange: () => {},
    onConfirm: () => {},
    isSaving: false,
    saveError: null,
  },
  render: (args) => {
    const [status, setStatus] = useState<AddStatus>(args.status);
    const [rating, setRating] = useState(args.rating);
    const [notes, setNotes] = useState(args.notes);

    return (
      <DiscoverAddDialog
        {...args}
        status={status}
        onStatusChange={setStatus}
        rating={rating}
        onRatingChange={setRating}
        notes={notes}
        onNotesChange={setNotes}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof DiscoverAddDialog>;

export const Default: Story = {};

export const Saving: Story = {
  args: {
    isSaving: true,
  },
};

export const ErrorState: Story = {
  args: {
    saveError: "Errore durante il salvataggio.",
  },
};
