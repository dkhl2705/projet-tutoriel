import React, { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'vaccismart_auth';
const Ctx = createContext();

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch (error) {
    return null;
  }
};

const normalizeUser = (user) => ({
  ...user,
  firstName: user.first_name || '',
  lastName: user.last_name || '',
  name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
});

export const AppProvider = ({ children }) => {
  const storedAuth = readStoredAuth();
  const storedUser = storedAuth?.user || null;

  const [isNight, setIsNight] = useState(false);
  const [role, setRole] = useState(storedUser?.role || null);
  const [user, setUser] = useState(storedUser || null);
  const [page, setPage] = useState(
    storedUser ? (storedUser.role === 'medecin' ? 'doctor-upcoming' : 'dashboard') : 'register'
  );
  const [selectedChild, setSelectedChild] = useState(0);
  const [authState, setAuthState] = useState(storedAuth);

  const toggleMode = () =>
    setIsNight((night) => {
      document.body.className = !night ? 'night' : '';
      return !night;
    });

  React.useEffect(() => {
    document.body.className = isNight ? 'night' : '';
  }, [isNight]);

  const loginSuccess = ({ user: rawUser, tokens }) => {
    const normalizedUser = normalizeUser(rawUser);
    const nextState = { user: normalizedUser, tokens };

    setRole(normalizedUser.role);
    setUser(normalizedUser);
    setAuthState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setPage(normalizedUser.role === 'medecin' ? 'doctor-upcoming' : 'dashboard');
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    setAuthState(null);
    setPage('register');
    localStorage.removeItem(STORAGE_KEY);
    document.body.className = '';
    setIsNight(false);
  };

  const value = useMemo(
    () => ({
      isNight,
      toggleMode,
      role,
      user,
      page,
      setPage,
      loginSuccess,
      logout,
      selectedChild,
      setSelectedChild,
      authState,
    }),
    [isNight, role, user, page, selectedChild, authState]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => useContext(Ctx);
