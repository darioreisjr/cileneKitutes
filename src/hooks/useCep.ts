import { useState } from 'react';
import { CepService, CepData } from '@/api/services';

interface UseCepReturn {
  data: CepData | null;
  loading: boolean;
  error: string | null;
  fetchCep: (cep: string) => Promise<void>;
  clearData: () => void;
}

/**
 * Hook para consulta de CEP
 */
export const useCep = (): UseCepReturn => {
  const [data, setData] = useState<CepData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCep = async (cep: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await CepService.fetchAddress(cep);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar CEP');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    fetchCep,
    clearData,
  };
};
