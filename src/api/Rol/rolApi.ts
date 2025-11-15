import api from "../axiosConfig";
import type { RolResponseDTO } from "../../types/exportTypes";

// OBTENER TODOS LOS ROLES
export const obtenerRoles = async (): Promise<RolResponseDTO[]> => {
  const response = await api.get<RolResponseDTO[]>("/Rol/obtenerRoles");
  return response.data;
};
