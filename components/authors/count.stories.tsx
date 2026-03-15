import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Count } from "./count";

const meta = {
  title: "Components/Authors/Count",
  component: Count,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Count>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 12,
  },
};

export const ZeroCount: Story = {
  args: {
    count: 0,
  },
};

export const LargeCount: Story = {
  args: {
    count: 1547,
  },
};

export const CustomLabel: Story = {
  args: {
    count: 5,
    label: "autori",
  },
};
