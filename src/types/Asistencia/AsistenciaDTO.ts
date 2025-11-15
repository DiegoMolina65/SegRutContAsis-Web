// Request DTO
export interface AsistenciaRequestDTO {
  venId: number;
  asiLatitud: number;
  asiLongitud: number;
}

// Response DTO
export interface AsistenciaResponseDTO {
  asiId: number;
  venId: number;
  asiHoraEntrada?: string | null; 
  asiHoraSalida?: string | null;
  asiLatitud: number;
  asiLongitud: number;
  nombreVendedor: string | null;
}
