"use client"
import { getAllOutletAddressFetchDb } from '@/lib/addressLib';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import BtnPagination from '../BtnPagination';

const OutletList = () => {
  const searchParams = useSearchParams();
  const router = useRouter()
  const currentPage = Number(searchParams.get('page')) || 1
  const [allAddress, setAllAddress] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    const getAllOutlets = async () => {
      try {
        const { result,ok } = await getAllOutletAddressFetchDb(currentPage);
        if(!ok) throw result.message
        setAllAddress(result.data)
        setTotalPage(result.totalPages)
      } catch (error) {
        console.log(error)
      }
    }
    getAllOutlets()
  },[currentPage])

  const scrollTop = () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_WEB_URL}/outlets?page=${page}`)
    scrollTop()
  }
  return (
    <div className="w-full flex flex-col justify-start items-center mt-5">
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
      <BtnPagination currentPage={currentPage} totalPage={totalPage} handlePageChange={handlePageChange} />
      </div>
  );
};

export default OutletList;
