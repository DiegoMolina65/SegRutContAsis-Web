import api from "../axiosConfig";
import type { VisitaRequestDTO, VisitaResponseDTO } from "../../types/exportTypes";

// CREAR VISITA
export const crearVisita = async (data: VisitaRequestDTO): Promise<VisitaResponseDTO> => {
  const response = await api.post<VisitaResponseDTO>("/Visita/crearVisita", data);
  return response.data;
};

// OBTENER TODAS VISITAS
export const obtenerTodasVisitas = async (): Promise<VisitaResponseDTO[]> => {
  const response = await api.get<VisitaResponseDTO[]>("/Visita/obtenerTodasVisitas");
  return response.data;
};

// OBTENER VISITA POR ID
export const obtenerVisitaId = async (id: number): Promise<VisitaResponseDTO> => {
  const response = await api.get<VisitaResponseDTO>(`/Visita/obtenerVisitaId/${id}`);
  return response.data;
};

// ACTUALIZAR VISITA
export const actualizarVisita = async (id: number, data: VisitaRequestDTO): Promise<VisitaResponseDTO> => {
  const response = await api.put<VisitaResponseDTO>(`/Visita/actualizarVisita/${id}`, data);
  return response.data;
};

// DESHABILITAR VISITA
export const deshabilitarVisita = async (id: number): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(`/Visita/deshabilitarVisita/${id}`);
  return response.data;
};

// FILTRADOS
export const obtenerVisitasPorRuta = async (rutaId: number): Promise<VisitaResponseDTO[]> => {
  const response = await api.get<VisitaResponseDTO[]>(`/Visita/obtenerVisitasPorRuta/${rutaId}`);
  return response.data;
};

export const obtenerVisitasPorDireccionCliente = async (clienteId: number): Promise<VisitaResponseDTO[]> => {
  const response = await api.get<VisitaResponseDTO[]>(`/Visita/obtenerVisitasPorDireccionCliente/${clienteId}`);
  return response.data;
};

export const obtenerVisitasPorVendedor = async (venId: number): Promise<VisitaResponseDTO[]> => {
  const response = await api.get<VisitaResponseDTO[]>(`/Visita/obtenerVisitasPorVendedor/${venId}`);
  return response.data;
};

export const obtenerVisitasPorSemana = async (venId: number, semana: number): Promise<VisitaResponseDTO[]> => {
  const response = await api.get<VisitaResponseDTO[]>(`/Visita/obtenerVisitasPorSemana/${venId}/${semana}`);
  return response.data;
};
