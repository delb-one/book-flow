export type SearchResult = {
  id: string;
  title: string;
  author: string;
  authorKey: string | null;
  year: number | null;
  publisher: string | null;
  pages: number | null;
  cover: string | null;
  categories: string[];
  description: string;
  source: "openlibrary";
};

export type AddStatus = "unread" | "reading" | "read" | "wishlist";
export type ViewMode = "grid" | "table";
