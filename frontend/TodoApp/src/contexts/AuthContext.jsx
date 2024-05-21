import React, { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component to wrap your app and provide the context
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initial state is null as the user is not authenticated

  // Function to set the userId when user logs in
  

  // Function to clear the userId when user logs out
 

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
