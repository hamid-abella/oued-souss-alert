import { useState } from 'react';
import { Droplets, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)', color: 'var(--color-text)',
    fontSize: '0.9rem', fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Droplets size={32} color="var(--color-primary)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em' }}>
              Oued<span style={{ color: 'var(--color-primary)' }}>-Souss</span>
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            Flood Monitoring System — Souss-Massa Region
          </div>
        </div>

        {/* Login card */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '20px' }}>Sign in</h2>

          {error && (
            <div style={{ padding: '10px 14px', marginBottom: '16px', background: 'rgba(232,48,58,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@souss.ma"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  style={{ ...inputStyle, paddingRight: '42px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem', marginTop: '4px' }}>
              <LogIn size={16} /> {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
          ENSIASD Taroudant — SIBD Project 2025-2026
        </div>
      </div>
    </div>
  );
};

export default LoginPage;