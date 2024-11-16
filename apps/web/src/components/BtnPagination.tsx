'use client';

interface Props {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const BtnPagination = ({ currentPage, totalPage, onPageChange }: Props) => {
  return (
    <div className="join my-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)} // Trigger onPageChange for previous page
        className="join-item btn disabled:bg-gray-300"
      >
        «
      </button>
      <button className="join-item btn">
        Page {currentPage} / {totalPage}
      </button>
      <button
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)} // Trigger onPageChange for next page
        className="join-item btn disabled:bg-gray-300"
      >
        »
      </button>
    </div>
  );
};

export default BtnPagination;
