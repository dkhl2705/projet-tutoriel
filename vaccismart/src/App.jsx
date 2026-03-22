import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Stars from './components/Stars';
import Sidebar from './components/Sidebar';
import RegisterPage from './pages/RegisterPage';
import LoginPage    from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import {
  VaccinsPage, CalendarPage, ChatPage,
  NotificationsPage, HospitalsPage, ProfilePage,
  DoctorUpcomingPage, DoctorRemindersPage,
} from './pages/AllPages';

const AppInner = () => {
  const { page } = useApp();
  if (page === 'register') return <RegisterPage />;
  if (page === 'login')    return <LoginPage />;
  const renderPage = () => {
    switch(page){
      case 'dashboard':        return <DashboardPage />;
      case 'vaccins':          return <VaccinsPage />;
      case 'calendar':         return <CalendarPage />;
      case 'chat':             return <ChatPage />;
      case 'notifications':    return <NotificationsPage />;
      case 'hospitals':        return <HospitalsPage />;
      case 'profile':          return <ProfilePage />;
      case 'doctor-upcoming':  return <DoctorUpcomingPage />;
      case 'doctor-reminders': return <DoctorRemindersPage />;
      default:                 return <DashboardPage />;
    }
  };
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', position:'relative' }}>
      <Stars />
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', zIndex:1 }}>
        {renderPage()}
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider><AppInner /></AppProvider>
);
export default App;
