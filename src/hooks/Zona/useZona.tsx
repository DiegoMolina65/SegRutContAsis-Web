import { useState, useCallback } from "react";
import type { ZonaRequestDTO, ZonaResponseDTO } from "../../types/exportTypes";
import {
  obtenerZonas,
  crearZona,
  actualizarZona,
  deshabilitarZona,
  obtenerZonaPorId,
} from "../../api/exportApi";

export const useZona = () => {
  const [zonas, setZonas] = useState<ZonaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  // Obtener todas las zonas
  const obtenerZonasHook = useCallback(async (): Promise<ZonaResponseDTO[]> => {
    setLoading(true);
    try {
      const data = await obtenerZonas();
      setZonas(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener zonas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva zona
  const crearNuevaZona = useCallback(async (dto: ZonaRequestDTO) => {
    setLoading(true);
    try {
      const newZona = await crearZona(dto);
      setZonas((prev) => [...prev, newZona]);
      return newZona;
    } catch (err: any) {
      setError(err.message || "Error al crear zona");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar zona
  const actualizarZonaId = useCallback(
    async (id: number, dto: ZonaRequestDTO) => {
      setLoading(true);
      try {
        const response = await actualizarZona(id, dto);
        // Tu API devuelve { mensaje, zona }
        const updatedZona = response.zona;

        setZonas((prev) =>
          prev.map((z) => (z.zonId === updatedZona.zonId ? updatedZona : z))
        );

        return updatedZona;
      } catch (err: any) {
        setError(err.message || "Error al actualizar zona");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Deshabilitar zona
  const deshabilitarZonaId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deshabilitarZona(id);
      setZonas((prev) => prev.filter((z) => z.zonId !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Error al deshabilitar zona");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener zona por ID
  const obtenerZonaPorIdHook = useCallback(
    async (id: number): Promise<ZonaResponseDTO | undefined> => {
      setLoading(true);
      try {
        const zona = await obtenerZonaPorId(id);
        return zona;
      } catch (err: any) {
        setError(err.message || "Error al obtener zona por ID");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    zonas,
    loading,
    error,
    obtenerZonasHook,
    crearNuevaZona,
    actualizarZonaId,
    deshabilitarZonaId,
    obtenerZonaPorIdHook,
  };
};
