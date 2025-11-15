import { useState, useEffect, useCallback } from "react";
import type {
  AsignacionClienteVendedorResponseDTO,
  AsignacionClienteVendedorRequestDTO,
} from "../../types/exportTypes";
import {
  obtenerTodasAsignaciones,
  crearAsignacion,
  actualizarAsignacion,
  desactivarAsignacion,
  obtenerAsignacionPorId,
} from "../../api/exportApi";

export const useAsignacionClienteVendedor = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionClienteVendedorResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las asignaciones
  const obtenerTodasAsignacionesHook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodasAsignaciones();
      setAsignaciones(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener asignaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva asignación
  const crearAsignacionHook = useCallback(
    async (dto: AsignacionClienteVendedorRequestDTO) => {
      setLoading(true);
      setError(null);
      try {
        const nueva = await crearAsignacion(dto);
        setAsignaciones((prev) => [...prev, nueva]);
        return nueva;
      } catch (err: any) {
        setError(err.message || "Error al crear asignación");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Actualizar asignación existente
  const actualizarAsignacionHook = useCallback(
    async (id: number, dto: AsignacionClienteVendedorRequestDTO) => {
      setLoading(true);
      setError(null);
      try {
        const actualizada = await actualizarAsignacion(id, dto);
        setAsignaciones((prev) =>
          prev.map((a) => (a.asgId === id ? actualizada : a))
        );
        return actualizada;
      } catch (err: any) {
        setError(err.message || "Error al actualizar asignación");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Desactivar asignación
  const desactivarAsignacionHook = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await desactivarAsignacion(id);
        setAsignaciones((prev) => prev.filter((a) => a.asgId !== id));
      } catch (err: any) {
        setError(err.message || "Error al desactivar asignación");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Obtener asignación por ID
  const obtenerAsignacionPorIdHook = useCallback(
    async (id: number): Promise<AsignacionClienteVendedorResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerAsignacionPorId(id);
        return data;
      } catch (err: any) {
        setError(err.message || "Error al obtener asignación por ID");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  useEffect(() => {
    obtenerTodasAsignacionesHook();
  }, [obtenerTodasAsignacionesHook]);

  return {
    asignaciones,
    loading,
    error,
    obtenerTodasAsignacionesHook,
    crearAsignacionHook,
    actualizarAsignacionHook,
    desactivarAsignacionHook,
    obtenerAsignacionPorIdHook,
  };
};
