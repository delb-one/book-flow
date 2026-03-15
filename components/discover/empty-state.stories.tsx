import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Discover/EmptyState",
  component: EmptyState,
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

type Story = StoryObj<typeof EmptyState>;

export const Visible: Story = {};

export const Hidden: Story = {
  args: {
    show: false,
  },
};
