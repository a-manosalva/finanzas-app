import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { LayoutDashboard, Tags, Users, ArrowRightLeft, CreditCard, LogOut } from 'lucide-react';

const AppLayout = () => {
  const { user, loading, logout } = useAuth();
  const { workspaces, workspaceId, selectWorkspace } = useWorkspace();
  const location = useLocation();

  if (loading) {
    return <div className="app-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleWorkspaceChange = (e) => {
    selectWorkspace(e.target.value);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Categorías', path: '/categorias', icon: <Tags size={20} /> },
    { name: 'Beneficiarios', path: '/beneficiarios', icon: <Users size={20} /> },
    { name: 'Cuentas', path: '/cuentas', icon: <CreditCard size={20} /> },
    { name: 'Movimientos', path: '/movimientos', icon: <ArrowRightLeft size={20} /> },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}>
              <rect x="2" y="2" width="28" height="28" rx="8" stroke="var(--accent)" strokeWidth="2.5" fill="rgba(0, 255, 136, 0.05)"/>
              <path d="M10 10H19C21.2091 10 23 11.7909 23 14C23 16.2091 21.2091 18 19 18H10V10Z" fill="var(--accent)"/>
              <path d="M10 18V24" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
              Finanzas<span style={{color: 'var(--accent)'}}>.</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Hola, {user.nombre}</p>
          
          <div className="mt-4">
            <label>Workspace Activo</label>
            <select value={workspaceId || ''} onChange={handleWorkspaceChange}>
              <option value="" disabled>Seleccione...</option>
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        
        <nav style={{ padding: '1.5rem', flex: 1 }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      color: isActive ? '#000000' : 'var(--text-muted)',
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      fontWeight: isActive ? '600' : '500',
                      transition: 'var(--transition)'
                    }}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline w-full" onClick={logout}>
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        {!workspaceId && location.pathname !== '/login' ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', margin: 'auto', maxWidth: '400px' }}>
            <h2>Configurando</h2>
            <p>Preparando su entorno financiero. Un momento por favor...</p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ height: '100%' }}>
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;
