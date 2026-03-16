import { useState, useEffect } from 'react';
import { useZones }    from '../hooks/useZones';
import { useMesures }  from '../hooks/useMesures';
import { capteursApi } from '../api/capteurs.api';
import { useAuth }     from '../context/AuthContext';
import MesureForm      from '../components/mesures/MesureForm';
import MesureChart     from '../components/mesures/MesureChart';
import LoadingSpinner  from '../components/common/LoadingSpinner';

const MesuresPage = () => {
  const { zones }                                    = useZones();
  const { mesuresNiveau, mesuresPluie, loading, fetchNiveau, fetchPluie, insertNiveau, insertPluie } = useMesures();
  const { can }                                      = useAuth();
  const [capteurs,    setCapteurs]                   = useState([]);
  const [selectedZone, setSelectedZone]              = useState(null);

  // Charger les capteurs de toutes les zones
  useEffect(() => {
    const loadCapteurs = async () => {
      try {
        const res = await capteursApi.getAll();
        setCapteurs(res.data);
      } catch {}
    };
    loadCapteurs();
  }, []);

  // Charger mesures quand une zone est sélectionnée
  useEffect(() => {
    if (selectedZone) {
      fetchNiveau(selectedZone);
      fetchPluie(selectedZone);
    }
  }, [selectedZone]);

  const handleInsert = async ({ type, capteur_id, valeur }) => {
    if (type === 'niveau') await insertNiveau(capteur_id, valeur);
    else                   await insertPluie(capteur_id, valeur);
    if (selectedZone) {
      fetchNiveau(selectedZone);
      fetchPluie(selectedZone);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Mesures
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
          Historique et insertion des mesures capteurs
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Graphiques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sélection zone */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {zones.map(z => (
              <button key={z.zone_id} onClick={() => setSelectedZone(z.zone_id)} style={{
                padding:      '6px 14px',
                background:   selectedZone === z.zone_id ? 'var(--color-primary-dim)' : 'var(--color-surface)',
                border:       `1px solid ${selectedZone === z.zone_id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color:        selectedZone === z.zone_id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize:     '0.75rem', fontFamily: 'var(--font-mono)',
                cursor:       'pointer', transition: 'var(--transition)',
              }}>
                {z.nom}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner text="Chargement mesures..." /> : selectedZone ? (
            <div style={{
              background:   'var(--color-surface)',
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding:      '20px',
              display:      'flex',
              flexDirection:'column',
              gap:          '24px',
            }}>
              <MesureChart data={mesuresNiveau} dataKey="niveau_eau" unit="m"  color="var(--color-primary)" title="Niveau d'eau (m)" />
              <MesureChart data={mesuresPluie}  dataKey="pluie_mm"   unit="mm" color="var(--color-info)"    title="Précipitations (mm)" />
            </div>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              Sélectionnez une zone pour afficher ses mesures
            </div>
          )}
        </div>

        {/* Formulaire insertion */}
        {can('create') && (
          <MesureForm capteurs={capteurs} onSubmit={handleInsert} />
        )}
      </div>
    </div>
  );
};

export default MesuresPage;