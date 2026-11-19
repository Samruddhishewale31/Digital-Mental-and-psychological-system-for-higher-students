
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthUser,
  getCurrentUser,
  loginUser as loginUserService,
  logoutUser,
  registerUser as registerUserService,
} from "@/auth/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (id: string, password: string) => Promise<AuthUser>;
  register: (
    email: string,
    password: string,
    registrationCode?: string
  ) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (active) setUser(currentUser);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (
    id: string,
    password: string
  ): Promise<AuthUser> => {
    const loggedInUser = await loginUserService(id, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (
    email: string,
    password: string,
    registrationCode?: string
  ): Promise<AuthUser> => {
    const newUser = await registerUserService(
      email,
      password,
      registrationCode
    );

    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
