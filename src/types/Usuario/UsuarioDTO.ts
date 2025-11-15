// Request DTOs
export interface UsuarioRequestDTO {
  UsuarioLog: string;
  ContrasenaLog: string;
}

export interface UsuarioRegistroRequestDTO {
  usrNombreCompleto: string;
  usrCorreo: string;
  usrTelefono: string;
  usrNitEmpleado: string;
  usrCarnetIdentidad: string;
  usrUsuarioLog: string;
  usrContrasenaLog: string;
  roles: string[];
}

// Response DTO
export interface UsuarioResponseDTO {
  usrId: number;
  token: string
  usrNombreCompleto: string;
  usrCorreo: string | null;
  usrCarnetIdentidad: string | null;
  usrNitEmpleado: string | null;
  usrTelefono: string | null;
  usrUsuarioLog: string | null;
  usrContrasenaLog: string | null;
  usrEstadoDel: boolean
  roles: string[];
  vendedorId: number | null;
  supervisorId: number | null;
  esAdministrador: boolean | null;
  esVendedor: boolean | null;
  esSupervisor: boolean | null;
}

// Info de Usuario
export interface UsuarioInfoDTO {
  usrId: number;
  usrNombreCompleto: string;
  usrUsuarioLog: string;
}
