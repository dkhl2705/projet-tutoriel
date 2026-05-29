const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const parseResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.detail ||
      data?.message ||
      Object.values(data || {}).flat().join(' ') ||
      'Une erreur est survenue.';
    throw new Error(message);
  }
  return data;
};

const authFetch = (url, options = {}, token) =>
  fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }).then(parseResponse);

// ── Auth ──────────────────────────────────────────────────────────
export const registerUser = (payload) =>
  fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(parseResponse);

export const loginUser = (payload) =>
  fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(parseResponse);

// ── Data endpoints ────────────────────────────────────────────────
export const getChildren     = (token) => authFetch(`${API_BASE_URL}/children/`, {}, token);
export const getVaccinations = (token) => authFetch(`${API_BASE_URL}/vaccinations/`, {}, token);
export const getHospitals    = (token) => authFetch(`${API_BASE_URL}/hospitals/`, {}, token);
export const getVaccineCatalog = (token) => authFetch(`${API_BASE_URL}/vaccines/`, {}, token);
export const getReminders    = (token) => authFetch(`${API_BASE_URL}/reminders/`, {}, token);

export const createVaccination = (token, data) =>
  authFetch(`${API_BASE_URL}/vaccinations/`, { method: 'POST', body: JSON.stringify(data) }, token);

export const createAppointment = (token, data) =>
  authFetch(`${API_BASE_URL}/appointments/`, { method: 'POST', body: JSON.stringify(data) }, token);

// ── Normalisation helpers ─────────────────────────────────────────
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
};

export const calcAge = (birthDate) => {
  if (!birthDate) return '';
  const birth = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (totalMonths < 1) return 'Nouveau-né';
  if (totalMonths < 12) return `${totalMonths} mois`;
  const years = Math.floor(totalMonths / 12);
  return `${years} an${years > 1 ? 's' : ''}`;
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return 999;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
};

export const normalizeChild = (child, allVaccinations) => {
  const childVax = allVaccinations.filter((v) => v.child === child.id);
  const done = childVax.filter((v) => v.status === 'done').length;
  const total = childVax.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const upcoming = childVax
    .filter((v) => v.status === 'upcoming')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  const next = upcoming[0];
  const daysLeft = next ? daysUntil(next.scheduled_date) : 999;

  return {
    id: child.id,
    firstName: child.first_name,
    lastName: child.last_name,
    age: calcAge(child.birth_date),
    birthdate: formatDate(child.birth_date),
    bloodType: child.blood_type || 'N/A',
    allergies: child.allergies || 'Aucune',
    gender: child.gender === 'fille' ? 'Fille' : child.gender === 'garcon' ? 'Garçon' : 'Autre',
    progress,
    nextVaccine: next
      ? {
          name: next.vaccine_name || `Vaccin #${next.vaccine}`,
          date: formatDate(next.scheduled_date),
          daysLeft,
          urgent: daysLeft <= 3,
        }
      : null,
    vaccines: childVax
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
      .map((v) => ({
        id: v.id,
        name: v.vaccine_name || `Vaccin #${v.vaccine}`,
        date: formatDate(v.status === 'done' ? v.administered_at || v.scheduled_date : v.scheduled_date),
        scheduledDate: v.scheduled_date,
        status: v.status,
        doctor: v.doctor_name || '',
        hospital: v.hospital_name || '',
        note: v.note || '',
      })),
  };
};

export const buildDoctorPatients = (children, allVaccinations) => {
  const result = [];
  children.forEach((child) => {
    const upcoming = allVaccinations
      .filter((v) => v.child === child.id && v.status === 'upcoming')
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const days = daysUntil(next.scheduled_date);
      result.push({
        id: child.id,
        name: `${child.first_name} ${child.last_name}`.trim(),
        age: calcAge(child.birth_date),
        vaccine: next.vaccine_name || `Vaccin #${next.vaccine}`,
        date: days <= 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `Dans ${days} jours`,
        daysLeft: days,
        parent: child.parent_name || '',
        phone: child.parent_phone || '',
        notified: days <= 1,
      });
    }
  });
  return result.sort((a, b) => a.daysLeft - b.daysLeft);
};
