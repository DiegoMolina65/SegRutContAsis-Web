import api from "../axiosConfig";
import type { 
  UsuarioRequestDTO, 
  UsuarioRegistroRequestDTO, 
  UsuarioResponseDTO, 
  UsuarioInfoDTO,
} from "../../types/exportTypes";

// LOGIN
export const loginUsuario = async (usuarioData: UsuarioRequestDTO): Promise<UsuarioResponseDTO> => {
  const response = await api.post("/Usuario/loginUsuario", usuarioData);

  const data = response.data;

  const usuarioNormalizado: UsuarioResponseDTO = {
    usrId: data.usrId ?? data.usrId,
    token: data.token ?? data.token,
    usrNombreCompleto: data.usrNombreCompleto ?? data.usrNombreCompleto,
    usrCorreo: data.usrCorreo ?? data.usrCorreo,
    usrCarnetIdentidad: data.usrCarnetIdentidad ?? data.usrCarnetIdentidad,
    usrNitEmpleado: data.usrNitEmpleado ?? data.usrNitEmpleado,
    usrTelefono: data.usrTelefono ?? data.usrTelefono,
    usrUsuarioLog: data.usrUsuarioLog ?? data.usrUsuarioLog,
    usrContrasenaLog: data.usrContrasenaLog ?? data.contrusrContrasenaLogasenaLog,
    usrEstadoDel: data.usrEstadoDel ?? data.usrEstadoDel,
    roles: data.roles ?? data.roles ?? [],
    vendedorId: data.vendedorId ?? data.vendedorId,
    supervisorId: data.supervisorId ?? data.supervisorId,

      esAdministrador: data.esAdministrador ?? false,
  esVendedor: data.esVendedor ?? false,
  esSupervisor: data.esSupervisor ?? false,
  };

  if (usuarioNormalizado.token) {
    localStorage.setItem("token", usuarioNormalizado.token);
  }

  return usuarioNormalizado;
};


// REGISTRO
export const registrarUsuario = async (usuarioData: UsuarioRegistroRequestDTO): Promise<UsuarioInfoDTO> => {
  const response = await api.post<UsuarioInfoDTO>("/Usuario/registrarUsuario", usuarioData);
  return response.data;
};

// OBTENER TODOS LOS USUARIOS
export const obtenerUsuarios = async (): Promise<UsuarioResponseDTO[]> => {
  const response = await api.get<UsuarioResponseDTO[]>("/Usuario/obtenerUsuarios");
  return response.data;
};

// OBTENER USUARIO POR ID
export const obtenerUsuarioId = async (id: number): Promise<UsuarioResponseDTO> => {
  const response = await api.get<UsuarioResponseDTO>(`/Usuario/obtenerUsuarioId/${id}`);
  return response.data;
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (id: number, usuarioData: UsuarioRegistroRequestDTO): Promise<UsuarioResponseDTO> => {
  const response = await api.put<UsuarioResponseDTO>(`/Usuario/actualizarUsuario/${id}`, usuarioData);
  return response.data;
};

// DESHABILITAR USUARIO
export const deshabilitarUsuario = async (id: number): Promise<{ mensaje: string }> => {
  const response = await api.put<{ mensaje: string }>(`/Usuario/deshabilitarUsuario/${id}`);
  return response.data;
};

// LOGOUT
export const logoutUsuario = async (): Promise<{ mensaje: string }> => {
  const response = await api.post<{ mensaje: string }>("/Usuario/logoutUsuario");
  localStorage.removeItem("token");
  localStorage.removeItem("usrNombreCompleto");
  localStorage.removeItem("roles");
  return response.data;
};

// OBTENER VENDEDORES
export const obtenerVendedores = async (): Promise<UsuarioResponseDTO[]> => {
  const response = await api.get<UsuarioResponseDTO[]>("/Usuario/obtenerVendedores");
  return response.data;
};

// OBTENER SUPERVISORES
export const obtenerSupervisores = async (): Promise<UsuarioResponseDTO[]> => {
  const response = await api.get<UsuarioResponseDTO[]>("/Usuario/obtenerSupervisores");
  return response.data;
};

