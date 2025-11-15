import { useState, useEffect, useCallback } from "react";
import type { RutaRequestDTO, RutaResponseDTO } from "../../types/exportTypes";
import { 
  crearRuta,
  actualizarRuta,
  obtenerRutas,
  obtenerRutaPorId,
  desactivarRuta,
  obtenerRutasPorVendedor,
  obtenerRutasPorSupervisor
} from "../../api/exportApi";

export const useRuta = () => {
  const [rutas, setRutas] = useState<RutaResponseDTO[]>([]);
  const [ruta, setRuta] = useState<RutaResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerRutasHook = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerRutas();
      setRutas(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener rutas");
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRutaPorIdHook = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await obtenerRutaPorId(id);
      setRuta(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener ruta");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRutasPorVendedorHook = useCallback(async (venId: number) => {
    setLoading(true);
    try {
      const data = await obtenerRutasPorVendedor(venId);
      setRutas(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener rutas por vendedor");
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRutasPorSupervisorHook = useCallback(async (supId: number) => {
    setLoading(true);
    try {
      const data = await obtenerRutasPorSupervisor(supId);
      setRutas(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener rutas por supervisor");
    } finally {
      setLoading(false);
    }
  }, []);

  const crearNuevaRuta = useCallback(async (dto: RutaRequestDTO) => {
    setLoading(true);
    try {
      const data = await crearRuta(dto);
      setRutas((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear ruta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarRutaExistente = useCallback(async (id: number, dto: RutaRequestDTO) => {
    setLoading(true);
    try {
      const data = await actualizarRuta(id, dto);
      setRutas((prev) => prev.map((r) => (r.rutId === id ? data : r)));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar ruta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const desactivarRutaExistente = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await desactivarRuta(id);
      setRutas((prev) => prev.filter((r) => r.rutId !== id));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al desactivar ruta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerRutasHook();
  }, [obtenerRutasHook]);

  return {
    rutas,
    ruta,
    loading,
    error,
    obtenerRutasHook,
    obtenerRutaPorIdHook,
    obtenerRutasPorVendedorHook,
    obtenerRutasPorSupervisorHook,
    crearNuevaRuta,
    actualizarRutaExistente,
    desactivarRutaExistente
  };
};
