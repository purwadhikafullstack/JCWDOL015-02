import React from 'react';

const LaundryItemForm = () => {
  return (
    <form>
      <h2>Add Laundry Item</h2>
      <input type="text" placeholder="Item Name" required />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default LaundryItemForm;
