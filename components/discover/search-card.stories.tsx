import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchCard } from "./search-card";

const meta: Meta<typeof SearchCard> = {
  title: "Components/Discover/SearchCard",
  component: SearchCard,
  args: {
    query: "",
    onQueryChange: () => {},
    handleRecommend: () => {},
    isLoading: false,
    searchError: null,
    resultsCount: 18,
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchCard>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    searchError: "Errore durante la ricerca.",
  },
};
