// Request DTO
export interface RutaRequestDTO {
  venId: number | null;
  supId?: number | null;
  rutNombre: string;
  rutComentario?: string | null;
  rutFechaEjecucion: string;
}

// Response DTO
export interface RutaResponseDTO {
  rutId: number;
  venId: number;
  supId?: number | null;
  rutNombre: string;
  rutComentario?: string | null;
  rutFechaEjecucion: string;

  // Datos adicionales
  nombreVendedor: string | null;
  nombreSupervisor: string | null;
}
