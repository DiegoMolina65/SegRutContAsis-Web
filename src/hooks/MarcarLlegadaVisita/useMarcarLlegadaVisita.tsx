import { useState, useCallback } from "react";
import type { MarcarLlegadaVisitaResponseDTO } from "../../types/exportTypes";
import { obtenerMarcacionesPorVisita } from "../../api/exportApi";

export const useMarcarLlegadaVisita = () => {
  const [marcaciones, setMarcaciones] = useState<MarcarLlegadaVisitaResponseDTO[]>([]);
  const [marcacion, setMarcacion] = useState<MarcarLlegadaVisitaResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerMarcacionesPorVisitaHook = useCallback(async (visitaId: number) => {
    setLoading(true);
    try {
      const data = await obtenerMarcacionesPorVisita(visitaId);
      setMarcaciones(data); 
      setMarcacion(data[0] ?? null); 
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener marcaciones por visita");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    marcaciones,
    marcacion,
    loading,
    error,
    obtenerMarcacionesPorVisitaHook,
  };
};
