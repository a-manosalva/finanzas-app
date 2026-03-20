import { createContext, useState, useEffect, useContext } from 'react';
import { fetchApi } from '../services/api';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const [workspaceId, setWorkspaceId] = useState(() => localStorage.getItem('workspaceId'));
  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem('workspaces');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      loadWorkspaces();
    } else {
      setWorkspaces([]);
      setWorkspaceId(null);
    }
  }, [token]);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      // Need a way to fetch my workspaces
      // Using user id if possible, though /api/workspaces requires usuarioId
      // Actually API provides workspaces via login response, let's just expose a way to re-fetch if needed.
      // Wait, API has GET /api/workspaces?usuarioId={uid}. But we don't have user ID in context, only email/nombre.
      // Better strategy: Rely on the workspaces array returned at login if available, otherwise we fallback.
      // For now, let's just allow selecting from the list or we'll fetch them. Unofotunately, `me` endpoint returns "string".
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectWorkspace = async (id) => {
    try {
      await fetchApi(`/api/workspaces/${id}/seleccionar`, { method: 'POST' });
      setWorkspaceId(id);
      localStorage.setItem('workspaceId', id);
    } catch(err) {
      console.error("Failed to select workspace", err);
      throw err;
    }
  };

  return (
    <WorkspaceContext.Provider value={{ workspaceId, workspaces, selectWorkspace, loading, loadWorkspaces, setWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
