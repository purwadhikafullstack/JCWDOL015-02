import React from 'react';

const OutletForm = () => {
  return (
    <form>
      <h2>Add Outlet</h2>
      <input type="text" placeholder="Outlet Name" required />
      <button type="submit">Add Outlet</button>
    </form>
  );
};

export default OutletForm;
