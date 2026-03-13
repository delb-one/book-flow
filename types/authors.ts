export type AuthorCard = {
  id: string;
  slug: string;
  name: string;
  bookCount: number;
  covers: string[];
  bio: string | null;
  photoUrl: string | null;
  wikipediaUrl: string | null;
  openLibraryKey: string | null;
};

export type AuthorsResponse = {
  authors: AuthorCard[];
  total: number;
  query: string;
};
