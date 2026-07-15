import { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("ssc_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);

    setUser(data.user);

    localStorage.setItem(
      "ssc_user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "ssc_token",
      data.jwt_token
    );

    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);

    setUser(data.user);

    localStorage.setItem(
      "ssc_user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "ssc_token",
      data.jwt_token
    );

    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);

      localStorage.removeItem("ssc_user");
      localStorage.removeItem("ssc_token");
    }
  };

  const updateUser = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "ssc_user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};