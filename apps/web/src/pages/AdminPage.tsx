import React from 'react';
import OutletList from '../components/OutletList';
import LaundryItemList from '../components/LaundryItemList';
import UserAssignmentForm from '../components/UserAssignmentForm';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <OutletList />
      <LaundryItemList />
      <UserAssignmentForm />
    </div>
  );
};

export default AdminPage;
