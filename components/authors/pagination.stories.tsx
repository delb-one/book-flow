import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Components/Authors/Pagination",
  component: Pagination,
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
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 8,
    totalPages: 8,
    onPageChange: () => {},
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: () => {},
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};
