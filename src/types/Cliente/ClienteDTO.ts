// Request DTO
export interface ClienteRequestDTO {
  clNombreCompleto: string;
  clCarnetIdentidad: string;
  clNitCliente: string;
  clTipoCliente?: string | null;
  clTelefono: string;
}

// Response DTO
export interface ClienteResponseDTO {
  clId: number;
  clNombreCompleto: string;
  clCarnetIdentidad: string;
  clNitCliente: string;
  clTipoCliente?: string | null;
  clTelefono: string;
}
