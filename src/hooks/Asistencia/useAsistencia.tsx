import { useCallback, useState } from "react";
import type { AsistenciaRequestDTO, AsistenciaResponseDTO } from "../../types/exportTypes";
import { registrarEntrada, registrarSalida, obtenerAsistencias as apiObtenerAsistencias } from "../../api/exportApi";

export const useAsistencia = () => {
  const [asistencia, setAsistencia] = useState<AsistenciaResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registrarEntradaDiaAsistencia = async (dto: AsistenciaRequestDTO) => {
    setLoading(true);
    try {
      const data = await registrarEntrada(dto);
      setAsistencia(data); 
    } catch (err: any) {
      setError(err.message || "Error al registrar la entrada");
    } finally {
      setLoading(false);
    }
  };

  const registrarSalidaDiaAsistencia = async (venId: number) => {
    setLoading(true);
    try {
      const data = await registrarSalida(venId);
      setAsistencia(data); 
    } catch (err: any) {
      setError(err.message || "Error al registrar la salida");
    } finally {
      setLoading(false);
    }
  };

  const obtenerAsistencias = useCallback(async (): Promise<AsistenciaResponseDTO[]> => {
    setLoading(true);
    try {
      const data = await apiObtenerAsistencias();
      return data; 
    } catch (err: any) {
      setError(err.message || "Error al obtener asistencia");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    asistencia,
    loading,
    error,
    registrarEntradaDiaAsistencia,
    registrarSalidaDiaAsistencia,
    obtenerAsistencias, // exportamos la función para obtener todas
  };
};
