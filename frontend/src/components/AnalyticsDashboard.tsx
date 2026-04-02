import { useState } from 'react';
import { Lock, LogOut, Database, ArrowLeft } from 'lucide-react';

interface LogEntry {
  id: number;
  query: string;
  style: string;
  cringe_level: number;
  post_length: string;
  timestamp: string;
}

const AnalyticsDashboard = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const basicAuth = btoa(`${email}:${password}`);
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setLoggedIn(true);
      } else if (response.status === 401) {
        setError('Incorrect email or password');
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError('Server error or backend is not running');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
    setLogs([]);
  };

  return (
    <>
      <div className="bg-noise" />
      <div className="app-wrapper">
        <header className="app-header" style={{ marginBottom: '1.5rem' }}>
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #f0883e 0%, #da3633 100%)' }}>
            <Database size={28} color="#fff" />
          </div>
          <h1>Analytics Dashboard</h1>
          <p>Monitor your viral cringe generations.</p>
        </header>
        
        <button 
          onClick={onBack} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Generator
        </button>

        {!loggedIn ? (
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(240, 136, 62, 0.08)', color: 'var(--accent-orange)' }}>
                <Lock size={18} />
              </div>
              <div>
                <h2>Secure Access</h2>
                <span className="section-subtitle">Admin credentials required</span>
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field-group">
                <span className="field-label">Email</span>
                <input 
                  type="email" 
                  className="text-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="field-group">
                <span className="field-label">Password</span>
                <input 
                  type="password" 
                  className="text-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }}>{error}</div>}

              <button 
                type="submit" 
                className="generate-btn" 
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #f0883e 0%, #da3633 100%)', marginTop: '0.5rem' }}
              >
                {loading ? <div className="loader-dots"><span/><span/><span/></div> : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-card" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="section-icon" style={{ background: 'rgba(63, 185, 80, 0.08)', color: 'var(--accent-green)' }}>
                  <Database size={18} />
                </div>
                <div>
                  <h2>Generation Logs</h2>
                  <span className="section-subtitle">Found {logs.length} total events tracked</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="copy-btn" 
                style={{ position: 'relative', top: 'auto', right: 'auto' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead style={{ background: 'var(--bg-input)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>ID</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>Query</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>Style</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>Cringe</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>Length</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>#{log.id}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.query}</td>
                      <td style={{ padding: '12px 16px' }}><span className="slider-badge length">{log.style}</span></td>
                      <td style={{ padding: '12px 16px' }}><span className="slider-badge cringe">{log.cringe_level}/10</span></td>
                      <td style={{ padding: '12px 16px' }}>{log.post_length}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No tracking data found yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsDashboard;
