import api from "../axiosConfig";
import type { 
  AsistenciaRequestDTO, 
  AsistenciaResponseDTO 
} from "../../types/exportTypes";

// REGISTRAR ENTRADA
export const registrarEntrada = async (
  data: AsistenciaRequestDTO
): Promise<AsistenciaResponseDTO> => {
  const response = await api.post<AsistenciaResponseDTO>(
    "/Asistencia/entradaDia",
    data
  );
  return response.data;
};

// REGISTRAR SALIDA
export const registrarSalida = async (
  venId: number
): Promise<AsistenciaResponseDTO> => {
  const response = await api.post<AsistenciaResponseDTO>(
    `/Asistencia/salidaDia/${venId}`
  );
  return response.data;
};

// OBTENER ASISTENCIAS
export const obtenerAsistencias = async (): Promise<AsistenciaResponseDTO[]> => {
  const response = await api.get<AsistenciaResponseDTO[]>("Asistencia/obtenerAsistencia");
  return response.data;
};
