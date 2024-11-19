// OrderCreateForm.tsx
import React, { FormEvent, useState } from 'react';

type OrderCreateFormProps = {
  onSubmit: (e: FormEvent, orderData: any) => Promise<void>;
};

const OrderCreateForm: React.FC<OrderCreateFormProps> = ({ onSubmit }) => {
  const [orderData, setOrderData] = useState({
    // Define initial values for form fields here
    itemName: '',
    // Add other fields as needed: quantity: 1, price: 0, etc.
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(e, orderData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="text"
        name="itemName"
        value={orderData.itemName}
        onChange={handleChange}
        placeholder="Enter item name"
      />
      {/* Additional fields as required */}
      <button type="submit">Create Order</button>
    </form>
  );
};

export default OrderCreateForm;
