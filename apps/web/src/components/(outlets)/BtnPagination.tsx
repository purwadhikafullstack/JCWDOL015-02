
const BtnPagination = ({props}: any) => {
    const {currentPage, totalPage, handlePageChange} = {...props}
  return (
    <div className="join sticky bottom-5">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="join-item btn disabled:bg-gray-300">«</button>
        <button className="join-item btn">Page {currentPage} / {totalPage}</button>
        <button disabled={currentPage === totalPage} onClick={() => handlePageChange(currentPage + 1)} className="join-item btn disabled:bg-gray-300">»</button>
      </div>
  )
}

export default BtnPagination