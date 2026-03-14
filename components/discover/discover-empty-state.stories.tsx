import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DiscoverEmptyState } from "./discover-empty-state";

const meta: Meta<typeof DiscoverEmptyState> = {
  title: "Discover/DiscoverEmptyState",
  component: DiscoverEmptyState,
  args: {
    show: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DiscoverEmptyState>;

export const Visible: Story = {};

export const Hidden: Story = {
  args: {
    show: false,
  },
};
