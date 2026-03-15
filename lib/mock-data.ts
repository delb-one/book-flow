export type ReadingStatus = "unread" | "reading" | "read";

export type Book = {
  id: string;
  title: string;
  author: string;
  authorSlug: string;
  year: number;
  publisher: string;
  pages: number;
  description: string;
  coverTone: "amber" | "emerald" | "rose" | "indigo" | "cyan" | "slate";
  categories: string[];
  status: ReadingStatus;
  progress: number;
  rating: number;
  addedAt: string;
  notes: string;
};

export const books: Book[] = [
  {
    id: "oliver-twist",
    title: "Oliver Twist",
    author: "Charles Dickens",
    authorSlug: "charles-dickens",
    year: 1838,
    publisher: "Richard Bentley",
    pages: 554,
    description:
      "A vivid portrait of London's underworld following an orphan navigating hardship, hope, and identity.",
    coverTone: "amber",
    categories: ["Classics", "Historical Fiction"],
    status: "reading",
    progress: 62,
    rating: 4,
    addedAt: "2026-02-22",
    notes:
      "Strong pacing in the middle chapters. Want to revisit the social critique sections.",
  },
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    authorSlug: "frank-herbert",
    year: 1965,
    publisher: "Chilton Books",
    pages: 412,
    description:
      "An epic science fiction saga of power, prophecy, ecology, and rebellion on the desert planet Arrakis.",
    coverTone: "rose",
    categories: ["Sci-Fi", "Adventure"],
    status: "read",
    progress: 100,
    rating: 5,
    addedAt: "2026-01-14",
    notes: "Excellent world-building and political dynamics.",
  },
  {
    id: "the-left-hand-of-darkness",
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    authorSlug: "ursula-k-le-guin",
    year: 1969,
    publisher: "Ace Books",
    pages: 304,
    description:
      "A diplomat's mission on a frozen world explores politics, trust, and the fluidity of identity.",
    coverTone: "cyan",
    categories: ["Sci-Fi", "Literary"],
    status: "unread",
    progress: 0,
    rating: 0,
    addedAt: "2026-03-03",
    notes: "",
  },
  {
    id: "the-overstory",
    title: "The Overstory",
    author: "Richard Powers",
    authorSlug: "richard-powers",
    year: 2018,
    publisher: "W. W. Norton & Company",
    pages: 512,
    description:
      "Interwoven lives reveal a sweeping, urgent narrative about trees, activism, and interconnection.",
    coverTone: "emerald",
    categories: ["Literary", "Environment"],
    status: "reading",
    progress: 31,
    rating: 4,
    addedAt: "2026-03-01",
    notes: "Beautiful prose. Slow start but rewarding.",
  },
  {
    id: "klara-and-the-sun",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    authorSlug: "kazuo-ishiguro",
    year: 2021,
    publisher: "Faber & Faber",
    pages: 320,
    description:
      "A quietly devastating story of love, hope, and humanity seen through an artificial friend's perspective.",
    coverTone: "indigo",
    categories: ["Literary", "Sci-Fi"],
    status: "read",
    progress: 100,
    rating: 5,
    addedAt: "2026-02-09",
    notes: "Emotionally restrained and highly effective.",
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    authorSlug: "daniel-kahneman",
    year: 2011,
    publisher: "Farrar, Straus and Giroux",
    pages: 499,
    description:
      "A foundational exploration of cognitive bias, judgment, and the dual-process model of thought.",
    coverTone: "slate",
    categories: ["Psychology", "Non-Fiction"],
    status: "unread",
    progress: 0,
    rating: 0,
    addedAt: "2026-02-27",
    notes: "",
  },
];

export const discoverResults = [
  {
    id: "openlib-1",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    year: 2007,
    publisher: "DAW Books",
    coverTone: "amber" as const,
  },
  {
    id: "openlib-2",
    title: "Never Let Me Go",
    author: "Kazuo Ishiguro",
    year: 2005,
    publisher: "Faber & Faber",
    coverTone: "rose" as const,
  },
  {
    id: "googlebooks-1",
    title: "Project Hail Mary",
    author: "Andy Weir",
    year: 2021,
    publisher: "Ballantine Books",
    coverTone: "cyan" as const,
  },
  {
    id: "openlib-3",
    title: "Station Eleven",
    author: "Emily St. John Mandel",
    year: 2014,
    publisher: "Knopf",
    coverTone: "indigo" as const,
  },
];

export const stats = {
  total: books.length,
  read: books.filter((book) => book.status === "read").length,
  reading: books.filter((book) => book.status === "reading").length,
  unread: books.filter((book) => book.status === "unread").length,
  booksReadPerYear: [
    { year: "2022", total: 9 },
    { year: "2023", total: 13 },
    { year: "2024", total: 11 },
    { year: "2025", total: 16 },
    { year: "2026", total: 4 },
  ],
  progressOverTime: [18, 24, 33, 45, 52, 68, 72, 80, 86],
  topCategories: [
    { label: "Sci-Fi", value: 11 },
    { label: "Literary", value: 8 },
    { label: "Classics", value: 5 },
    { label: "Psychology", value: 4 },
  ],
};

