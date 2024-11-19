import { deleteAddressFetchDb } from "@/lib/addressLib";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

type Props = {
  addressId: number
}
const BtnDeleteAddress = (props: Props) => {
    const {addressId} = {...props}
    const [isLoading, setIsLoading] = useState(false);
    const modalConfirmDeleted = document.getElementById('modal_confirm_delete_address') as HTMLDialogElement;
    const handleDeleteAddress = async (id: number) => {
        setIsLoading(true)
        const { result, ok } = await deleteAddressFetchDb(id)
        try {
            if(!ok) throw result.message
            toast.success(result.message as string)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }
  return (
      <>
        <button
          disabled={isLoading}
          onClick={() => modalConfirmDeleted?.showModal()}
          className="btn btn-ghost btn-circle hover:text-red-600"
        >
          <MdDeleteOutline className="w-7 h-7" />
        </button>
        <dialog id="modal_confirm_delete_address" className="modal">
          <div className="modal-box bg-[#0000006b] backdrop-blur-md">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-bold text-lg text-beigeCustom">Are you sure you want to delete this address?</h3>
              <button onClick={() => {handleDeleteAddress(addressId)}} className="text-black hover:text-beigeCustom bg-beigeCustom hover:bg-black duration-300 rounded-full text-lg md:text-sm font-semibold px-2 py-1 mt-1">
                {isLoading ? 'Proccessing..':'Delete'}
              </button>
            </div>
          </div>
        </dialog>
      </>
  );
};

export default BtnDeleteAddress;
