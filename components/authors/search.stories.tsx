import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "./search";

const meta = {
  title: "Components/Authors/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Search {...args} value={value} onChange={setValue} />;
  },
};

export const WithValue: Story = {
  args: {
    value: "J.K. Rowling",
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Search {...args} value={value} onChange={setValue} />;
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: "",
    placeholder: "Cerca...",
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Search {...args} value={value} onChange={setValue} />;
  },
};
