// Request DTO
export interface EvidenciaRequestDTO {
  visitaId: number;
  eviTipo?: string | null;
  eviObservaciones?: string | null;
}

// Response DTO
export interface EvidenciaResponseDTO {
  eviId: number;
  eviFechaCreacion: string; 
  visitaId: number;
  eviTipo?: string | null;
  eviObservaciones?: string | null;
}
