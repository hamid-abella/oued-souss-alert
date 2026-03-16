// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/App.jsx
// Description : Racine de l'application avec providers
// =============================================================

import { AuthProvider }  from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AppRouter         from './router/AppRouter';

const App = () => (
  <AuthProvider>
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  </AuthProvider>
);

export default App;