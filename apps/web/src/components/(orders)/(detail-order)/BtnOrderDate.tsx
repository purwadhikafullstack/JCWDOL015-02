'use client';

import { orderDateSchema } from '@/yup/orderSchema';
import { ErrorMessage, Field, Form, Formik } from 'formik';

type BtnOrderDateProps = {
  isLoading: boolean;
  handleSubmit: (values: { orderDate: string }, resetForm: () => void) => void;
  byDateModal: HTMLDialogElement;
};

const BtnOrderDate = (props: BtnOrderDateProps) => {
  const { isLoading, handleSubmit, byDateModal } = props;

  return (
    <>
      <button
        onClick={() => byDateModal?.showModal()}
        className="text-sm font-semibold bg-blue-500 text-white duration-300 px-3 py-2 rounded-full uppercase tracking-wide shadow-xl hover:bg-blue-700"
      >
        Order Date
      </button>

      <dialog id="order_by_date" className="modal">
        <div className="modal-box w-11/12 max-w-3xl bg-[#0000006b]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white font-extrabold hover:text-gray-300">
              ✕
            </button>
          </form>

          <Formik
            validationSchema={orderDateSchema}
            initialValues={{ orderDate: '' }}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
          >
            <Form>
              <div className="flex justify-center items-center flex-col">
                <Field
                  type="date"
                  name="orderDate"
                  id="orderDate"
                  className="w-[80%] px-14 cursor-pointer rounded-lg bg-[#D9D9D9] mb-2 md:mt-1 py-1 text-center placeholder:text-gray-500"
                />
                <ErrorMessage
                  name="orderDate"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex flex-col justify-center items-center mt-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-[80%] rounded-full duration-300 bg-beigeCustom text-black mb-2 hover:bg-grayCustom hover:text-beigeCustom font-bold text-2xl py-1 tracking-wider hover:scale-105"
                >
                  {isLoading ? 'Processing...' : 'Search'}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </dialog>
    </>
  );
};

export default BtnOrderDate;
