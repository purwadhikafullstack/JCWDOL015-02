"use client"
import { MdDeleteSweep } from "react-icons/md";
import { AiOutlineWarning } from 'react-icons/ai';
import { useShallow } from "zustand/shallow";
import CardUserAddress from "./CardUserAddress";
import CreateAddress from "./CreateAddress";
import { getAddresByUserIdFetchDb, getAddressByIdFetchDb } from "@/lib/addressLib";
import { useEffect, useState } from "react";
import { ICustomerAddress } from "@/type/customerType";
import FormUpdateAddress from "./FormUpdateAddress";
import { useAppSelector } from "@/redux/hooks";

const AddressComp = () => {
  const user = useAppSelector((state) => state.auth)
  const [addresses, setAddresses] = useState<ICustomerAddress[]>([])
  useEffect(() => {
    allUserAddress();
  },[user])
  const allUserAddress = async () => {
    const { result, ok } = await getAddresByUserIdFetchDb(user.id)
    try {
      if(!ok) throw result.message
      setAddresses([...result.data])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full flex justify-center items-start">
        <div className="w-full border-l border-grayCustom flex flex-col justify-center items-center">
          <div className="mt-10 w-full px-2 md:px-10 flex justify-between items-center">
            <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wider">Your Address :</h1>
            <CreateAddress/>
          </div>
          <div className="w-full min-h-full flex flex-wrap justify-center items-start gap-3 p-5"> 
          {addresses.length > 0 ? (
              addresses
                .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
                .map((item) => (
                <div key={item.id}>
                  <CardUserAddress 
                      city={`${item.city}`} 
                      address={`${item.address}, ${item.city}, ${item.state}, ${item.country}, ${item.postalCode}`} 
                      phone={item.phone}
                      isMain={item.isMain}
                      addressId={item.id}
                  />
                  <FormUpdateAddress 
                      addressId={item.id}
                      initialValues={
                        {
                          id: item.id,
                          address: item.address,
                          city: item.city,
                          state: item.state,
                          country: item.country,
                          postalCode: item.postalCode,
                          phone: item.phone
                        }
                      }
                    />
                </div>
              ))
            ) : (
              <div className="w-full min-h-40 h-[100%] flex flex-col justify-center items-center ">
                <AiOutlineWarning className="text-grayCustom w-10 h-10"/>
                <h1 className="text-base md:text-lg font-bold text-grayCustom">Your address is empty ...</h1>
              </div>
            )
          }
          </div>
        </div>
      </div>
  )
}

export default AddressComp