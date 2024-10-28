import React from 'react';

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#4A90E2', // A calming blue color
    color: '#FFFFFF', // White text for contrast
    padding: '20px', // Spacing around the text
    textAlign: 'center', // Center the text
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    borderRadius: '8px', // Rounded corners
    fontFamily: 'Arial, sans-serif', // Clean font
  };

  const titleStyle: React.CSSProperties = {
    margin: 0, // Remove default margin
    fontSize: '2.5rem', // Larger font size for the title
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Laundry Management System</h1>
    </header>
  );
};

export default Header;
