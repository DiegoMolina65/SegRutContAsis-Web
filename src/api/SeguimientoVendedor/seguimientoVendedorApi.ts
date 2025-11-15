import api from "../axiosConfig";
import type { SeguimientoVendedorRequestDTO, SeguimientoVendedorResponseDTO } from "../../types/exportTypes";

// CREAR SEGUIMIENTO
export const crearSeguimientoVendedor = async (
  data: SeguimientoVendedorRequestDTO
): Promise<SeguimientoVendedorResponseDTO> => {
  const response = await api.post<SeguimientoVendedorResponseDTO>("/SeguimientoVendedor/crearSeguimientoVendedor", data);
  return response.data;
};

// OBTENER TODOS LOS SEGUIMIENTOS
export const obtenerTodosSeguimientosVendedores = async (): Promise<SeguimientoVendedorResponseDTO[]> => {
  const response = await api.get<SeguimientoVendedorResponseDTO[]>("/SeguimientoVendedor/obtenerTodosSeguimientosVendedores");
  return response.data;
};

// OBTENER SEGUIMIENTOS DE UN VENDEDOR
export const obtenerSeguimientosDeUnVendedor = async (venId: number): Promise<SeguimientoVendedorResponseDTO[]> => {
  const response = await api.get<SeguimientoVendedorResponseDTO[]>(`/SeguimientoVendedor/obtenerSeguimientosDeUnVendedor/${venId}`);
  return response.data;
};
