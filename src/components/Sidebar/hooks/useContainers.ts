// ==============================================
// ARCHIVO: src/components/Sidebar/hooks/useContainers.ts
// ==============================================
import { useState, useEffect } from 'react';
import { containerService } from '../services/containerService';
import type { ContainerSummary } from '../types/sidebar.types';

export const useContainers = () => {
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await containerService.getContainersSummary();
      setContainers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching containers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return {
    containers,
    loading,
    error,
    refetch: fetchContainers
  };
};
