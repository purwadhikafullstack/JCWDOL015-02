'use client';

interface Props {
  currentPage: number;
  totalPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

const BtnPagination = ({
  currentPage,
  totalPage,
  onPrevious,
  onNext,
}: Props) => {
  return (
    <div className="join my-2">
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="join-item btn disabled:bg-gray-300"
      >
        «
      </button>
      <button className="join-item btn">
        Page {currentPage} / {totalPage}
      </button>
      <button
        disabled={currentPage === totalPage}
        onClick={onNext}
        className="join-item btn disabled:bg-gray-300"
      >
        »
      </button>
    </div>
  );
};

export default BtnPagination;
