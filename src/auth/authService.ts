const USERS_KEY = "mindease_users";
const SESSION_KEY = "mindease_session";

interface StoredUser {
  id: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  createdAt: string;
}

/* ------------------------------------------------ */
/* Utility: Convert ArrayBuffer to Base64           */
/* ------------------------------------------------ */

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

/* ------------------------------------------------ */
/* Utility: Convert Base64 to ArrayBuffer           */
/* ------------------------------------------------ */

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

/* ------------------------------------------------ */
/* Generate password hash                           */
/* ------------------------------------------------ */

const hashPassword = async (
  password: string,
  salt: ArrayBuffer
): Promise<string> => {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 150000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return bufferToBase64(derivedBits);
};

/* ------------------------------------------------ */
/* Get all locally stored users                     */
/* ------------------------------------------------ */

const getUsers = (): StoredUser[] => {
  const data = localStorage.getItem(USERS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/* ------------------------------------------------ */
/* Save users                                       */
/* ------------------------------------------------ */

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
};

/* ------------------------------------------------ */
/* Generate anonymous MindEase ID                  */
/* ------------------------------------------------ */

const generateMindEaseId = (): string => {
  const uuid = crypto.randomUUID();

  const shortId = uuid
    .replace(/-/g, "")
    .substring(0, 8)
    .toUpperCase();

  return `ME-${shortId}`;
};

/* ------------------------------------------------ */
/* SIGN UP                                          */
/* ------------------------------------------------ */

export const registerUser = async (
  password: string
): Promise<AuthUser> => {

  if (!password || password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    );
  }

  const users = getUsers();

  let id = generateMindEaseId();

  // Prevent an extremely unlikely ID collision
  while (users.some((user) => user.id === id)) {
    id = generateMindEaseId();
  }

  /*
   * Create a 16-byte random salt.
   *
   * We explicitly use an ArrayBuffer so that
   * TypeScript's Web Crypto types are satisfied.
   */
  const saltBuffer = new ArrayBuffer(16);

  const salt = new Uint8Array(saltBuffer);

  crypto.getRandomValues(salt);

  const passwordHash = await hashPassword(
    password,
    saltBuffer
  );

  const newUser: StoredUser = {
    id,
    passwordHash,
    salt: bufferToBase64(saltBuffer),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  saveUsers(users);

  // Automatically log the user in
  sessionStorage.setItem(
    SESSION_KEY,
    id
  );

  return {
    id,
    createdAt: newUser.createdAt,
  };
};

/* ------------------------------------------------ */
/* LOGIN                                            */
/* ------------------------------------------------ */

export const loginUser = async (
  id: string,
  password: string
): Promise<AuthUser> => {

  const cleanId = id
    .trim()
    .toUpperCase();

  const users = getUsers();

  const user = users.find(
    (storedUser) =>
      storedUser.id === cleanId
  );

  if (!user) {
    throw new Error(
      "Invalid MindEase ID or password."
    );
  }

  const saltBuffer =
    base64ToArrayBuffer(user.salt);

  const passwordHash =
    await hashPassword(
      password,
      saltBuffer
    );

  if (
    passwordHash !==
    user.passwordHash
  ) {
    throw new Error(
      "Invalid MindEase ID or password."
    );
  }

  // Create login session
  sessionStorage.setItem(
    SESSION_KEY,
    user.id
  );

  return {
    id: user.id,
    createdAt: user.createdAt,
  };
};

/* ------------------------------------------------ */
/* GET CURRENT USER                                 */
/* ------------------------------------------------ */

export const getCurrentUser =
  (): AuthUser | null => {

    const sessionId =
      sessionStorage.getItem(
        SESSION_KEY
      );

    if (!sessionId) {
      return null;
    }

    const users = getUsers();

    const user = users.find(
      (storedUser) =>
        storedUser.id === sessionId
    );

    if (!user) {
      sessionStorage.removeItem(
        SESSION_KEY
      );

      return null;
    }

    return {
      id: user.id,
      createdAt: user.createdAt,
    };
  };

/* ------------------------------------------------ */
/* LOGOUT                                           */
/* ------------------------------------------------ */

export const logoutUser = () => {
  sessionStorage.removeItem(
    SESSION_KEY
  );
};