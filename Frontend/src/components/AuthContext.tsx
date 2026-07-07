import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  role: string;
  emailVerified: boolean;
  workspaceId: string | null;
  workspace?: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    industry: string | null;
    country: string | null;
  } | null;
}

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<UserProfile>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session using the refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          const token = data.data.accessToken;
          setAccessToken(token);

          // Get profile
          const userRes = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.data.user);
          }
        }
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.errors?.[0]?.message || data.message || "Failed to sign in";
      const error: any = new Error(errorMsg);
      error.statusCode = res.status;
      throw error;
    }

    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (payload: any): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || data.message || "Failed to sign up");
    }

    return data;
  };

  const logout = async (): Promise<void> => {
    try {
      if (accessToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: any): Promise<UserProfile> => {
    if (!accessToken) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.errors?.[0]?.message || responseData.message || "Failed to update profile");
    }

    setUser(responseData.data.user);
    return responseData.data.user;
  };

  const verifyEmail = async (token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`, {
      method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to verify email");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        updateProfile,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
