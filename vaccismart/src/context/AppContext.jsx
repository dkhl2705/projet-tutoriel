import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getChildren,
  getVaccinations,
  getHospitals,
  getReminders,
  normalizeChild,
  buildDoctorPatients,
} from '../services/api';

const STORAGE_KEY = 'vaccismart_auth';
const Ctx = createContext();

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
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

  // ── API data state ──────────────────────────────────────────────
  const [apiChildren, setApiChildren] = useState([]);
  const [apiVaccinations, setApiVaccinations] = useState([]);
  const [apiHospitals, setApiHospitals] = useState([]);
  const [apiReminders, setApiReminders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState(false);

  const toggleMode = () =>
    setIsNight((n) => {
      document.body.className = !n ? 'night' : '';
      return !n;
    });

  useEffect(() => {
    document.body.className = isNight ? 'night' : '';
  }, [isNight]);

  const fetchData = useCallback(async (token) => {
    if (!token) return;
    setDataError(false);
    try {
      const [ch, vax, hosp, rem] = await Promise.all([
        getChildren(token),
        getVaccinations(token),
        getHospitals(token),
        getReminders(token),
      ]);
      setApiChildren(Array.isArray(ch) ? ch : []);
      setApiVaccinations(Array.isArray(vax) ? vax : []);
      setApiHospitals(Array.isArray(hosp) ? hosp : []);
      setApiReminders(Array.isArray(rem) ? rem : []);
    } catch (err) {
      console.warn('fetchData error:', err.message);
      setDataError(true);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Auto-load on mount if already authenticated
  useEffect(() => {
    if (storedAuth?.tokens?.access) {
      fetchData(storedAuth.tokens.access);
    } else {
      setDataLoaded(true);
    }
  }, []); // mount only — storedAuth is read once at init

  // ── Normalized / derived data ───────────────────────────────────
  const appChildren = useMemo(
    () => apiChildren.map((c) => normalizeChild(c, apiVaccinations)),
    [apiChildren, apiVaccinations]
  );

  const hospitals = useMemo(
    () =>
      apiHospitals.map((h) => ({
        id: h.id,
        name: h.name,
        code: h.code,
        distance: h.city,
        open: h.is_active,
        rating: 4.0,
        address: h.address || h.city,
        vaccines: [],
        phone: h.phone || '',
      })),
    [apiHospitals]
  );

  const doctorPatients = useMemo(
    () => buildDoctorPatients(apiChildren, apiVaccinations),
    [apiChildren, apiVaccinations]
  );

  // ── Auth actions ────────────────────────────────────────────────
  const loginSuccess = ({ user: rawUser, tokens }) => {
    const normalizedUser = normalizeUser(rawUser);
    const nextState = { user: normalizedUser, tokens };
    setRole(normalizedUser.role);
    setUser(normalizedUser);
    setAuthState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setPage(normalizedUser.role === 'medecin' ? 'doctor-upcoming' : 'dashboard');
    fetchData(tokens.access);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    setAuthState(null);
    setPage('register');
    setApiChildren([]);
    setApiVaccinations([]);
    setApiHospitals([]);
    setApiReminders([]);
    setDataLoaded(false);
    setDataError(false);
    setSelectedChild(0);
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
      // Data
      appChildren,
      hospitals,
      doctorPatients,
      reminders: apiReminders,
      dataLoaded,
      dataError,
      refetchData: () => authState?.tokens?.access && fetchData(authState.tokens.access),
    }),
    [isNight, role, user, page, selectedChild, authState, appChildren, hospitals, doctorPatients, apiReminders, dataLoaded, dataError]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => useContext(Ctx);
