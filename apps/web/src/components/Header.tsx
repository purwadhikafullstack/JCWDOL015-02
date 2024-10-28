'use client';
import Link from 'next/link';
import {  useEffect, useRef, useState } from 'react';
import { RiTShirtAirLine } from "react-icons/ri";
import { IoMdLogIn } from 'react-icons/io';
const Header = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("customer")
  const [userMenuIsOpen, setUserMenuIsOpen] = useState(false);
  const navMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event: MouseEvent) => {
    if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
      setUserMenuIsOpen(false);
    }
  };
  const handleLogout = () => {
    setIsLogin(false);
    setUserMenuIsOpen(false);
  }

  return (
      <nav
        className={`bg-[#ffffff81] text-black flex justify-between backdrop-blur-sm py-3 sticky top-0 items-center px-3 lg:px-6 z-[10000] border-b border-b-black`}
      >
        <div className="">
          <Link
            href={'/'}
            className={`text-black cursor-pointer flex justify-center items-center gap-2 `}
          >
            <RiTShirtAirLine className="text-sm md:text-xl" />
            <p className="text-sm font-semibold md:text-lg md:font-bold lg:text-xl lg:font-extrabold">
              LaunON.
            </p>
          </Link>
        </div>

        <div>
          <ul className="flex gap-3 lg:gap-5 justify-center items-center">
            <li>
              <Link
                href={'/'}
                className="hidden md:block pb-[2px] -mb-1 uppercase border-b border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={'/about'}
                className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href={'/services'}
                className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
              >
                services
              </Link>
            </li>
            <li>
              <Link
                href={'/outlets'}
                className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
              >
                outlets
              </Link>
            </li>
          </ul>
        </div>

        {isLogin ? (
          <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer"
               onClick={() => setUserMenuIsOpen(true)}>
            <p className='hidden md:block w-[118px] text-right truncate font-semibold'>{"Ahmad Mubarok"}</p>
            <div className={`avatar border-2 p-[1px] rounded-full duration-300 ${userMenuIsOpen ? 'border-beigeCustom' : 'border-transparent'}`}>
              <div className="w-11 rounded-full">
                <img src={"https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"} alt={"avatar"}/>
              </div>
            </div>
          </div>
        )
        : 
        (
          <Link
            href={'/auth/login'}
            className={`flex justify-center items-center hover:translate-x-2 duration-200`}
          >
            <IoMdLogIn className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]" />
          </Link>
        )}

        <div
        ref={navMenuRef}
        className={`absolute right-1 mt-60 md:mt-64 w-48 bg-beigeCustom rounded-md shadow-lg transform transition-all duration-300 ease-out ${
          userMenuIsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="py-2 text-black text-center flex flex-col justify-center items-center">
          <Link 
            href={`/user/profile`}
            className="w-full px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
            onClick={() => setUserMenuIsOpen(false)}
          >
            Profile
          </Link>

          {role == 'admin' || role == 'superAdmin' || role == 'worker' ? (
            <Link
              href={`/user/dashboard`}
              className="w-full px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
              onClick={() => setUserMenuIsOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href={`/user/orders`}
              className="w-full px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
              onClick={() => setUserMenuIsOpen(false)}
            >
              My Orders
            </Link>
          )}

          <li className="mt-10 flex justify-center items-center">
            <p
              className="w-fit px-2 py-1 bg-red-800 text-white duration-150 cursor-pointer border border-beigeCustom rounded-full hover:scale-110"
              onClick={() => handleLogout()}
            >
              Logout
            </p>
          </li>
        </ul>
      </div>
      </nav>
  );
};

export default Header;



// 'use client';
// import Link from 'next/link';
// import { useState } from 'react';
// import { RiTShirtAirLine } from 'react-icons/ri';
// import { IoMdLogIn } from 'react-icons/io';
// const Header = () => {
//   const [avatar, setAvatar] = useState(
//     'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   );
//   const [isLogin, setIsLogin] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(true);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [isUserMenu, setIsUserMenuOpen] = useState(false);

//   const handleMenuClick = (menu: string) => {
//     if (menu === 'account') alert('Navigating to account...');
//     if (menu === 'settings') alert('Navigating to settings...');
//     if (menu === 'orders') alert('Navigating to orders...');
//     if (menu === 'dashboard') alert('Navigating to dashboard...');
//     if (menu === 'logout') alert('Logging out...');
//     setIsUserMenuOpen(false);
//   };

//   return (
//     <nav
//       className={`bg-[#ffffff81] text-black flex justify-between backdrop-blur-sm py-3 sticky top-0 items-center px-3 lg:px-6 z-[10000] border-b border-b-black`}
//     >
//       <div className="">
//         <Link
//           href={'/'}
//           className={`text-black cursor-pointer flex justify-center items-center gap-2 `}
//         >
//           <RiTShirtAirLine className="text-sm md:text-xl" />
//           <p className="text-sm font-semibold md:text-lg md:font-bold lg:text-xl lg:font-extrabold">
//             LaunON.
//           </p>
//         </Link>
//       </div>

//       <div>
//         <ul className="flex gap-3 lg:gap-5 justify-center items-center">
//           <li>
//             <Link
//               href={'/'}
//               className="hidden md:block pb-[2px] -mb-1 uppercase border-b border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link
//               href={'/about'}
//               className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
//             >
//               About
//             </Link>
//           </li>
//           <li>
//             <Link
//               href={'/services'}
//               className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
//             >
//               services
//             </Link>
//           </li>
//           <li>
//             <Link
//               href={'/outlets'}
//               className="uppercase border-b pb-1 border-b-transparent tracking-wide text-xs font-normal lg:text-sm lg:font-medium hover:border-b-black duration-300"
//             >
//               outlets
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {isLogin ? (
//         <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 rounded-full cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenu)}>
//           <p className="hidden md:block w-[118px] truncate font-semibold">
//             Ahmad Mubarok
//           </p>
//           <div className="avatar">
//             <div className="w-14 rounded-full">
//               <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <Link
//           href={'/auth/login'}
//           className={`flex justify-center items-center hover:translate-x-2 duration-200`}
//         >
//           <IoMdLogIn className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]" />
//         </Link>
//       )}
//       <div
//         className={`absolute right-1 mt-64 md:mt-72 w-48 bg-beigeCustom rounded-md shadow-lg transform transition-all duration-300 ease-out ${
//           isUserMenu
//             ? 'opacity-100 translate-y-0'
//             : 'opacity-0 -translate-y-2 pointer-events-none'
//         }`}
//         onMouseEnter={() => setIsUserMenuOpen(true)}
//       >
//         <ul className="py-2 text-black text-center">
//           <li
//             className="px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
//             onClick={() => handleMenuClick('account')}
//           >
//             Profile
//           </li>
//           {isAdmin || isSuperAdmin ? (
//             <li
//               className="px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
//               onClick={() => handleMenuClick('dashboard')}
//             >
//               Dashboard
//             </li>
//           ) : (
//             <li
//               className="px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
//               onClick={() => handleMenuClick('orders')}
//             >
//               My Orders
//             </li>
//           )}
//           <li
//             className="px-4 py-2 hover:bg-gray-100 duration-150 cursor-pointer border-b border-b-black"
//             onClick={() => handleMenuClick('settings')}
//           >
//             Settings
//           </li>
//           <li className="mt-10 flex justify-center items-center">
//             <p
//               className="w-fit px-2 py-1 bg-red-800 text-white duration-150 cursor-pointer border border-beigeCustom rounded-full hover:scale-110"
//               onClick={() => handleMenuClick('logout')}
//             >
//               Logout
//             </p>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Header;