export const uniqueCategories = [
  ...new Set(books.flatMap((book) => book.categories)),
].sort();

export const uniqueAuthors = [
  ...new Set(books.map((book) => book.author)),
].sort();

export const ownedBooksMock = [
  {
    id: 1,
    title: "Il nome della rosa",
    author: "Umberto Eco",
    cover: "/covers/book1.jpg",
    status: "unread",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "/covers/book2.jpg",
    status: "unread",
  },
  {
    id: 3,
    title: "Il signore degli anelli",
    author: "J.R.R. Tolkien",
    cover: "/covers/book3.jpg",
    status: "unread",
  },
  {
    id: 4,
    title: "Dune",
    author: "Frank Herbert",
    cover: "/covers/book4.jpg",
    status: "unread",
  },
  {
    id: 5,
    title: "Neuromante",
    author: "William Gibson",
    cover: "/covers/book5.jpg",
    status: "unread",
  },
  {
    id: 6,
    title: "Fondazione",
    author: "Isaac Asimov",
    cover: "/covers/book6.jpg",
    status: "unread",
  },
  {
    id: 7,
    title: "La strada",
    author: "Cormac McCarthy",
    cover: "/covers/book7.jpg",
    status: "unread",
  },
  {
    id: 8,
    title: "Il processo",
    author: "Franz Kafka",
    cover: "/covers/book8.jpg",
    status: "unread",
  },
  {
    id: 9,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    cover: "/covers/book9.jpg",
    status: "unread",
  },
  {
    id: 10,
    title: "Dracula",
    author: "Bram Stoker",
    cover: "/covers/book10.jpg",
    status: "unread",
  },
  {
    id: 11,
    title: "Frankenstein",
    author: "Mary Shelley",
    cover: "/covers/book11.jpg",
    status: "unread",
  },
  {
    id: 12,
    title: "Il conte di Montecristo",
    author: "Alexandre Dumas",
    cover: "/covers/book12.jpg",
    status: "unread",
  },
  {
    id: 13,
    title: "Don Chisciotte",
    author: "Miguel de Cervantes",
    cover: "/covers/book13.jpg",
    status: "unread",
  },
  {
    id: 14,
    title: "Anna Karenina",
    author: "Lev Tolstoj",
    cover: "/covers/book14.jpg",
    status: "unread",
  },
  {
    id: 15,
    title: "Delitto e castigo",
    author: "Fëdor Dostoevskij",
    cover: "/covers/book15.jpg",
    status: "unread",
  },
  {
    id: 16,
    title: "La metamorfosi",
    author: "Franz Kafka",
    cover: "/covers/book16.jpg",
    status: "unread",
  },
  {
    id: 17,
    title: "Il grande Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/covers/book17.jpg",
    status: "unread",
  },
  {
    id: 18,
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "/covers/book18.jpg",
    status: "unread",
  },
  {
    id: 19,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    cover: "/covers/book19.jpg",
    status: "unread",
  },
  {
    id: 20,
    title: "Wuthering Heights",
    author: "Emily Brontë",
    cover: "/covers/book20.jpg",
    status: "unread",
  },
];

export const wishlistBooksMock = [
  {
    id: 21,
    title: "Hyperion",
    author: "Dan Simmons",
    cover: "/covers/book21.jpg",
    status: "wishlist",
  },
  {
    id: 22,
    title: "Snow Crash",
    author: "Neal Stephenson",
    cover: "/covers/book22.jpg",
    status: "wishlist",
  },
  {
    id: 23,
    title: "Il problema dei tre corpi",
    author: "Liu Cixin",
    cover: "/covers/book23.jpg",
    status: "wishlist",
  },
  {
    id: 24,
    title: "American Gods",
    author: "Neil Gaiman",
    cover: "/covers/book24.jpg",
    status: "wishlist",
  },
  {
    id: 25,
    title: "Il silmarillion",
    author: "J.R.R. Tolkien",
    cover: "/covers/book25.jpg",
    status: "wishlist",
  },
  {
    id: 26,
    title: "Ready Player One",
    author: "Ernest Cline",
    cover: "/covers/book26.jpg",
    status: "wishlist",
  },
  {
    id: 27,
    title: "La mano sinistra delle tenebre",
    author: "Ursula K. Le Guin",
    cover: "/covers/book27.jpg",
    status: "wishlist",
  },
  {
    id: 28,
    title: "Solaris",
    author: "Stanislaw Lem",
    cover: "/covers/book28.jpg",
    status: "wishlist",
  },
  {
    id: 29,
    title: "La città e la città",
    author: "China Miéville",
    cover: "/covers/book29.jpg",
    status: "wishlist",
  },
  {
    id: 30,
    title: "The Martian",
    author: "Andy Weir",
    cover: "/covers/book30.jpg",
    status: "wishlist",
  },
];
