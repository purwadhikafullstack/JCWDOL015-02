"use client"
import { getAllOutletAddressFetchDb } from '@/lib/addressLib';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const OutletList = () => {
  const [allAddress, setAllAddress] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    getAllOutlets()
  },[currentPage])

  const getAllOutlets = async () => {
    try {
      const { result,ok } = await getAllOutletAddressFetchDb(currentPage);
      if(!ok) throw result.message
      setAllAddress(result.data)
      setCurrentPage(result.currentPage)
      setTotalPage(result.totalPages)
    } catch (error) {
      console.log(error)
    }
  }
  const getOutletByState = async () => {
    
  }
  return (
    <div className="w-full flex flex-col justify-center items-center mt-5">
      {allAddress.map((address) => (
        <div key={address.id} className="text-center my-2">
        <h1 className="font-semibold text-lg md:text-xl">{address.city}</h1>
        <p className="font-medium text-sm md:text-base">
          {`${address.address}, ${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`}
        </p>
        <p className="flex justify-center items-center gap-2 font-medium text-sm md:text-base">
          <FaPhoneAlt />
          {address.phone}
        </p>
      </div>
      ))}
      <div className='my-5'></div>
      <div className="join sticky bottom-5">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="join-item btn">«</button>
        <button className="join-item btn">Page {currentPage} / {totalPage}</button>
        <button disabled={currentPage === totalPage} onClick={() => setCurrentPage(currentPage + 1)} className="join-item btn">»</button>
      </div>
      </div>
  );
};

export default OutletList;
