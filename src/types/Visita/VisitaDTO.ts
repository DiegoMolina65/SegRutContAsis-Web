// Request DTO
export interface VisitaRequestDTO {
  rutId: number;
  dirClId: number;
  visComentario?: string;
}

// Response DTO
export interface VisitaResponseDTO {
  visId: number;
  rutId: number;
  dirClId: number;
  visEstadoDel: boolean;
  visComentario?: string;

  // Información adicional
  nombreCliente?: string;
  nombreSucursalCliente?: string;
  sucursalLatitud?: number;
  sucursalLongitud?: number;
  nombreZona?: string;
  direccion?: string;
  nombreVendedor?: string;
  nombreRuta?: string;
  fechaEjecucionRuta?: string;
}
