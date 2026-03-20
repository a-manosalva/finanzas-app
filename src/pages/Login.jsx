import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { setWorkspaces, selectWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        // AuthResponse has workspaces array
        if (res.workspaces) {
          setWorkspaces(res.workspaces);
          if (res.workspaces.length > 0 && !localStorage.getItem('workspaceId')) {
            await selectWorkspace(res.workspaces[0].id);
          }
        }
      } else {
        const res = await register(nombre, email, password);
        if (res.workspaces && res.workspaces.length > 0) {
          setWorkspaces(res.workspaces);
          // Auto select if not present
          if (!localStorage.getItem('workspaceId')) {
            await selectWorkspace(res.workspaces[0].id);
          }
        } else {
          setWorkspaces([]);
        }
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        {error && (
          <div className="mb-4" style={{ padding: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label>Nombre Completo</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                placeholder="Ej. Juan Pérez"
              />
            </div>
          )}
          
          <div>
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
