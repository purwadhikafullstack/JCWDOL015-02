'use client';
import { IoIosSearch } from 'react-icons/io';
import BtnOrderId from './BtnOrderId';
import BtnOrderDate from './BtnOrderDate';
import { useState } from 'react';
import { searchOrderFetchDb } from '@/lib/orderLib';

// Define the Props type with the updated signature for handleSubmitSearch
type Props = {
  handleSubmitSearch: (
    values: { orderId?: string; date?: string },
    resetForm: () => void,
  ) => void;
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
  } = props;

  // State to hold form data
  const [values, setValues] = useState<any>({ status: '' });

  // Handle form submission and call parent handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitSearch(values, resetForm); // Passing both 'values' and 'resetForm'
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
            handleSubmit={handleFormSubmit}
            byIdModal={byIdModal}
          />
          <BtnOrderDate
            isLoading={isLoading}
            handleSubmit={handleFormSubmit}
            byDateModal={byDateModal}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SearchOrder;
function resetForm(): void {
  throw new Error('Function not implemented.');
}
