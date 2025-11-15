
import api from "../axiosConfig";
import type { 
  AsignacionSupervisorVendedorResquestDTO, 
  AsignacionSupervisorVendedorResponseDTO
} from "../../types/exportTypes";

// CREAR ASIGNACIÓN
export const crearAsignacionSupervisorVendedor = async (
  data: AsignacionSupervisorVendedorResquestDTO
): Promise<AsignacionSupervisorVendedorResponseDTO> => {
  const response = await api.post<AsignacionSupervisorVendedorResponseDTO>(
    "/AsignacionSupervisorVendedor/crearAsignacion",
    data
  );
  return response.data;
};

// ACTUALIZAR ASIGNACIÓN
export const actualizarAsignacionSupervisorVendedor = async (
  id: number,
  data: AsignacionSupervisorVendedorResquestDTO
): Promise<AsignacionSupervisorVendedorResponseDTO> => {
  const response = await api.put<AsignacionSupervisorVendedorResponseDTO>(
    `/AsignacionSupervisorVendedor/actualizarAsignacion/${id}`,
    data
  );
  return response.data;
};

// DESACTIVAR ASIGNACIÓN
export const desactivarAsignacionSupervisorVendedor = async (
  id: number
): Promise<{ mensaje: string }> => {
  const response = await api.delete<{ mensaje: string }>(
    `/AsignacionSupervisorVendedor/desactivarAsignacion/${id}`
  );
  return response.data;
};

// OBTENER TODAS LAS ASIGNACIONES
export const obtenerTodasAsignacionesSupervisorVendedor = async (): Promise<
  AsignacionSupervisorVendedorResponseDTO[]
> => {
  const response = await api.get<AsignacionSupervisorVendedorResponseDTO[]>(
    "/AsignacionSupervisorVendedor/obtenerTodasAsignaciones"
  );
  return response.data;
};

// OBTENER ASIGNACIÓN POR ID
export const obtenerAsignacionSupervisorVendedorPorId = async (
  id: number
): Promise<AsignacionSupervisorVendedorResponseDTO> => {
  const response = await api.get<AsignacionSupervisorVendedorResponseDTO>(
    `/AsignacionSupervisorVendedor/obtenerAsignacionPorId/${id}`
  );
  return response.data;
};

// OBTENER VENDEDORES POR SUPERVISOR
export const obtenerVendedoresPorSupervisor = async (
  supervisorId: number
): Promise<AsignacionSupervisorVendedorResponseDTO[]> => {
  const response = await api.get<AsignacionSupervisorVendedorResponseDTO[]>(
    `/AsignacionSupervisorVendedor/obtenerVendedoresPorSupervisor/${supervisorId}`
  );
  return response.data;
};

// OBTENER SUPERVISORES POR VENDEDOR
export const obtenerSupervisoresPorVendedor = async (
  vendedorId: number
): Promise<AsignacionSupervisorVendedorResponseDTO[]> => {
  const response = await api.get<AsignacionSupervisorVendedorResponseDTO[]>(
    `/AsignacionSupervisorVendedor/obtenerSupervisoresPorVendedor/${vendedorId}`
  );
  return response.data;
};
