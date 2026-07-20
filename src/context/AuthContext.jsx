import { createContext, useCallback, useState } from "react";

export const AuthContext = createContext(null);

function syncLocalStorage(key, value) {
  if (value == null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

export function AuthProvider({ children }) {
  const [userId, setUserIdState] = useState(() => localStorage.getItem("userId"));
  const [userRole, setUserRoleState] = useState(() => localStorage.getItem("userRole"));
  const [profileFileId, setProfileFileIdState] = useState(() =>
    localStorage.getItem("profileFileId"),
  );

  const setUserId = useCallback((value) => {
    setUserIdState(value);
    syncLocalStorage("userId", value);
  }, []);

  const setUserRole = useCallback((value) => {
    setUserRoleState(value);
    syncLocalStorage("userRole", value);
  }, []);

  const setProfileFileId = useCallback((value) => {
    setProfileFileIdState(value);
    syncLocalStorage("profileFileId", value);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.clear();
    setUserIdState(null);
    setUserRoleState(null);
    setProfileFileIdState(null);
  }, []);

  const value = {
    userId,
    userRole,
    profileFileId,
    setUserId,
    setUserRole,
    setProfileFileId,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
