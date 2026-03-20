import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { fetchApi } from '../services/api';
import { PlusCircle, Trash2 } from 'lucide-react';

const Beneficiarios = () => {
  const { workspaceId } = useWorkspace();
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (workspaceId) loadBeneficiarios();
  }, [workspaceId]);

  const loadBeneficiarios = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/beneficiarios?workspaceId=${workspaceId}`);
      setBeneficiarios(data || []);
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
      await fetchApi('/api/beneficiarios', {
        method: 'POST',
        body: JSON.stringify({ workspaceId, nombre })
      });
      setNombre('');
      loadBeneficiarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar este beneficiario?')) return;
    try {
      await fetchApi(`/api/beneficiarios/${id}`, { method: 'DELETE' });
      loadBeneficiarios();
    } catch(err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1>Beneficiarios</h1>

      <div className="card mb-4">
        <h3>Nuevo Beneficiario</h3>
        {error && <div className="text-danger mb-2">{error}</div>}
        <form onSubmit={handleCreate} className="flex gap-4 mt-2">
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              placeholder="Nombre del beneficiario" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary"><PlusCircle size={20}/> Agregar</button>
        </form>
      </div>

      <div className="card table-container">
        {loading ? <p>Cargando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th style={{ width: '100px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {beneficiarios.length === 0 ? (
                <tr><td colSpan="2" style={{textAlign:'center'}}>No hay beneficiarios. Crea uno arriba.</td></tr>
              ) : (
                beneficiarios.map(ben => (
                  <tr key={ben.id}>
                    <td>{ben.nombre}</td>
                    <td>
                      <button className="btn btn-outline" style={{padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)'}} onClick={() => handleDelete(ben.id)}>
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

export default Beneficiarios;
