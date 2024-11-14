import { FaPhoneAlt } from 'react-icons/fa';
import BtnPagination from './BtnPagination'; // Pastikan BtnPagination sesuai dengan komponen yang Anda miliki
import { Outlet } from '@/type/outlet'; // Pastikan tipe Outlet sesuai dengan definisi yang ada
import { useEffect } from 'react';

interface OutletListProps {
  outlets: Outlet[]; // Pastikan tipe Outlet sesuai dengan definisi Anda
  currentPage: number;
  totalPage: number;
  handlePageChange: (page: number) => void;
}

const OutletList = ({
  outlets,
  currentPage,
  totalPage,
  handlePageChange,
}: OutletListProps) => {
  // Debugging outlets dengan useEffect
  useEffect(() => {
    console.log('Outlets:', outlets); // Cek apakah data outlets diterima dengan benar
  }, [outlets]);

  return (
    <div className="w-full flex flex-col justify-start items-center mt-5">
      {/* Cek apakah ada outlet, jika tidak tampilkan pesan */}
      {outlets.length === 0 ? (
        <p>No outlets available</p>
      ) : (
        // Jika ada outlet, tampilkan daftar outlet
        outlets.map((outlet) => (
          <div key={outlet.id} className="w-full p-4 border-b mb-4">
            <div className="text-center">
              {/* Nama dan kota outlet */}
              <h1 className="font-semibold text-lg md:text-xl">
                {outlet.name}
              </h1>
              <p className="font-medium text-sm md:text-base text-gray-500">
                {outlet.city}
              </p>
              {/* Detail alamat outlet */}
              <p className="font-medium text-sm md:text-base">
                {`${outlet.address}, ${outlet.city}, ${outlet.state}, ${outlet.country}, ${outlet.postalCode}`}
              </p>
              {/* Informasi nomor telepon outlet */}
              <p className="flex justify-center items-center gap-2 font-medium text-sm md:text-base">
                <FaPhoneAlt />
                {outlet.phone}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="my-5">
        <BtnPagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange} // Pastikan fungsi handlePageChange di-handle dengan benar
        />
      </div>
    </div>
  );
};

export default OutletList;
