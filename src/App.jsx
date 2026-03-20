import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Beneficiarios from './pages/Beneficiarios';
import Cuentas from './pages/Cuentas';
import Movimientos from './pages/Movimientos';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/beneficiarios" element={<Beneficiarios />} />
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/cuentas" element={<Cuentas />} />
            </Route>
          </Routes>
        </WorkspaceProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
