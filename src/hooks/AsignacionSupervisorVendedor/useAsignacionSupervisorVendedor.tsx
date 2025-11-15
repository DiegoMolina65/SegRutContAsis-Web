
import { useState, useEffect, useCallback } from "react";
import type {
  AsignacionSupervisorVendedorResquestDTO,
  AsignacionSupervisorVendedorResponseDTO,
} from "../../types/exportTypes";
import {
  obtenerTodasAsignacionesSupervisorVendedor,
  crearAsignacionSupervisorVendedor,
  actualizarAsignacionSupervisorVendedor,
  desactivarAsignacionSupervisorVendedor,
  obtenerAsignacionSupervisorVendedorPorId,
  obtenerVendedoresPorSupervisor,
  obtenerSupervisoresPorVendedor,
} from "../../api/exportApi";

export const useAsignacionSupervisorVendedor = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionSupervisorVendedorResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodasAsignacionesSupervisorVendedor();
      setAsignaciones(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener las asignaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsignaciones();
  }, [fetchAsignaciones]);

  const addAsignacion = useCallback(
    async (data: AsignacionSupervisorVendedorResquestDTO) => {
      setLoading(true);
      setError(null);
      try {
        const nuevaAsignacion = await crearAsignacionSupervisorVendedor(data);
        setAsignaciones((prev) => [...prev, nuevaAsignacion]);
      } catch (err: any) {
        setError(err.message || "Error al crear la asignación");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAsignacion = useCallback(
    async (id: number, data: AsignacionSupervisorVendedorResquestDTO) => {
      setLoading(true);
      setError(null);
      try {
        const asignacionActualizada = await actualizarAsignacionSupervisorVendedor(id, data);
        setAsignaciones((prev) =>
          prev.map((a) => (a.asvId === id ? asignacionActualizada : a))
        );
      } catch (err: any) {
        setError(err.message || "Error al actualizar la asignación");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeAsignacion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await desactivarAsignacionSupervisorVendedor(id);
      setAsignaciones((prev) => prev.filter((a) => a.asvId !== id));
    } catch (err: any) {
      setError(err.message || "Error al desactivar la asignación");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAsignacionById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await obtenerAsignacionSupervisorVendedorPorId(id);
    } catch (err: any) {
      setError(err.message || "Error al obtener la asignación");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVendedoresBySupervisor = useCallback(async (supervisorId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await obtenerVendedoresPorSupervisor(supervisorId);
    } catch (err: any) {
      setError(err.message || "Error al obtener vendedores por supervisor");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSupervisoresByVendedor = useCallback(async (vendedorId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await obtenerSupervisoresPorVendedor(vendedorId);
    } catch (err: any) {
      setError(err.message || "Error al obtener supervisores por vendedor");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    asignaciones,
    loading,
    error,
    fetchAsignaciones,
    addAsignacion,
    updateAsignacion,
    removeAsignacion,
    getAsignacionById,
    getVendedoresBySupervisor,
    getSupervisoresByVendedor,
  };
};
