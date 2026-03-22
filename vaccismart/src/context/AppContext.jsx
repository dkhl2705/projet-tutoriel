import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext();

export const AppProvider = ({ children }) => {
  const [isNight, setIsNight]           = useState(false); // day mode by default
  const [role,    setRole]              = useState(null);    // 'parent' | 'medecin'
  const [user,    setUser]              = useState(null);
  const [page,    setPage]              = useState('register'); // register|login|dashboard|vaccins|calendar|chat|notifications|hospitals|profile|doctor-upcoming|doctor-reminders
  const [selectedChild, setSelectedChild] = useState(0);

  const toggleMode = () => setIsNight(n => {
    document.body.className = !n ? 'night' : '';
    return !n;
  });

  // set night on mount
  React.useEffect(() => { document.body.className = isNight ? 'night' : ''; }, []);

  const login = (roleVal, firstName, lastName, email) => {
    setRole(roleVal);
    setUser({ firstName, lastName, email, name: `${firstName} ${lastName}` });
    setPage(roleVal === 'parent' ? 'dashboard' : 'doctor-upcoming');
  };

  const logout = () => {
    setRole(null); setUser(null);
    setPage('register');
    document.body.className = '';
    setIsNight(false);
  };

  return (
    <Ctx.Provider value={{ isNight, toggleMode, role, user, page, setPage, login, logout, selectedChild, setSelectedChild }}>
      {children}
    </Ctx.Provider>
  );
};

export const useApp = () => useContext(Ctx);
