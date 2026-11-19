
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const TOKEN_KEY = "mindease_token";
const LAST_ID_KEY = "mindease_last_id";

export interface AuthUser {
  id: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

const saveToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () =>
  sessionStorage.getItem(TOKEN_KEY);

const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export const saveLastMindEaseId = (id: string) => {
  localStorage.setItem(LAST_ID_KEY, id);
};

export const getLastMindEaseId = () => {
  return localStorage.getItem(LAST_ID_KEY) || "";
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data as T;
};

// ------------------------------------------
// REGISTRATION EMAIL OTP
// ------------------------------------------

export const sendRegistrationOtp = async (email: string) => {
  return apiRequest<MessageResponse>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const verifyRegistrationOtp = async (
  email: string,
  otp: string
) => {
  return apiRequest<MessageResponse>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

// ------------------------------------------
// REGISTER
// ------------------------------------------

export const registerUser = async (
  email: string,
  password: string,
  registrationCode?: string
): Promise<AuthUser> => {
  const data = await apiRequest<AuthResponse>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        registrationCode: registrationCode?.trim() || undefined,
      }),
    }
  );

  if (!data.user || !data.token) {
    throw new Error("Registration response was incomplete.");
  }

  saveToken(data.token);
  saveLastMindEaseId(data.user.id);

  return data.user;
};

// ------------------------------------------
// LOGIN
// ------------------------------------------

export const loginUser = async (
  id: string,
  password: string
): Promise<AuthUser> => {
  const data = await apiRequest<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ id, password }),
    }
  );

  if (!data.user || !data.token) {
    throw new Error("Login response was incomplete.");
  }

  saveToken(data.token);
  saveLastMindEaseId(data.user.id);

  return data.user;
};

// ------------------------------------------
// FORGOT MINDEASE ID
// ------------------------------------------

export const requestIdRecovery = async (email: string) => {
  return apiRequest<MessageResponse>(
    "/api/auth/recover-id/send-otp",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
};

export const verifyIdRecovery = async (
  email: string,
  otp: string
) => {
  return apiRequest<MessageResponse>(
    "/api/auth/recover-id/verify",
    {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }
  );
};

// ------------------------------------------
// FORGOT PASSWORD
// ------------------------------------------

export const requestPasswordReset = async (email: string) => {
  return apiRequest<MessageResponse>(
    "/api/auth/password-reset/send-otp",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
};

export const confirmPasswordReset = async (
  email: string,
  otp: string,
  password: string
) => {
  return apiRequest<MessageResponse>(
    "/api/auth/password-reset/confirm",
    {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    }
  );
};

// ------------------------------------------
// CURRENT USER
// ------------------------------------------

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = getToken();

  if (!token) return null;

  try {
    const data = await apiRequest<{
      success: boolean;
      user: AuthUser;
    }>("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    saveLastMindEaseId(data.user.id);
    return data.user;
  } catch {
    clearToken();
    return null;
  }
};

// ------------------------------------------
// LOGOUT
// ------------------------------------------

export const logoutUser = () => {
  clearToken();
};

// ------------------------------------------
// AUTHENTICATED API REQUEST HELPER
// ------------------------------------------

export const authenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
