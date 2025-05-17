import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log("🧠 AuthContext currentUser from localStorage:", storedUser);

  const [currentUser, setCurrentUser] = useState(storedUser || null);

  const updateUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data)); // ✅ Save immediately
    setCurrentUser(data);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
