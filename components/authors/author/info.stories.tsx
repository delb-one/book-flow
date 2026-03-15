import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Info } from "./info";

const meta = {
  title: "Components/Authors/Author/Info",
  component: Info,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Info>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authorName: "J.K. Rowling",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
    birthDate: "31 luglio 1965",
    deathDate: null,
    birthPlace: "Yate, Gloucestershire",
    nationality: "Regno Unito",
    bio: "Joanne Kathleen Rowling è una scrittrice e produttrice cinematografica britannica, nota per aver creato la saga di Harry Potter, che ha ottenuto un successo mondiale e ha ispirato l'omonima serie di film.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/J._K._Rowling",
    website: "https://www.jkrowling.com",
    extraLinks: [
      { title: "Twitter", url: "https://twitter.com/jk_rowling" },
      { title: "Instagram", url: "https://instagram.com/jkrowlingofficial" },
    ],
    totalOwnedBooks: 12,
    totalWishlistBooks: 3,
    booksRead: 8,
    averageRating: 4.5,
  },
};

export const DeceasedAuthor: Story = {
  args: {
    authorName: "George Orwell",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
    birthDate: "25 giugno 1903",
    deathDate: "21 gennaio 1950",
    birthPlace: "Motihari, India britannica",
    nationality: "Regno Unito",
    bio: "Eric Arthur Blair, noto con lo pseudonimo di George Orwell, è stato uno scrittore, giornalista e saggista britannico. È considerato uno degli scrittori più influenti del XX secolo.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/George_Orwell",
    website: null,
    extraLinks: [],
    totalOwnedBooks: 4,
    totalWishlistBooks: 0,
    booksRead: 4,
    averageRating: 4.8,
  },
};

export const MinimalData: Story = {
  args: {
    authorName: "New Author",
    photoUrl: null,
    birthDate: null,
    deathDate: null,
    birthPlace: null,
    nationality: null,
    bio: null,
    wikipediaUrl: null,
    website: null,
    extraLinks: [],
    totalOwnedBooks: 0,
    totalWishlistBooks: 0,
    booksRead: 0,
    averageRating: null,
  },
};

export const NoPhoto: Story = {
  args: {
    authorName: "Anonymous Writer",
    photoUrl: null,
    birthDate: "1980",
    deathDate: null,
    birthPlace: "Italia",
    nationality: "Italiana",
    bio: "Scrittore contemporaneo che preferisce mantenere l'anonimato.",
    wikipediaUrl: null,
    website: "https://example.com",
    extraLinks: [],
    totalOwnedBooks: 5,
    totalWishlistBooks: 2,
    booksRead: 3,
    averageRating: 3.7,
  },
};
