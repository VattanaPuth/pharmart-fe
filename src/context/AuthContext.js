"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH AUTH
  // =========================
  const fetchAuth = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("role")
        : null;

    if (!token) {
      setAuth(null);
      setLoading(false);
      return;
    }

    try {
      let res;

      // ADMIN
      if (role === "ADMIN") {
        res = await api.get("/admin/me");

        setAuth({
          user: res.data.admin,
          role: "ADMIN",
          displayName: res.data.admin?.admin_name,
        });
      }

      // CUSTOMER / OWNER
      else {
        res = await api.get("/get_user_info");

        setAuth({
          user: res.data.user,
          customer: res.data.customer,
          owner: res.data.owner,
          role: res.data.role,
          profile: res.data.profile,
          address: res.data.address,
          displayName: res.data.display_name,
          email: res.data.email,
          phone: res.data.phone,
        });


        // =========================
// AUTO REFRESH TOKEN IF EKYC CHANGED
// =========================
if (res.data.role === "OWNER") {

  const currentToken = localStorage.getItem("token");

  if (currentToken) {

    const payload = JSON.parse(
      atob(currentToken.split(".")[1])
    );

    const tokenStatus = payload.ekyc_status;
    const dbStatus = res.data.profile?.status;

    // status changed in DB
    if (tokenStatus !== dbStatus) {

      console.log("Refreshing token due to ekyc status change");

      const refreshRes = await api.post("/refresh-token");

      const newToken = refreshRes.data.token;

      localStorage.setItem("token", newToken);

      document.cookie = `token=${newToken}; path=/`;

    }
  }
}
      }
    } catch (err) {
      console.error("Auth error:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        loading,
        refreshAuth: fetchAuth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}