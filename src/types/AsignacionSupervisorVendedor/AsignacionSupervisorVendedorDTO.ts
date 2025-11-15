// Request DTO
export interface AsignacionSupervisorVendedorResquestDTO {
  supId: number;
  venId: number;
}

// Response DTO
export interface AsignacionSupervisorVendedorResponseDTO {
  asvId: number;
  supId: number;
  nombreSupervisor: string;
  venId: number;
  nombreVendedor: string;
  asvFechaCreacion: string; 
  asvEstadoDel: boolean;
}
