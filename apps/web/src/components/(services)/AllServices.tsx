import Image from "next/image";
import data from '@/data/dummy.json';
import Link from "next/link";

const AllServices = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full md:w-[90%] flex flex-col justify-center items-center bg-beigeCustom p-4 rounded-xl">
      <div className="flex flex-col justify-center items-center">
        {data.cardServices.map((item, index) => {
          return (
            <div
              key={index}
              className="relative max-w-[90%] flex flex-col justify-center items-start mx-2 my-3 p-5 bg-lightCustom rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.services}
                  className="w-full h-full object-cover object-center"
                  layout="fill"
                  quality={75}
                />

                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>

              <div className="relative z-10 ml-3 min-h-[250px] flex flex-col justify-between items-center text-white">
                <div>
                  <h1 className="w-full bg-black bg-opacity-60 rounded-lg py-2 text-center text-lg sm:text-xl lg:text-2xl font-bold tracking-wider">{item.services}</h1>
                  <p className="text-center text-lg md:text-xl font-medium my-3">{item.description}</p>
                </div>
                <div className="w-full md:w-[90%] lg:w-[80%] flex justify-between items-center px-5">
                  <h2 className="text-base md:text-lg font-bold text-beigeCustom">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</h2>
                <Link href={item.route} className="text-black bg-beigeCustom hover:text-beigeCustom duration-300 hover:bg-black px-3 py-2 rounded-full text-sm md:text-base tracking-wide">
                  Order Now
                </Link> 
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default AllServices;