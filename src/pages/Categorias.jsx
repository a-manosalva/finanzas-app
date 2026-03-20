import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { fetchApi } from '../services/api';
import { PlusCircle, Trash2 } from 'lucide-react';

const Categorias = () => {
  const { workspaceId } = useWorkspace();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('INGRESO');
  const [error, setError] = useState('');

  useEffect(() => {
    if (workspaceId) loadCategorias();
  }, [workspaceId]);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/categorias?workspaceId=${workspaceId}`);
      setCategorias(data || []);
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
      await fetchApi('/api/categorias', {
        method: 'POST',
        body: JSON.stringify({ workspaceId, nombre, tipo })
      });
      setNombre('');
      loadCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await fetchApi(`/api/categorias/${id}`, { method: 'DELETE' });
      loadCategorias();
    } catch(err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1>Categorías</h1>
      </div>

      <div className="card mb-4">
        <h3>Nueva Categoría</h3>
        {error && <div className="text-danger mb-2">{error}</div>}
        <form onSubmit={handleCreate} className="flex gap-4 mt-2">
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              placeholder="Nombre de categoría" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div style={{ width: '150px' }}>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="INGRESO">INGRESO</option>
              <option value="GASTO">GASTO</option>
            </select>
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
                <th>Tipo</th>
                <th style={{ width: '100px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign:'center'}}>No hay categorías. Crea una arriba.</td></tr>
              ) : (
                categorias.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.nombre}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: cat.tipo === 'INGRESO' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: cat.tipo === 'INGRESO' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {cat.tipo}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)'}} onClick={() => handleDelete(cat.id)}>
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

export default Categorias;
