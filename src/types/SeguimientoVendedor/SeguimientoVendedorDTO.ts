// Request DTO
export interface SeguimientoVendedorRequestDTO {
  venId: number;
  segLatitud: number;
  segLongitud: number;
}

// Response DTO
export interface SeguimientoVendedorResponseDTO {
  segId: number;
  venId: number;
  segFechaCreacion: string; 
  segLatitud: number;
  segLongitud: number;
  vendedorNombre: string
}
