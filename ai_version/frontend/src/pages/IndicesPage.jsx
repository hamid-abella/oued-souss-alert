import { useState } from 'react';
import { BarChart2, Play } from 'lucide-react';
import { useZones }   from '../hooks/useZones';
import { useIndices } from '../hooks/useIndices';
import { useAuth }    from '../context/AuthContext';
import RiskChart      from '../components/dashboard/RiskChart';
import RiskIndicator  from '../components/common/RiskIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatValue } from '../utils/formatters';

const IndicesPage = () => {
  const { zones }                        = useZones();
  const { indices, loading, fetchIndices, calculate } = useIndices();
  const { can }                          = useAuth();
  const [selectedZone, setSelectedZone]  = useState(null);
  const [calculating,  setCalculating]   = useState(false);
  const [calcResult,   setCalcResult]    = useState(null);

  const handleSelectZone = (zoneId) => {
    setSelectedZone(zoneId);
    fetchIndices(zoneId);
    setCalcResult(null);
  };

  const handleCalculate = async () => {
    if (!selectedZone) return;
    try {
      setCalculating(true);
      const result = await calculate(selectedZone);
      setCalcResult(result);
      fetchIndices(selectedZone);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Indices de Risque
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            Calcul et historique des indices de crue
          </p>
        </div>

        {can('create') && selectedZone && (
          <button onClick={handleCalculate} disabled={calculating} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: calculating ? 'var(--color-primary-dim)' : 'var(--color-primary)',
            border: 'none', borderRadius: 'var(--radius-md)',
            color: '#fff', fontSize: '0.875rem', fontWeight: 600,
            cursor: calculating ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-display)',
          }}>
            <Play size={14} />
            {calculating ? 'Calcul en cours...' : 'Calculer l\'indice'}
          </button>
        )}
      </div>

      {/* Résultat calcul */}
      {calcResult && (
        <div style={{
          padding:      '16px 20px',
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          display:      'flex',
          alignItems:   'center',
          gap:          '16px',
          animation:    'fadeInUp 0.3s ease both',
        }}>
          <BarChart2 size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              NOUVEAU CALCUL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 600 }}>
                {formatValue(calcResult.valeur_indice, '', 3)}
              </span>
              <RiskIndicator niveau={calcResult.niveau_risque} size="sm" showPulse />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {formatDate(calcResult.date_calcul)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sélection zone */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {zones.map(z => (
          <button key={z.zone_id} onClick={() => handleSelectZone(z.zone_id)} style={{
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

      {/* Graphique + tableau */}
      {selectedZone && (
        loading ? <LoadingSpinner text="Chargement indices..." /> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Graphique */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Évolution de l'indice
              </div>
              <RiskChart data={indices} />
            </div>

            {/* Tableau historique */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                Historique des calculs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                {indices.map((ind) => (
                  <div key={ind.indice_id} style={{
                    display:      'flex',
                    justifyContent:'space-between',
                    alignItems:   'center',
                    padding:      '8px 12px',
                    background:   'var(--color-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize:     '0.75rem',
                    fontFamily:   'var(--font-mono)',
                  }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(ind.date_calcul)}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {formatValue(ind.valeur_indice, '', 3)}
                    </span>
                    <RiskIndicator niveau={ind.niveau_risque} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default IndicesPage;