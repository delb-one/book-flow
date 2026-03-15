"use client";

import { useMemo, useState } from "react";

import type { AuthorCard } from "@/types/authors";
import { Search } from "@/components/authors/search";
import { Count } from "@/components/authors/count";
import { Grid } from "@/components/authors/grid";
import { Pagination } from "@/components/authors/pagination";

const PAGE_SIZE = 8;

type AuthorsPageClientProps = {
  authors?: AuthorCard[];
};

export function AuthorsPageClient({
  authors: initialAuthors = [],
}: AuthorsPageClientProps) {
  const authors = initialAuthors;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredAuthors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return authors;
    return authors.filter((author) =>
      author.name.toLowerCase().includes(query),
    );
  }, [authors, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAuthors.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedAuthors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAuthors.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAuthors]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Search value={search} onChange={handleSearchChange} />
        <Count count={filteredAuthors.length} />
      </div>

      <Grid authors={pagedAuthors} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
