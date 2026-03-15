import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats } from "./stats";

const meta = {
  title: "Components/Authors/Author/Stats",
  component: Stats,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalOwnedBooks: 12,
    totalWishlistBooks: 3,
    booksRead: 8,
    averageRating: 4.5,
  },
};

export const NoOwnedBooks: Story = {
  args: {
    totalOwnedBooks: 0,
    totalWishlistBooks: 5,
    booksRead: 2,
    averageRating: 3.5,
  },
};

export const PerfectRating: Story = {
  args: {
    totalOwnedBooks: 6,
    totalWishlistBooks: 0,
    booksRead: 6,
    averageRating: 5.0,
  },
};

export const NoRating: Story = {
  args: {
    totalOwnedBooks: 3,
    totalWishlistBooks: 1,
    booksRead: 0,
    averageRating: null,
  },
};

export const AllZeros: Story = {
  args: {
    totalOwnedBooks: 0,
    totalWishlistBooks: 0,
    booksRead: 0,
    averageRating: null,
  },
};
