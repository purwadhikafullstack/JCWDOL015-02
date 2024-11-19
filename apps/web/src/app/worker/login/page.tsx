// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginWorker() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => { //     e.preventDefault(); //     setMessage('');

//     const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
//     const loginUrl = `${BACKEND_URL}/api/outlet-workers/login`;

//     try {
//       const response = await fetch(loginUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log(data);

//       if (response.ok) {
//         setMessage('Login successful');

//         localStorage.setItem('outletWorker', JSON.stringify(data.outletWorker));
//         router.push('/worker/dashboard');
//       } else {
//         setMessage(data.error || 'Login failed');
//       }
//     } catch (error) {
//       setMessage('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
//         <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
//           Worker Login
//         </h2>

//         {message && <p className="mb-4 text-center text-red-600">{message}</p>}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 mt-1 border border-slate-300 bg-white"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 mt-1 bg-white border border-slate-300"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginWorker() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // URL backend
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const loginUrl = `${BACKEND_URL}/api/outlet-workers/login`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful');

        // Menyimpan data user ke localStorage
        localStorage.setItem('outletWorker', JSON.stringify(data.outletWorker));

        // Mengarahkan user ke dashboard
        router.push('/worker/dashboard');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Worker Login
        </h2>

        {message && <p className="mb-4 text-center text-red-600">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-slate-300 bg-white"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-white border border-slate-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
