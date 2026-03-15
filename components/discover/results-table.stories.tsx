import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResultsTable } from "./results-table";
import type { SearchResult } from "./types";

const sampleResults: SearchResult[] = [
  {
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
  },
  {
    id: "ol-2",
    title: "Il Signore degli Anelli",
    author: "J.R.R. Tolkien",
    authorKey: "OL456",
    year: 1954,
    publisher: "Allen & Unwin",
    pages: 1216,
    cover: "https://covers.openlibrary.org/b/id/8231856-S.jpg",
    categories: ["Fantasy", "Epico"],
    description: "La saga della Terra di Mezzo.",
    source: "openlibrary",
  },
  {
    id: "ol-3",
    title: "Il nome della rosa",
    author: "Umberto Eco",
    authorKey: "OL789",
    year: 1980,
    publisher: "Bompiani",
    pages: 512,
    cover: null,
    categories: ["Giallo", "Storico"],
    description: "Mistero in un monastero medievale.",
    source: "openlibrary",
  },
  {
    id: "ol-4",
    title: "Cent'anni di solitudine",
    author: "Gabriel García Márquez",
    authorKey: "OL987",
    year: 1967,
    publisher: "Sudamericana",
    pages: 432,
    cover: "https://covers.openlibrary.org/b/id/10523365-S.jpg",
    categories: ["Realismo magico"],
    description: "La storia della famiglia Buendía.",
    source: "openlibrary",
  },
];

const meta: Meta<typeof ResultsTable> = {
  title: "Components/Discover/ResultsTable",
  component: ResultsTable,
  args: {
    results: sampleResults,
    currentPage: 1,
    totalPages: 2,
    onPageChange: () => {},
    onAddClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-130 p-6">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ResultsTable {...args} savedBookIds={new Set(["ol-1"])} />
  ),
};

export default meta;

type Story = StoryObj<typeof ResultsTable>;

export const Default: Story = {};
