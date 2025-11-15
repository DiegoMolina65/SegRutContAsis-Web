// Request DTO
export interface AsignacionClienteVendedorRequestDTO {
  supId: number;
  venId: number;
  clId: number;
}

// Response DTO
export interface AsignacionClienteVendedorResponseDTO {
  asgId: number;
  supId: number;
  supervisorNombre: string;
  venId: number;
  vendedorNombre: string;
  clId: number;
  clienteNombre: string;
  asgFechaCreacion: string; 
  asgEstadoDel: boolean;
}
