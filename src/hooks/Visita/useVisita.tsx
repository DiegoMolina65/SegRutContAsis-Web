import { useState, useCallback } from "react";
import type { VisitaRequestDTO, VisitaResponseDTO } from "../../types/exportTypes";
import { 
  crearVisita,
  obtenerTodasVisitas,
  obtenerVisitaId,
  actualizarVisita,
  deshabilitarVisita,
  obtenerVisitasPorRuta,
  obtenerVisitasPorDireccionCliente,
  obtenerVisitasPorVendedor,
  obtenerVisitasPorSemana
} from "../../api/exportApi";

export const useVisita = () => {
  const [visitas, setVisitas] = useState<VisitaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerTodasVisitasHook = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerTodasVisitas();
      setVisitas(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener visitas");
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerVisitaIdHook = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await obtenerVisitaId(id);
      setVisitas([data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener la visita");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const crearNuevaVisita = useCallback(async (dto: VisitaRequestDTO) => {
    setLoading(true);
    try {
      const data = await crearVisita(dto);
      setVisitas(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear la visita");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarVisitaId = useCallback(async (id: number, dto: VisitaRequestDTO) => {
    setLoading(true);
    try {
      const data = await actualizarVisita(id, dto);
      setVisitas(prev => prev.map(v => v.visId === id ? data : v));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar la visita");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deshabilitarVisitaId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await deshabilitarVisita(id);
      setVisitas(prev => prev.filter(v => v.visId !== id));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al deshabilitar la visita");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarVisitasPorRuta = useCallback(async (rutaId: number) => {
    setLoading(true);
    try {
      const data = await obtenerVisitasPorRuta(rutaId);
      setVisitas(data);
    } catch (err: any) {
      setError(err.message || "Error al filtrar visitas por ruta");
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarVisitasPorCliente = useCallback(async (clienteId: number) => {
    setLoading(true);
    try {
      const data = await obtenerVisitasPorDireccionCliente(clienteId);
      setVisitas(data);
    } catch (err: any) {
      setError(err.message || "Error al filtrar visitas por cliente");
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarVisitasPorVendedor = useCallback(async (venId: number) => {
    setLoading(true);
    try {
      const data = await obtenerVisitasPorVendedor(venId);
      setVisitas(data);
    } catch (err: any) {
      setError(err.message || "Error al filtrar visitas por vendedor");
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarVisitasPorSemana = useCallback(async (venId: number, semana: number) => {
    setLoading(true);
    try {
      const data = await obtenerVisitasPorSemana(venId, semana);
      setVisitas(data);
    } catch (err: any) {
      setError(err.message || "Error al filtrar visitas por semana");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    visitas,
    loading,
    error,
    obtenerTodasVisitasHook,
    obtenerVisitaIdHook,
    crearNuevaVisita,
    actualizarVisitaId,
    deshabilitarVisitaId,
    filtrarVisitasPorRuta,
    filtrarVisitasPorCliente,
    filtrarVisitasPorVendedor,
    filtrarVisitasPorSemana,
  };
};
