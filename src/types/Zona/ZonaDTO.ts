// Request DTO
export interface ZonaRequestDTO {
  nombre: string;
  descripcion: string;
}

// Response DTO
export interface ZonaResponseDTO {
  zonId: number;
  zonNombre: string;
  zonDescripcion: string;
  zonFechaCreacion: string;
  zonEstadoDel: boolean;
}
