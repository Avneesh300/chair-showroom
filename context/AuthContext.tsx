"use client";
import { createContext, useContext, useEffect, useState,} from "react";
import { loginApi, verifyEmailOtpApi, googleLoginApi, logoutApi,} from "@/services/user.service";

type UserRole = | "admin" | "customer" | null;

interface AuthUser {
  _id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: ( email: string, password: string ) => Promise<any>;
  otpLogin: ( email: string, otp: string ) => Promise<any>;
  googleLogin: ( token: string ) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>( {} as AuthContextType );

export function AuthProvider({ children,}: { children: React.ReactNode;}) {
  const [user, setUser] = useState<AuthUser | null>( null );
  const [loading, setLoading] = useState(true);

  // =====================
  // LOAD USER
  // =====================
  useEffect(() => {
    const userData = localStorage.getItem( "user_data" );
    if (userData) { setUser( JSON.parse(userData) );
    }
    setLoading(false);
  }, []);

  // =====================
  // LOGIN
  // =====================
  const login = async ( email: string, password: string) => {
    try {
      const fd = new FormData();
      fd.append( "email", email );
      fd.append( "password", password );
      const response: any = await loginApi(fd);
      if ( response?.success || response?.status === "success" ) {
        const user = response.data.user;
        localStorage.setItem( "token", response.data.accessToken );
        localStorage.setItem( "refresh_token", response.data.refreshToken);
        localStorage.setItem( "user_data", JSON.stringify( user ));
        setUser(user);
        return {
          success: true,
          role: user.role,
        };
      }
      return {
        success: false,
        error: response?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Login failed",
      };
    }
  };

  // =====================
  // OTP LOGIN
  // =====================
  const otpLogin = async ( email: string, otp: string ) => {
    try {
      const fd = new FormData();
      fd.append( "email", email );
      fd.append( "otp", otp );
      const response: any = await verifyEmailOtpApi( fd );
      if ( response?.success || response?.status === "success") {
        const user = response.data.user;
        localStorage.setItem( "token", response.data.accessToken );
        localStorage.setItem( "refresh_token", response.data.refreshToken );
        localStorage.setItem( "user_data", JSON.stringify( user ) );
        setUser(user);
        return {
          success: true,
          role: user.role,
        };
      }

      return {
        success: false,
        error: response?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "OTP Login Failed",
      };
    }
  };

  // =====================
  // GOOGLE LOGIN
  // =====================
  const googleLogin =
    async ( token: string ) => {
      try {
        const fd = new FormData();
        fd.append( "token", token );
        const response: any = await googleLoginApi( fd );
        if ( response?.success || response?.status === "success" ) {
          const user = response.data.user;
          localStorage.setItem( "token", response.data.accessToken );
          localStorage.setItem( "refresh_token", response.data.refreshToken );
          localStorage.setItem( "user_data", JSON.stringify( user ) );
          setUser(user);
          return {
            success: true,
            role: user.role,
          };
        }
        return {
          success: false,
          error: response?.message,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error?.message || "Google Login Failed",
        };
      }
    };

  // =====================
  // LOGOUT
  // =====================
  const logout =
    async () => {
      try {
        await logoutApi();
      } catch (error) { }
      localStorage.removeItem( "token" );
      localStorage.removeItem( "refresh_token" );
      localStorage.removeItem( "user_data" );
      setUser(null);
      window.location.href = "/login";
    };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, otpLogin, googleLogin, logout, isLoggedIn: !!user, }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);