'use client';
import { mailUpdateEmailFetchDb } from '@/lib/sendMailLib';
import { useAppSelector } from '@/redux/hooks';
import { useState } from 'react';
import { toast } from 'react-toastify';

const UpdateEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth);
  const modal = document.getElementById(
    'modal_update_email',
  ) as HTMLDialogElement;
  const sendMailUpdate = async () => {
    setIsLoading(true);
    const email = user.email;
    try {
      const { result, ok } = await mailUpdateEmailFetchDb({ email });
      if (!ok) throw result.message;
      toast.success(result.message);
      modal.close();
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <dialog id="modal_update_email" className="modal">
      <div className="modal-box flex flex-col justify-center items-center  bg-[#0000006b] mx-2">
        <h1 className="text-xl font-semibold text-white">
          Are you sure want to update your email?
        </h1>
        <p className="text-beigeCustom">
          If yes, you will re-verify your email
        </p>
        <div className="flex justify-center items-center gap-2 w-full mt-3">
          <div className="flex justify-center items-center gap-2 w-full mt-3">
            <button
              disabled={isLoading}
              onClick={sendMailUpdate}
              className="text-sm font-semibold bg-beigeCustom hover:bg-black hover:text-beigeCustom duration-300 px-3 py-2 rounded-full uppercase tracking-wide shadow-xl"
            >
              {isLoading ? 'Processing...' : 'Update Email'}
            </button>
            <button
              onClick={() => modal.close()}
              className="text-sm font-semibold bg-black text-beigeCustom duration-300 px-3 py-2 rounded-full uppercase tracking-wide shadow-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default UpdateEmail;
