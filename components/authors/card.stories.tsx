import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthorCard } from "./card";

const meta = {
  title: "Components/Authors/Card",
  component: AuthorCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    author: {
      description: "Author data object",
    },
  },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseAuthor = {
  id: "author-1",
  slug: "j-k-rowling",
  name: "J.K. Rowling",
  bookCount: 12,
  covers: [
    "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
    "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
    "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
  ],
  bio: "J.K. Rowling is a British author best known as the creator of the Harry Potter fantasy series.",
  photoUrl:
    "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
  wikipediaUrl: "https://en.wikipedia.org/wiki/J._K._Rowling",
  openLibraryKey: "OL23919A",
};

export const Default: Story = {
  args: {
    author: baseAuthor,
  },
};

export const WithFewBooks: Story = {
  args: {
    author: {
      ...baseAuthor,
      name: "George Orwell",
      slug: "george-orwell",
      bookCount: 3,
      covers: [
        "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
      ],
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
    },
  },
};

export const NoCovers: Story = {
  args: {
    author: {
      ...baseAuthor,
      name: "New Author",
      slug: "new-author",
      bookCount: 0,
      covers: [],
      photoUrl: null,
    },
  },
};

export const LongName: Story = {
  args: {
    author: {
      ...baseAuthor,
      name: "Gabriel García Márquez",
      slug: "gabriel-garcia-marquez",
      bookCount: 15,
      covers: [
        "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
        "https://images-na.ssl-images-amazon.com/images/S/COMMERCE-MERCHANDISING-IMAGES/b/1/0/1/101b0b1c-8f3e-4f3e-8f3e-8f3e8f3e8f3e._SY466_.jpg",
      ],
    },
  },
};
