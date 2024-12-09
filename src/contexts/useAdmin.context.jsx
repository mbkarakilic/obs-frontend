import React, { createContext, useContext, useState } from "react";

// UserContext oluştur
const AdminContext = createContext();

// UserContext sağlayıcı bileşeni
export const AdminProvider = ({ children }) => {
  const { user } = useUserContext();

  const [isAdmin, setIsAdmin] = useState(user.isAdmin);

  const setAdmin = (value) => setIsAdmin(value);

  return (
    <AdminContext.Provider value={{ isAdmin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// Kullanımı kolaylaştırmak için özel bir hook
export const useAdminContext = () => useContext(AdminContext);
