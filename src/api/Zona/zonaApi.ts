import api from "../axiosConfig";
import type { ZonaRequestDTO, ZonaResponseDTO } from "../../types/exportTypes";

// OBTENER TODAS LAS ZONAS
export const obtenerZonas = async (): Promise<ZonaResponseDTO[]> => {
  const response = await api.get<ZonaResponseDTO[]>("/Zona/obtenerZona");
  return response.data;
};

// CREAR ZONA
export const crearZona = async (data: ZonaRequestDTO): Promise<ZonaResponseDTO> => {
  const response = await api.post<ZonaResponseDTO>("/Zona/crearZona", data);
  return response.data;
};

// ACTUALIZAR ZONA
export const actualizarZona = async (id: number, data: ZonaRequestDTO): Promise<{ mensaje: string; zona: ZonaResponseDTO }> => {
  const response = await api.put<{ mensaje: string; zona: ZonaResponseDTO }>(`/Zona/actualizarZona/${id}`, data);
  return response.data;
};

// DESHABILITAR ZONA
export const deshabilitarZona = async (id: number): Promise<{ mensaje: string; success: boolean }> => {
  const response = await api.put<{ mensaje: string; success: boolean }>(`/Zona/deshabilitarZona/${id}`);
  return response.data;
};

// OBTENER ZONA POR ID
export const obtenerZonaPorId = async (id: number): Promise<ZonaResponseDTO> => {
  const response = await api.get<ZonaResponseDTO>(`/Zona/obtenerZonaPorId/${id}`);
  return response.data;
};
