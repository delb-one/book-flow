import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Grid } from "./grid";

const meta = {
  title: "Components/Authors/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAuthors = [
  {
    id: "author-1",
    slug: "j-k-rowling",
    name: "J.K. Rowling",
    bookCount: 12,
    covers: [
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
    ],
    bio: null,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
    wikipediaUrl: null,
    openLibraryKey: null,
  },
  {
    id: "author-2",
    slug: "george-orwell",
    name: "George Orwell",
    bookCount: 6,
    covers: [
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
    ],
    bio: null,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
    wikipediaUrl: null,
    openLibraryKey: null,
  },
  {
    id: "author-3",
    slug: "gabriel-garcia-marquez",
    name: "Gabriel García Márquez",
    bookCount: 10,
    covers: [
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
      "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
    ],
    bio: null,
    photoUrl: null,
    wikipediaUrl: null,
    openLibraryKey: null,
  },
  {
    id: "author-4",
    slug: "new-author",
    name: "New Author",
    bookCount: 0,
    covers: [],
    bio: null,
    photoUrl: null,
    wikipediaUrl: null,
    openLibraryKey: null,
  },
];

export const Default: Story = {
  args: {
    authors: sampleAuthors,
  },
};

export const SingleAuthor: Story = {
  args: {
    authors: [sampleAuthors[0]],
  },
};

export const Empty: Story = {
  args: {
    authors: [],
  },
};

export const ManyAuthors: Story = {
  args: {
    authors: [...sampleAuthors, ...sampleAuthors],
  },
};
