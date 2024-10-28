import React from 'react';
import OutletForm from '../components/OutletForm';
import OutletList from '../components/OutletList';

const OutletManagement = () => {
  return (
    <div>
      <h1>Outlet Management</h1>
      <OutletForm />
      <OutletList />
    </div>
  );
};

export default OutletManagement;
