import React from 'react';

const UserAssignmentForm = () => {
  return (
    <form>
      <h2>Assign User</h2>
      <input type="text" placeholder="User Name" required />
      <button type="submit">Assign User</button>
    </form>
  );
};

export default UserAssignmentForm;
