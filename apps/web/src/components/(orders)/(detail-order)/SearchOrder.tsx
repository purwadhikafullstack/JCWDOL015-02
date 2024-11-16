'use client';
import { IoIosSearch } from 'react-icons/io';
import BtnOrderId from './BtnOrderId';
import BtnOrderDate from './BtnOrderDate';
import { useState } from 'react';
import { OrderStatus } from '@/type/orderStatus'; // Pastikan tipe OrderStatus sudah sesuai

type Props = {
  handleSubmitSearch: (values: any, resetForm: any) => void;
  isLoading: boolean;
  selectSearchModal: HTMLDialogElement;
  byIdModal: HTMLDialogElement;
  byDateModal: HTMLDialogElement;
};

const SearchOrder = (props: Props) => {
  const {
    handleSubmitSearch,
    isLoading,
    selectSearchModal,
    byIdModal,
    byDateModal,
  } = { ...props };

  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Fungsi untuk mengubah status filter dan mengirimkan ke handleSubmitSearch
  const handleFilterChange = (selectedStatus: string) => {
    setSelectedStatus(selectedStatus); // Update status yang dipilih
    handleSubmitSearch({ status: selectedStatus }, resetForm); // Kirimkan status ke fungsi pencarian
  };

  return (
    <div className="my-4">
      <button
        onClick={() => selectSearchModal?.showModal()}
        className="flex justify-center items-center gap-1 cursor-pointer hover:bg-black hover:text-beigeCustom bg-beigeCustom text-black py-2 px-4 rounded-full transition duration-200 shadow-xl shadow-[#00000048] text-base uppercase tracking-wide"
      >
        Search Order <IoIosSearch />
      </button>

      <dialog id="modal_search_order" className="modal">
        <div className="modal-box flex justify-center items-center gap-3 bg-[#0000006b] mx-2">
          <BtnOrderId
            isLoading={isLoading}
            handleSubmit={handleSubmitSearch}
            byIdModal={byIdModal}
          />
          <BtnOrderDate
            isLoading={isLoading}
            handleSubmit={handleSubmitSearch}
            byDateModal={byDateModal}
          />

          {/* Dropdown untuk memilih status filter */}
          <div className="flex justify-center items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="bg-white text-black border border-gray-300 rounded p-2"
            >
              <option value="">Select Status</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SearchOrder;
