import api from "../axiosConfig";
import type { EvidenciaRequestDTO, EvidenciaResponseDTO } from "../../types/exportTypes";

// CREAR EVIDENCIA
export const crearEvidencia = async (
  data: EvidenciaRequestDTO
): Promise<EvidenciaResponseDTO> => {
  const response = await api.post<EvidenciaResponseDTO>("/Evidencia/crearEvidencia", data);
  return response.data;
};

// ACTUALIZAR EVIDENCIA
export const actualizarEvidencia = async (
  id: number,
  data: EvidenciaRequestDTO
): Promise<EvidenciaResponseDTO> => {
  const response = await api.put<EvidenciaResponseDTO>(`/Evidencia/actualizarEvidencia/${id}`, data);
  return response.data;
};

// OBTENER TODAS LAS EVIDENCIAS
export const obtenerEvidencias = async (): Promise<EvidenciaResponseDTO[]> => {
  const response = await api.get<EvidenciaResponseDTO[]>("/Evidencia/obtenerEvidencia");
  return response.data;
};

// OBTENER EVIDENCIA POR ID
export const obtenerEvidenciaPorId = async (id: number): Promise<EvidenciaResponseDTO> => {
  const response = await api.get<EvidenciaResponseDTO>(`/Evidencia/obtenerEvidenciaId/${id}`);
  return response.data;
};

// OBTENER EVIDENCIAS POR VISITA
export const obtenerEvidenciaPorVisita = async (visitaId: number): Promise<EvidenciaResponseDTO[]> => {
  const response = await api.get<EvidenciaResponseDTO[]>(`/Evidencia/obtenerEvidenciaPorVisita/${visitaId}`);
  return response.data;
};

// OBTENER EVIDENCIAS POR VENDEDOR
export const obtenerEvidenciaPorVendedor = async (venId: number): Promise<EvidenciaResponseDTO[]> => {
  const response = await api.get<EvidenciaResponseDTO[]>(`/Evidencia/obtenerEvidenciaPorVendedor/${venId}`);
  return response.data;
};

// OBTENER EVIDENCIAS POR TIPO
export const obtenerEvidenciaPorTipo = async (tipo: string): Promise<EvidenciaResponseDTO[]> => {
  const response = await api.get<EvidenciaResponseDTO[]>(`/Evidencia/obtenerEvidenciaPorTipo/${tipo}`);
  return response.data;
};
