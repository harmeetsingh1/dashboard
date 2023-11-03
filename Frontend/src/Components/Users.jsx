import React, { useEffect, useState } from "react";

function Users() {

  const [users, setUsers] = useState([]);

  // Function to fetch user information
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      if (response.ok) {
        const { users } = await response.json();
        setUsers(users);
      } else {
        // Handle error
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users during component mount
  useEffect(() => {
    fetchUsers();
  }, []); 


  return (
    <div className="mt-64 ml-64">
      <h1 className="mb-4 text-3xl text-center">User Window</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <strong>Name:</strong> {user["Full Name"]}, <strong>Email:</strong>{" "}
            {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
