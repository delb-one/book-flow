"use client";

import { Search as SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function Search({
  value,
  onChange,
  placeholder = "Cerca autore...",
}: SearchProps) {
  return (
    <div className="relative w-full lg:max-w-md">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}
