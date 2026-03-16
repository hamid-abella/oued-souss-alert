// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/router/AppRouter.jsx
// Description : Routeur principal avec protection des routes
// =============================================================

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth }        from '../context/AuthContext';
import Navbar             from '../components/common/Navbar';
import Sidebar            from '../components/common/Sidebar';
import LoginPage          from '../pages/LoginPage';
import DashboardPage      from '../pages/DashboardPage';
import ZonesPage          from '../pages/ZonesPage';
import AlertesPage        from '../pages/AlertesPage';
import MesuresPage        from '../pages/MesuresPage';
import IndicesPage        from '../pages/IndicesPage';

// Layout principal avec Navbar + Sidebar
const MainLayout = () => (
  <div style={{ minHeight: '100vh' }}>
    <Navbar />
    <Sidebar />
    <main style={{
      marginLeft:  '220px',
      marginTop:   '60px',
      padding:     '32px',
      minHeight:   'calc(100vh - 60px)',
    }}>
      <Outlet />
    </main>
  </div>
);

// Guard : redirige vers /login si non authentifié
const PrivateRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/zones"    element={<ZonesPage />}     />
          <Route path="/alertes"  element={<AlertesPage />}   />
          <Route path="/mesures"  element={<MesuresPage />}   />
          <Route path="/indices"  element={<IndicesPage />}   />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;