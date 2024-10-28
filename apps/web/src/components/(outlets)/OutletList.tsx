"use client"
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";

const OutletList = () => {
  const [isLongList, setIsLongList] = useState(false);
  const list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  const shortList = list.slice(0, 5);
  return (
    <div className="w-full flex flex-col justify-center items-center mt-5">
      {!isLongList ? shortList.map((item) => {
        return (
          <div key={item} className="text-center my-2">
            <h1 className="font-semibold text-lg md:text-xl">Jakarta</h1>
            <p className="font-medium text-sm md:text-base">
              Jl. Cempaka Putih Raya No. 1, Cempaka Putih, Jakarta Pusat, Daerah
              Khusus Ibukota Jakarta 10220
            </p>
            <p className="flex justify-center items-center gap-2 font-medium text-sm md:text-base">
              <FaPhoneAlt />
              (021-290-9999)
            </p>
          </div>
        );
      }) : list.map((item) => {
        return (
          <div key={item} className="text-center my-2">
            <h1 className="font-semibold text-lg md:text-xl">Jakarta</h1>
            <p className="font-medium text-sm md:text-base">
              Jl. Cempaka Putih Raya No. 1, Cempaka Putih, Jakarta Pusat, Daerah
              Khusus Ibukota Jakarta 10220
            </p>
            <p className="flex justify-center items-center gap-2 font-medium text-sm md:text-base">
              <FaPhoneAlt />
              (021-290-9999)
            </p>
          </div>
        );
      })}
        {!isLongList ? (
          <div onClick={() => setIsLongList(!isLongList)} className='flex flex-col justify-center items-center text-grayCustom cursor-pointer hover:translate-y-3 duration-300'>
          <h1 className='text-center text-base'>Show All</h1>
          <MdKeyboardDoubleArrowDown className='w-8 h-8'/>
        </div>
        ) : (
          <div onClick={() => setIsLongList(!isLongList)} className='flex flex-col justify-center items-center text-grayCustom cursor-pointer hover:-translate-y-3 duration-300'>
          <h1 className='text-center text-base'>Short List</h1>
          <MdKeyboardDoubleArrowUp className='w-8 h-8'/>
        </div>
        )}
      </div>
  );
};

export default OutletList;
