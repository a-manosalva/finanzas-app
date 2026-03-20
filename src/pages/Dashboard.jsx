import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { fetchApi } from '../services/api';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { workspaceId } = useWorkspace();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadDashboard();
    }
  }, [workspaceId]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const date = new Date();
      // Use current year and month (1-12)
      const data = await fetchApi(`/api/dashboard/resumen-mensual?workspaceId=${workspaceId}&anio=${date.getFullYear()}&mes=${date.getMonth() + 1}`);
      setSummary(data);
    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0);
  };

  if(!workspaceId) return null;

  return (
    <div className="animate-fade-in">
      <h1>Resumen Mensual</h1>
      
      {loading ? (
        <p>Cargando información...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div className="card stat-card" style={{ borderTop: '4px solid var(--success)' }}>
            <div className="flex items-center justify-between">
              <span className="title">Total Ingresos</span>
              <ArrowUpCircle color="var(--success)" size={24} />
            </div>
            <span className="value text-success">{formatCurrency(summary?.totalIngresos)}</span>
          </div>

          <div className="card stat-card" style={{ borderTop: '4px solid var(--danger)' }}>
            <div className="flex items-center justify-between">
              <span className="title">Total Gastos</span>
              <ArrowDownCircle color="var(--danger)" size={24} />
            </div>
            <span className="value text-danger">{formatCurrency(summary?.totalGastos)}</span>
          </div>

          <div className="card stat-card" style={{ borderTop: '4px solid var(--accent)' }}>
            <div className="flex items-center justify-between">
              <span className="title">Balance Neto</span>
              <DollarSign color="var(--accent)" size={24} />
            </div>
            <span className="value">{formatCurrency(summary?.balanceNeto)}</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
