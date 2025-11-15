import api from "../axiosConfig";
import type { RutaRequestDTO, RutaResponseDTO } from "../../types/exportTypes";

// CREAR RUTA
export const crearRuta = async (data: RutaRequestDTO): Promise<RutaResponseDTO> => {
  const response = await api.post<RutaResponseDTO>("/Ruta/crearRuta", data);
  return response.data;
};

// OBTENER TODAS LAS RUTAS
export const obtenerRutas = async (): Promise<RutaResponseDTO[]> => {
  const response = await api.get<RutaResponseDTO[]>("/Ruta/obtenerRutas");
  return response.data;
};

// OBTENER RUTA POR ID
export const obtenerRutaPorId = async (id: number): Promise<RutaResponseDTO> => {
  const response = await api.get<RutaResponseDTO>(`/Ruta/obtenerRutaId/${id}`);
  return response.data;
};

// ACTUALIZAR RUTA
export const actualizarRuta = async (id: number, data: RutaRequestDTO): Promise<RutaResponseDTO> => {
  const response = await api.put<RutaResponseDTO>(`/Ruta/actualizarRuta/${id}`, data);
  return response.data;
};

// DESACTIVAR RUTA
export const desactivarRuta = async (id: number): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(`/Ruta/desactivarRuta/${id}`);
  return response.data;
};

// OBTENER RUTAS POR VENDEDOR
export const obtenerRutasPorVendedor = async (venId: number): Promise<RutaResponseDTO[]> => {
  const response = await api.get<RutaResponseDTO[]>(`/Ruta/listarRutasVendedor/${venId}`);
  return response.data;
};

// OBTENER RUTAS POR SUPERVISOR
export const obtenerRutasPorSupervisor = async (supId: number): Promise<RutaResponseDTO[]> => {
  const response = await api.get<RutaResponseDTO[]>(`/Ruta/listarRutasSupervisor/${supId}`);
  return response.data;
};
