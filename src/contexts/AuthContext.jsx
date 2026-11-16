import { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in

  // Load from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("userRole", userData.role || "user");
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
  };

  // Check if admin
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}