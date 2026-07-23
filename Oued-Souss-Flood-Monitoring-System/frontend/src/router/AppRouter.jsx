import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import Navbar                from '../components/common/Navbar';
import Sidebar               from '../components/common/Sidebar';
import LoginPage             from '../pages/LoginPage';
import DashboardPage         from '../pages/DashboardPage';
import ZonesPage             from '../pages/ZonesPage';
import AlertsPage            from '../pages/AlertsPage';
import MeasurementsPage      from '../pages/MeasurementsPage';
import RiskPage              from '../pages/RiskPage';

const MainLayout = () => (
  <div style={{ minHeight: '100vh' }}>
    <Navbar />
    <Sidebar />
    <main style={{ marginLeft: '220px', marginTop: '60px', padding: '32px', minHeight: 'calc(100vh - 60px)' }}>
      <Outlet />
    </main>
  </div>
);

const PrivateRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/"             element={<DashboardPage />}    />
          <Route path="/zones"        element={<ZonesPage />}        />
          <Route path="/alerts"       element={<AlertsPage />}       />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="/risk"         element={<RiskPage />}         />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;