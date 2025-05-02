import { useMemo } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage?: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ 
  currentPage, 
  totalResults, 
  resultsPerPage = 10, 
  onPageChange 
}: PaginationProps) => {
  const totalPages = useMemo(() => {
    return Math.ceil(totalResults / resultsPerPage);
  }, [totalResults, resultsPerPage]);

  // Generate page numbers to show (current, 2 before, 2 after, first, last)
  const pageNumbers = useMemo(() => {
    const pages = new Set<number>();
    
    // Always include first and last page
    if (totalPages > 0) pages.add(1);
    if (totalPages > 1) pages.add(totalPages);
    
    // Include current page and 2 pages before and after
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.add(i);
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
        aria-label="Previous page"
      >
        &laquo;
      </button>
      
      {pageNumbers.map((page, index, array) => {
        // Add ellipsis between non-consecutive pages
        const showEllipsis = index > 0 && page - array[index - 1] > 1;
        
        return (
          <div key={page} className={styles.pageNumberWrapper}>
            {showEllipsis && <span className={styles.ellipsis}>...</span>}
            <button
              onClick={() => onPageChange(page)}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </div>
        );
      })}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;