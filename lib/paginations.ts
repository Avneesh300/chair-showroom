export const getPageNumbers = ({totalPages, currentPage }:any) => {
    const pages = [];
    const pageRange = 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > pageRange + 2) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - pageRange);
        i <= Math.min(totalPages - 1, currentPage + pageRange);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - pageRange - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };