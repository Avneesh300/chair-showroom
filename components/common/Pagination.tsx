import { getPageNumbers } from "@/lib/paginations";
import React from "react";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    goToPage,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-start p-4">
            <div className="inline-flex  shadow-sm overflow-hidden border">
                {/* Previous */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm bg-white hover:bg-gray-100 disabled:opacity-50 border-r"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers({ totalPages, currentPage }).map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="px-4 py-2 text-sm bg-white border-r"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 text-sm border-r ${currentPage === page
                                    ? "btn btn-primary text-white"
                                    : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    ),
                )}

                {/* Next */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;