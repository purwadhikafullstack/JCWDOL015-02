interface BtnPaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const BtnPagination = ({
  currentPage,
  totalPage,
  onPageChange,
}: BtnPaginationProps) => {
  // Fungsi untuk pindah ke halaman sebelumnya
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // Fungsi untuk pindah ke halaman berikutnya
  const handleNext = () => {
    if (currentPage < totalPage) onPageChange(currentPage + 1);
  };

  return (
    <div className="join sticky bottom-5">
      {/* Tombol untuk pindah ke halaman sebelumnya */}
      <button
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="join-item btn disabled:bg-gray-300"
      >
        «
      </button>

      {/* Menampilkan halaman saat ini dan total halaman */}
      <button className="join-item btn">
        Page {currentPage} / {totalPage}
      </button>

      {/* Tombol untuk pindah ke halaman berikutnya */}
      <button
        disabled={currentPage === totalPage}
        onClick={handleNext}
        className="join-item btn disabled:bg-gray-300"
      >
        »
      </button>
    </div>
  );
};

export default BtnPagination;
