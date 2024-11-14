import { MdLocationPin } from "react-icons/md";

const CreateCurrentAddress = () => {
  return (
    <div
      onClick={() => console.log('Get Current Location')}
      className="w-[80%] rounded-full duration-300 bg-beigeCustom text-black mb-2 hover:bg-grayCustom hover:text-beigeCustom font-bold text-xl md:text-2xl py-1 tracking-wider hover:scale-105 flex justify-center items-center gap-3"
    >
      <MdLocationPin className="w-6 h-6 text-[brown]" />
      Get Current Location
    </div>
  );
};

export default CreateCurrentAddress;
