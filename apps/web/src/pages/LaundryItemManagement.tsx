import React from 'react';
import LaundryItemForm from '../components/LaundryItemForm';
import LaundryItemList from '../components/LaundryItemList';

const LaundryItemManagement = () => {
  return (
    <div>
      <h1>Laundry Item Management</h1>
      <LaundryItemForm />
      <LaundryItemList />
    </div>
  );
};

export default LaundryItemManagement;
