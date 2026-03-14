import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchCard } from "./search-card";

const meta: Meta<typeof SearchCard> = {
  title: "Discover/SearchCard",
  component: SearchCard,
  args: {
    query: "",
    onQueryChange: () => {},
    onRecommend: () => {},
    isLoading: false,
    isRecommending: false,
    searchError: null,
    recommendationError: null,
    recommendationReason: null,
    resultsCount: 18,
    viewMode: "grid",
    onViewModeChange: () => {},
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

export const Recommendation: Story = {
  args: {
    isRecommending: true,
    recommendationReason: "Consiglio basato su: fantasy",
    resultsCount: 1,
  },
};
