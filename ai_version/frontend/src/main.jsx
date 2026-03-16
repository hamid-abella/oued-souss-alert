// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/main.jsx
// Description : Point d'entrée React
// =============================================================

import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);