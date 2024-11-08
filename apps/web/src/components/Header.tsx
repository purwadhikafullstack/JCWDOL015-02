import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white p-6 flex justify-between items-center">
      <div className="text-2xl font-bold">Washted.</div>
      <nav>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>About</li>
          <li>Support</li>
        </ul>
      </nav>
      <button className="bg-white text-blue-900 px-4 py-2 rounded">
        Contact us
      </button>
    </header>
  );
};

export default Header;
