// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/pages/LoginPage.jsx
// Description : Page de connexion avec authentification JWT
// =============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login }        = useAuth();
  const navigate         = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  // Remplissage rapide pour la démo
  const DEMO_USERS = [
    { label: 'Admin',     email: 'admin@souss.ma',    password: 'admin123'    },
    { label: 'Opérateur', email: 'oper@souss.ma',     password: 'oper123'     },
    { label: 'Lecteur',   email: 'lecteur@souss.ma',  password: 'lecteur123'  },
    { label: 'Sécurité',  email: 'securite@souss.ma', password: 'sec123'      },
  ];

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--color-bg)',
      padding:        '24px',
    }}>
      {/* Fond décoratif */}
      <div style={{
        position:   'fixed',
        top:        '-50%',
        left:       '-50%',
        width:      '200%',
        height:     '200%',
        background: 'radial-gradient(ellipse at 30% 30%, rgba(26,127,232,0.08) 0%, transparent 50%)',
        pointerEvents:'none',
      }} />

      <div style={{
        width:        '100%',
        maxWidth:     '420px',
        animation:    'fadeInUp 0.5s ease both',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          '64px',
            height:         '64px',
            borderRadius:   'var(--radius-lg)',
            background:     'var(--color-primary-dim)',
            border:         '1px solid var(--color-primary)',
            marginBottom:   '16px',
            boxShadow:      'var(--shadow-glow)',
          }}>
            <Droplets size={32} color="var(--color-primary)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '6px' }}>
            Oued-Souss<br />
            <span style={{ color: 'var(--color-primary)' }}>Alert</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            Système de surveillance des crues · Souss-Massa
          </p>
        </div>

        {/* Formulaire */}
        <div style={{
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding:      '32px',
          boxShadow:    'var(--shadow-lg)',
        }}>
          {error && (
            <div style={{
              padding:      '10px 14px',
              marginBottom: '20px',
              background:   'rgba(232,48,58,0.1)',
              border:       '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              color:        'var(--color-danger)',
              fontSize:     '0.8rem',
              fontFamily:   'var(--font-mono)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width:        '100%',
                    padding:      '10px 12px 10px 36px',
                    background:   'var(--color-surface-2)',
                    border:       '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color:        'var(--color-text)',
                    fontSize:     '0.875rem',
                    fontFamily:   'var(--font-mono)',
                    transition:   'var(--transition)',
                  }}
                  placeholder="admin@souss.ma"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width:        '100%',
                    padding:      '10px 12px 10px 36px',
                    background:   'var(--color-surface-2)',
                    border:       '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color:        'var(--color-text)',
                    fontSize:     '0.875rem',
                    fontFamily:   'var(--font-mono)',
                    transition:   'var(--transition)',
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              padding:      '12px',
              background:   loading ? 'var(--color-primary-dim)' : 'var(--color-primary)',
              border:       'none',
              borderRadius: 'var(--radius-md)',
              color:        '#fff',
              fontSize:     '0.9rem',
              fontWeight:   600,
              fontFamily:   'var(--font-display)',
              cursor:       loading ? 'not-allowed' : 'pointer',
              marginTop:    '8px',
              transition:   'var(--transition)',
            }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Accès rapide démo */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              Accès rapide (démo)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {DEMO_USERS.map(u => (
                <button
                  key={u.label}
                  type="button"
                  onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  style={{
                    padding:      '6px 10px',
                    background:   'var(--color-surface-2)',
                    border:       '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color:        'var(--color-text-muted)',
                    fontSize:     '0.75rem',
                    fontFamily:   'var(--font-mono)',
                    cursor:       'pointer',
                    transition:   'var(--transition)',
                    textAlign:    'left',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;