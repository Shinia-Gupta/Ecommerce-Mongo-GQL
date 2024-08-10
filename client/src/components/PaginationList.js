import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationList({ totalItems, itemsPerPage, onPageChange }) {
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const maxVisiblePages = 5;

  const handlePageChange = (newPage, event) => {
    event.preventDefault();
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return { start, end };
  };

  const { start, end } = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => handlePageChange(Math.max(currentPage - 1, 1), event)}
          />
        </PaginationItem>
        
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={(event) => handlePageChange(1, event)}>1</PaginationLink>
            </PaginationItem>
            {start > 2 && <PaginationEllipsis />}
          </>
        )}
        
        {Array.from({ length: end - start + 1 }, (_, index) => start + index).map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(event) => handlePageChange(page, event)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink href="#" onClick={(event) => handlePageChange(totalPages, event)}>{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => handlePageChange(Math.min(currentPage + 1, totalPages), event)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
