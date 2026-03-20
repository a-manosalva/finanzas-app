import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { fetchApi } from '../services/api';
import { PlusCircle, Trash2 } from 'lucide-react';

const Movimientos = () => {
  const { workspaceId } = useWorkspace();
  const [movimientos, setMovimientos] = useState([]);
  
  const [categorias, setCategorias] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [tipo, setTipo] = useState('GASTO');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState('');
  const [cuentaId, setCuentaId] = useState('');
  const [medioPago, setMedioPago] = useState('TRANSFERENCIA');

  useEffect(() => {
    if (workspaceId) {
      loadDependencies();
      loadMovimientos();
    }
  }, [workspaceId]);

  const loadDependencies = async () => {
    try {
      const [cats, bens, acts] = await Promise.all([
        fetchApi(`/api/categorias?workspaceId=${workspaceId}`),
        fetchApi(`/api/beneficiarios?workspaceId=${workspaceId}`),
        fetchApi(`/api/cuentas?workspaceId=${workspaceId}`)
      ]);
      setCategorias(cats || []);
      setBeneficiarios(bens || []);
      setCuentas(acts || []);
    } catch (err) {
      console.error('Error load dependencies', err);
    }
  };

  const loadMovimientos = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/transactions?workspaceId=${workspaceId}`);
      setMovimientos(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!categoriaId || !cuentaId) {
       setError("Categoría y Cuenta son obligatorias.");
       return;
    }
    setError('');
    try {
      const payload = {
        workspaceId: parseInt(workspaceId),
        tipo,
        categoriaId: parseInt(categoriaId),
        beneficiarioId: beneficiarioId ? parseInt(beneficiarioId) : null,
        itemPresupuestoId: null,
        fecha,
        monto: parseFloat(monto),
        descripcion,
        medioPago,
        cuentaId: parseInt(cuentaId),
        tarjetaCreditoId: null
      };

      console.log('Enviando movimiento:', payload);

      await fetchApi('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setMonto('');
      setDescripcion('');
      loadMovimientos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar este movimiento?')) return;
    try {
      await fetchApi(`/api/transactions/${id}`, { method: 'DELETE' });
      loadMovimientos();
    } catch(err) {
      alert(err.message);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0);

  // Filter categories by selected tipo
  const filteredCategories = categorias.filter(c => c.tipo === tipo);

  return (
    <div className="animate-fade-in">
      <h1>Movimientos</h1>

      {categorias.length === 0 && (
        <div className="card mb-4" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)' }}>
          <p className="text-danger">Debes crear al menos una categoría antes de registrar movimientos.</p>
        </div>
      )}

      {cuentas.length === 0 && (
        <div className="card mb-4" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)' }}>
          <p className="text-danger">Debes crear al menos una cuenta antes de registrar movimientos.</p>
        </div>
      )}

      <div className="card mb-4">
        <h3>Nuevo Movimiento</h3>
        {error && <div className="text-danger mb-2">{error}</div>}
        <form onSubmit={handleCreate} className="flex gap-4 mt-2" style={{ flexWrap: 'wrap' }}>
          
          <div style={{ width: '150px' }}>
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => { setTipo(e.target.value); setCategoriaId(''); }}>
              <option value="INGRESO">INGRESO</option>
              <option value="GASTO">GASTO</option>
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label>Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required disabled={filteredCategories.length === 0}>
              <option value="">Seleccione...</option>
              {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label>Cuenta</label>
            <select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)} required disabled={cuentas.length === 0}>
              <option value="">Seleccione...</option>
              {cuentas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label>Beneficiario (Opcional)</label>
            <select value={beneficiarioId} onChange={(e) => setBeneficiarioId(e.target.value)}>
              <option value="">Ninguno</option>
              {beneficiarios.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </div>

          <div style={{ width: '150px' }}>
            <label>Monto</label>
            <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} required />
          </div>

          <div style={{ width: '150px' }}>
            <label>Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label>Medio de Pago</label>
            <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="EFECTIVO">EFECTIVO</option>
              <option value="TARJETA_CREDITO">TARJETA CRÉDITO</option>
            </select>
          </div>

          <div style={{ flex: '1 1 100%' }}>
            <label>Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Pago de servicios" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent:'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={categorias.length === 0 || cuentas.length === 0}>
              <PlusCircle size={20}/> Registrar
            </button>
          </div>

        </form>
      </div>

      <div className="card table-container">
        {loading ? <p>Cargando...</p> : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Cuenta</th>
                <th>Monto</th>
                <th style={{ width: '80px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center'}}>No hay movimientos registrados.</td></tr>
              ) : (
                movimientos.map(mov => (
                  <tr key={mov.id}>
                    <td>{mov.fecha}</td>
                    <td>
                      <span style={{ 
                        color: mov.tipo === 'GASTO' ? 'var(--danger)' : 'var(--success)', 
                        fontWeight: 'bold' 
                      }}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td>{mov.categoriaNombre}</td>
                    <td>{mov.descripcion}</td>
                    <td>{mov.fuenteNombre}</td>
                    <td style={{ color: mov.tipo === 'GASTO' ? 'var(--danger)' : 'var(--success)', fontWeight:'bold' }}>
                      {mov.tipo === 'GASTO' ? '-' : '+'}{formatCurrency(mov.monto)}
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)'}} onClick={() => handleDelete(mov.id)}>
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

export default Movimientos;
