import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("fasalsathi-token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fasalsathi-user")) || null; }
    catch { return null; }
  });

  const loggedIn = Boolean(token);

  const requestOtp = async (phone, mode = "login", name = "") => {
    const { data } = await api.post("/auth/request-otp", { phone, mode, name });
    return data;
  };

  const verifyOtp = async (phone, otp, mode = "login", name = "") => {
    const { data } = await api.post("/auth/verify-otp", { phone, otp, mode, name });
    localStorage.setItem("fasalsathi-token", data.access_token);
    localStorage.setItem("fasalsathi-user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("fasalsathi-token");
    localStorage.removeItem("fasalsathi-user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    api.get("/auth/me").then(({ data }) => {
      setUser(data);
      localStorage.setItem("fasalsathi-user", JSON.stringify(data));
    }).catch(() => logout());
  }, []);

  return <AuthContext.Provider value={{ token, user, loggedIn, requestOtp, verifyOtp, logout }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
