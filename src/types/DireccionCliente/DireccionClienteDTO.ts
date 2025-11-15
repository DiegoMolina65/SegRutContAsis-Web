// Request DTO
export interface DireccionClienteRequestDTO {
  clId: number;
  zonId?: number | null;
  dirClNombreSucursal?: string | null;
  dirClDireccion: string;
  dirClLatitud: number;
  dirClLongitud: number;
}

// Response DTO
export interface DireccionClienteResponseDTO {
  dirClId: number;
  clId: number;
  nombreCliente?: string | null;
  zonId?: number | null;
  nombreZona?: string | null;
  dirClNombreSucursal?: string | null;
  dirClDireccion: string;
  dirClLatitud: number;
  dirClLongitud: number;
  dirClFechaCreacion: string; 
  dirClEstadoDel: boolean;
}
