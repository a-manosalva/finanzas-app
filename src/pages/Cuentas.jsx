import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { fetchApi } from '../services/api';
import { PlusCircle, Trash2 } from 'lucide-react';

const Cuentas = () => {
  const { workspaceId } = useWorkspace();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('AHORROS');
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workspaceId) loadCuentas();
  }, [workspaceId]);

  const loadCuentas = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/cuentas?workspaceId=${workspaceId}`);
      setCuentas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/api/cuentas', {
        method: 'POST',
        body: JSON.stringify({ 
          workspaceId, 
          nombre, 
          tipo,
          moneda: 'COP', // Default currency
          saldoInicial: parseFloat(saldoInicial)
        })
      });
      setNombre('');
      setSaldoInicial(0);
      loadCuentas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar esta cuenta?')) return;
    try {
      await fetchApi(`/api/cuentas/${id}`, { method: 'DELETE' });
      loadCuentas();
    } catch(err) {
      alert(err.message);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0);

  return (
    <div className="animate-fade-in">
      <h1>Cuentas</h1>

      <div className="card mb-4">
        <h3>Nueva Cuenta (Requerida para transacciones)</h3>
        {error && <div className="text-danger mb-2">{error}</div>}
        <form onSubmit={handleCreate} className="flex gap-4 mt-2" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label>Nombre de cuenta</label>
            <input 
              type="text" 
              placeholder="Ej. Bancolombia" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div style={{ width: '150px' }}>
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="AHORROS">Ahorros</option>
              <option value="CORRIENTE">Corriente</option>
              <option value="EFECTIVO">Efectivo</option>
            </select>
          </div>
          <div style={{ width: '150px' }}>
            <label>Saldo Inicial</label>
            <input 
              type="number" 
              step="0.01"
              value={saldoInicial} 
              onChange={(e) => setSaldoInicial(e.target.value)} 
              required 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary"><PlusCircle size={20}/> Agregar</button>
          </div>
        </form>
      </div>

      <div className="card table-container">
        {loading ? <p>Cargando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Saldo Inicial</th>
                <th style={{ width: '100px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center'}}>No hay cuentas. Crea una arriba.</td></tr>
              ) : (
                cuentas.map(cuenta => (
                  <tr key={cuenta.id}>
                    <td>{cuenta.nombre}</td>
                    <td>{cuenta.tipo}</td>
                    <td>{formatCurrency(cuenta.saldoInicial)}</td>
                    <td>
                      <button className="btn btn-outline" style={{padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)'}} onClick={() => handleDelete(cuenta.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cuentas;
