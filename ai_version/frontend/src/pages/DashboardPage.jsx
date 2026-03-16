// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/pages/DashboardPage.jsx
// Description : Dashboard principal avec stats, carte et alertes
// =============================================================

import { useState, useEffect } from 'react';
import { MapPin, Bell, Activity, Wifi, AlertTriangle } from 'lucide-react';
import { dashboardApi } from '../api/dashboard.api';
import { indicesApi }   from '../api/indices.api';
import StatsCard   from '../components/dashboard/StatsCard';
import RiskMap     from '../components/dashboard/RiskMap';
import AlertsFeed  from '../components/dashboard/AlertsFeed';
import RiskChart   from '../components/dashboard/RiskChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SECTION_TITLE = {
  fontFamily:    'var(--font-display)',
  fontWeight:    700,
  fontSize:      '1rem',
  marginBottom:  '16px',
  display:       'flex',
  alignItems:    'center',
  gap:           '8px',
};

const DashboardPage = () => {
  const [overview, setOverview] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [indices,  setIndices]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, st] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getStats(),
        ]);
        setOverview(ov.data);
        setStats(st.data);
        // Charger indices de la zone 1 pour le graphique
        if (ov.data.length > 0) {
          const ind = await indicesApi.getByZone(ov.data[0].zone_id, 20);
          setIndices(ind.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner text="Chargement du dashboard..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* En-tête page */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
          Surveillance temps réel · Oued Souss · Souss-Massa
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <StatsCard title="Zones surveillées" value={stats.total_zones}    icon={MapPin}       color="var(--color-primary)"  subtitle="zones actives" />
          <StatsCard title="Capteurs actifs"   value={stats.capteurs_actifs} icon={Wifi}         color="var(--color-faible)"   subtitle={`${stats.capteurs_hs} hors service`} />
          <StatsCard title="Alertes actives"   value={stats.alertes_actives} icon={Bell}         color="var(--color-critique)" subtitle="nécessitent attention" />
          <StatsCard title="Crues détectées"   value={stats.crues_actives}   icon={AlertTriangle} color="var(--color-eleve)"   subtitle="alertes crue en cours" />
        </div>
      )}

      {/* Carte + Alertes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        {/* Carte interactive */}
        <div>
          <div style={SECTION_TITLE}>
            <MapPin size={16} color="var(--color-primary)" />
            Carte des Zones · Souss-Massa
          </div>
          <RiskMap zones={overview} />
        </div>

        {/* Flux alertes */}
        <div>
          <div style={SECTION_TITLE}>
            <Bell size={16} color="var(--color-critique)" />
            Alertes Actives
          </div>
          <div style={{
            background:   'var(--color-surface)',
            border:       '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding:      '16px',
          }}>
            <AlertsFeed />
          </div>
        </div>
      </div>

      {/* Graphique évolution risque */}
      {indices.length > 0 && (
        <div>
          <div style={SECTION_TITLE}>
            <Activity size={16} color="var(--color-primary)" />
            Évolution de l'Indice de Risque — {overview[0]?.nom}
          </div>
          <div style={{
            background:   'var(--color-surface)',
            border:       '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding:      '20px',
          }}>
            <RiskChart data={indices} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;