import { useState, useEffect } from "react";
import type { EvidenciaRequestDTO, EvidenciaResponseDTO } from "../../types/exportTypes";
import { 
  crearEvidencia,
  actualizarEvidencia,
  obtenerEvidencias,
  obtenerEvidenciaPorId,
  obtenerEvidenciaPorVisita,
  obtenerEvidenciaPorVendedor,
  obtenerEvidenciaPorTipo
} from "../../api/exportApi";

export const useEvidencia = () => {
  const [evidencias, setEvidencias] = useState<EvidenciaResponseDTO[]>([]);
  const [evidencia, setEvidencia] = useState<EvidenciaResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerEvidenciasHook();
  }, []);

  const obtenerEvidenciasHook = async () => {
    setLoading(true);
    try {
      const data = await obtenerEvidencias();
      setEvidencias(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener evidencias");
    } finally {
      setLoading(false);
    }
  };

  const obtenerEvidenciaPorIdHook = async (id: number) => {
    setLoading(true);
    try {
      const data = await obtenerEvidenciaPorId(id);
      setEvidencia(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener evidencia");
    } finally {
      setLoading(false);
    }
  };

  const obtenerEvidenciasPorVisitaHook = async (visitaId: number) => {
    setLoading(true);
    try {
      const data = await obtenerEvidenciaPorVisita(visitaId);
      setEvidencias(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener evidencias por visita");
    } finally {
      setLoading(false);
    }
  };

  const obtenerEvidenciasPorVendedorHook = async (venId: number) => {
    setLoading(true);
    try {
      const data = await obtenerEvidenciaPorVendedor(venId);
      setEvidencias(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener evidencias por vendedor");
    } finally {
      setLoading(false);
    }
  };

  const obtenerEvidenciasPorTipoHook = async (tipo: string) => {
    setLoading(true);
    try {
      const data = await obtenerEvidenciaPorTipo(tipo);
      setEvidencias(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener evidencias por tipo");
    } finally {
      setLoading(false);
    }
  };

  const crearNuevaEvidencia = async (dto: EvidenciaRequestDTO) => {
    setLoading(true);
    try {
      const data = await crearEvidencia(dto);
      setEvidencias((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear evidencia");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarEvidenciaExistente = async (id: number, dto: EvidenciaRequestDTO) => {
    setLoading(true);
    try {
      const data = await actualizarEvidencia(id, dto);
      setEvidencias((prev) =>
        prev.map((e) => (e.eviId === id ? data : e))
      );
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar evidencia");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    evidencias,
    evidencia,
    loading,
    error,
    obtenerEvidenciasHook,
    obtenerEvidenciaPorIdHook,
    obtenerEvidenciasPorVisitaHook,
    obtenerEvidenciasPorVendedorHook,
    obtenerEvidenciasPorTipoHook,
    crearNuevaEvidencia,
    actualizarEvidenciaExistente
  };
};
