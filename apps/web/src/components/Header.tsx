import React from 'react';

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#4A90E2',
    color: '#FFFFFF',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '2.5rem',
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Laundry Management System</h1>
    </header>
  );
};

export default Header;
