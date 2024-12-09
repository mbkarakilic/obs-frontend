import React, { createContext, useContext, useState } from "react";

// UserContext oluştur
const UserContext = createContext();

// UserContext sağlayıcı bileşeni
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kullanıcı verilerini güncellemek için işlevler
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, }}>
      {children}
    </UserContext.Provider>
  );
};

// Kullanımı kolaylaştırmak için özel bir hook
export const useUserContext = () => useContext(UserContext);
