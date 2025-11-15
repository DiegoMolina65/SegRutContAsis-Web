import api from "../axiosConfig";
import type { 
  AsignacionClienteVendedorRequestDTO, 
  AsignacionClienteVendedorResponseDTO 
} from "../../types/exportTypes";

// CREAR ASIGNACIÓN
export const crearAsignacion = async (
  data: AsignacionClienteVendedorRequestDTO
): Promise<AsignacionClienteVendedorResponseDTO> => {
  const response = await api.post<AsignacionClienteVendedorResponseDTO>(
    "/AsignacionClienteVendedor/crearAsignacion",
    data
  );
  return response.data;
};

// ACTUALIZAR ASIGNACIÓN
export const actualizarAsignacion = async (
  id: number,
  data: AsignacionClienteVendedorRequestDTO
): Promise<AsignacionClienteVendedorResponseDTO> => {
  const response = await api.put<AsignacionClienteVendedorResponseDTO>(
    `/AsignacionClienteVendedor/actualizarAsignacion/${id}`,
    data
  );
  return response.data;
};

// DESACTIVAR ASIGNACIÓN
export const desactivarAsignacion = async (
  id: number
): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(
    `/AsignacionClienteVendedor/desactivarAsignacion/${id}`
  );
  return response.data;
};

// OBTENER POR ID
export const obtenerAsignacionPorId = async (
  id: number
): Promise<AsignacionClienteVendedorResponseDTO> => {
  const response = await api.get<AsignacionClienteVendedorResponseDTO>(
    `/AsignacionClienteVendedor/obtenerAsignacionPorId/${id}`
  );
  return response.data;
};

// OBTENER POR VENDEDOR
export const obtenerAsignacionesPorVendedor = async (
  venId: number
): Promise<AsignacionClienteVendedorResponseDTO[]> => {
  const response = await api.get<AsignacionClienteVendedorResponseDTO[]>(
    `/AsignacionClienteVendedor/obtenerAsignacionesPorVendedor/${venId}`
  );
  return response.data;
};

// OBTENER TODAS
export const obtenerTodasAsignaciones = async (): Promise<
  AsignacionClienteVendedorResponseDTO[]
> => {
  const response = await api.get<AsignacionClienteVendedorResponseDTO[]>(
    "/AsignacionClienteVendedor/obtenerTodasAsignaciones"
  );
  return response.data;
};
