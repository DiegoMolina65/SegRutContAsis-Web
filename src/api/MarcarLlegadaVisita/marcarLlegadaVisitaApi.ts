import api from "../axiosConfig";
import type { MarcarLlegadaVisitaResponseDTO } from "../../types/exportTypes";

// OBTENER MARCACIONES POR VISITA
export const obtenerMarcacionesPorVisita = async (id: number): Promise<MarcarLlegadaVisitaResponseDTO[]> => {
  const response = await api.get<MarcarLlegadaVisitaResponseDTO[]>(`/MarcarLlegadaVisita/obtenerMarcacionesPorVisita/${id}`);
  return response.data;
};


