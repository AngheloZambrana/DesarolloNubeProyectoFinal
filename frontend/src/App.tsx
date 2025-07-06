// App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminHomePage } from './pages/Singer/AdminHomePage';
import { GenerosPage } from './pages/Singer/GenerosPage';
import { UserHomePage } from './pages/User/UserHomePage';
import { GeneroDetallePage } from './pages/User/GeneroDetallePage';
import { SingerDetallePage } from './pages/User/SingerDetallePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { analytics } from './firebase/firebaseInit';

function App() {
  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'App', 
      firebase_screen_class: 'App'
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/AdminHome" element={
          <ProtectedRoute allowedRoles={['singer']}>
            <AdminHomePage />
          </ProtectedRoute>
        } />
        <Route path="/ManageGenre" element={
          <ProtectedRoute allowedRoles={['singer']}>
            <GenerosPage />
          </ProtectedRoute>
        } />

        <Route path="/UserHome" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserHomePage />
          </ProtectedRoute>
        } />
        <Route path="/genero/:generoId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <GeneroDetallePage />
          </ProtectedRoute>
        } />
        <Route path="/artista/:artistaId/canciones" element={
          <ProtectedRoute allowedRoles={['user']}>
            <SingerDetallePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;