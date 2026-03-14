import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DiscoverSearchCard } from "./discover-search-card";

const meta: Meta<typeof DiscoverSearchCard> = {
  title: "Discover/DiscoverSearchCard",
  component: DiscoverSearchCard,
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

type Story = StoryObj<typeof DiscoverSearchCard>;

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
