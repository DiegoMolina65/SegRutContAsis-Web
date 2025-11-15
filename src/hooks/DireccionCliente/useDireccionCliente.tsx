import { useState, useEffect, useCallback } from "react";
import type { DireccionClienteRequestDTO, DireccionClienteResponseDTO } from "../../types/exportTypes";
import { 
  crearDireccion, 
  actualizarDireccion, 
  desactivarDireccion, 
  obtenerDireccionPorId, 
  obtenerDireccionesPorCliente, 
  obtenerTodasDirecciones 
} from "../../api/exportApi";

export const useDireccionCliente = () => {
  const [direcciones, setDirecciones] = useState<DireccionClienteResponseDTO[]>([]);
  const [direccion, setDireccion] = useState<DireccionClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Obtener todas las direcciones */
  const obtenerTodasDireccionesHook = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerTodasDirecciones();
      setDirecciones(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener direcciones");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Obtener dirección por ID */
  const obtenerDireccionPorIdHook = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await obtenerDireccionPorId(id);
      setDireccion(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener la dirección");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Obtener direcciones por cliente */
  const obtenerDireccionesPorClienteHook = useCallback(async (clId: number) => {
    setLoading(true);
    try {
      const data = await obtenerDireccionesPorCliente(clId);
      setDirecciones(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener direcciones del cliente");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Crear una nueva dirección */
  const crearNuevaDireccion = useCallback(async (dto: DireccionClienteRequestDTO) => {
    setLoading(true);
    try {
      const data = await crearDireccion(dto);
      setDirecciones((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear la dirección");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Actualizar una dirección existente */
  const actualizarDireccionExistente = useCallback(async (id: number, dto: DireccionClienteRequestDTO) => {
    setLoading(true);
    try {
      const data = await actualizarDireccion(id, dto);
      setDirecciones((prev) =>
        prev.map((d) => (d.dirClId === id ? data : d))
      );
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar la dirección");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Desactivar una dirección */
  const desactivarDireccionPorId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await desactivarDireccion(id);
      setDirecciones((prev) => prev.filter((d) => d.dirClId !== id));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al desactivar la dirección");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Cargar todas las direcciones al montar */
  useEffect(() => {
    obtenerTodasDireccionesHook();
  }, [obtenerTodasDireccionesHook]);

  return {
    direcciones,
    direccion,
    loading,
    error,
    obtenerTodasDireccionesHook,
    obtenerDireccionPorIdHook,
    obtenerDireccionesPorClienteHook,
    crearNuevaDireccion,
    actualizarDireccionExistente,
    desactivarDireccionPorId,
  };
};
