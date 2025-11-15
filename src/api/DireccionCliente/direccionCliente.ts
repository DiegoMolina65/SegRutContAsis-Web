import api from "../axiosConfig";
import type { DireccionClienteRequestDTO, DireccionClienteResponseDTO } from "../../types/exportTypes";

// CREAR DIRECCIÓN
export const crearDireccion = async (
  data: DireccionClienteRequestDTO
): Promise<DireccionClienteResponseDTO> => {
  const response = await api.post<DireccionClienteResponseDTO>(
    "/DireccionCliente/crearDireccion",
    data
  );
  return response.data;
};

// ACTUALIZAR DIRECCIÓN
export const actualizarDireccion = async (
  id: number,
  data: DireccionClienteRequestDTO
): Promise<DireccionClienteResponseDTO> => {
  const response = await api.put<DireccionClienteResponseDTO>(
    `/DireccionCliente/actualizarDireccion/${id}`,
    data
  );
  return response.data;
};

// DESACTIVAR DIRECCIÓN
export const desactivarDireccion = async (
  id: number
): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(
    `/DireccionCliente/desactivarDireccion/${id}`
  );
  return response.data;
};

// OBTENER POR ID
export const obtenerDireccionPorId = async (
  id: number
): Promise<DireccionClienteResponseDTO> => {
  const response = await api.get<DireccionClienteResponseDTO>(
    `/DireccionCliente/obtenerPorId/${id}`
  );
  return response.data;
};

// OBTENER POR CLIENTE
export const obtenerDireccionesPorCliente = async (
  clId: number
): Promise<DireccionClienteResponseDTO[]> => {
  const response = await api.get<DireccionClienteResponseDTO[]>(
    `/DireccionCliente/obtenerPorCliente/${clId}`
  );
  return response.data;
};
3

// OBTENER TODAS
export const obtenerTodasDirecciones = async (): Promise<DireccionClienteResponseDTO[]> => {
  const response = await api.get<DireccionClienteResponseDTO[]>(
    "/DireccionCliente/obtenerTodas"
  );
  return response.data;
};
