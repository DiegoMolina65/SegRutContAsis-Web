import api from "../axiosConfig";
import type { ClienteRequestDTO, ClienteResponseDTO } from "../../types/exportTypes";

// OBTENER TODOS LOS CLIENTES
export const obtenerClientes = async (): Promise<ClienteResponseDTO[]> => {
  const response = await api.get<ClienteResponseDTO[]>("/Cliente/obtenerClientes");
  return response.data;
};

// OBTENER CLIENTE POR ID
export const obtenerClientePorId = async (id: number): Promise<ClienteResponseDTO> => {
  const response = await api.get<ClienteResponseDTO>(`/Cliente/obtenerClienteId/${id}`);
  return response.data;
};

// CREAR CLIENTE
export const crearCliente = async (clienteData: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
  const response = await api.post<ClienteResponseDTO>("/Cliente/crearCliente", clienteData);
  return response.data;
};

// ACTUALIZAR CLIENTE
export const actualizarCliente = async (id: number, clienteData: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
  const response = await api.put<ClienteResponseDTO>(`/Cliente/actualizarCliente/${id}`, clienteData);
  return response.data;
};

// DESHABILITAR CLIENTE
export const deshabilitarCliente = async (id: number): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(`/Cliente/deshabilitarCliente/${id}`);
  return response.data;
};
