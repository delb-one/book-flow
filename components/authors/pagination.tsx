"use client";

import {
  Pagination as PaginationUi,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PageItem = number | "ellipsis";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  function getVisiblePages(total: number, current: number): PageItem[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
    if (current >= total - 2)
      return [1, "ellipsis", total - 3, total - 2, total - 1, total];
    return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
  }

  function handlePageChange(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(safePage);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-xs text-muted-foreground w-full">
        Pagina {currentPage} di {totalPages}
      </div>

      <PaginationUi className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {getVisiblePages(totalPages, currentPage).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(item);
                  }}
                  isActive={item === currentPage}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUi>
    </div>
  );
}
