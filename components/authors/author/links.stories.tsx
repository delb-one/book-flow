import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Links } from "./links";

const meta = {
  title: "Components/Authors/Author/Links",
  component: Links,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Links>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLinks: Story = {
  args: {
    wikipediaUrl: "https://en.wikipedia.org/wiki/J._K._Rowling",
    website: "https://www.jkrowling.com",
    extraLinks: [
      { title: "Twitter", url: "https://twitter.com/jk_rowling" },
      { title: "Instagram", url: "https://instagram.com/jkrowlingofficial" },
      { title: "Facebook", url: "https://facebook.com/jkrowling" },
    ],
  },
};

export const OnlyWikipedia: Story = {
  args: {
    wikipediaUrl: "https://en.wikipedia.org/wiki/George_Orwell",
    website: null,
    extraLinks: [],
  },
};

export const OnlyWebsite: Story = {
  args: {
    wikipediaUrl: null,
    website: "https://www.example.com",
    extraLinks: [],
  },
};

export const OnlyExtraLinks: Story = {
  args: {
    wikipediaUrl: null,
    website: null,
    extraLinks: [
      { title: "Goodreads", url: "https://goodreads.com/author" },
      { url: "https://example.com/no-title" },
    ],
  },
};

export const NoLinks: Story = {
  args: {
    wikipediaUrl: null,
    website: null,
    extraLinks: [],
  },
};
