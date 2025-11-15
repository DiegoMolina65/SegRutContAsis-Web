// DTO Response
export interface MarcarLlegadaVisitaResponseDTO{
    mlvId: number;
    visId: number;
    mlvHora: number;
    mlvLatitud: number;
    mlvLongitud: number 
    mlvEstadoDel: boolean; 
    mlvFechaCreacion: Date;

    // Datos adicionales
    nombreCliente: string;
    nombreSucursalCliente: string;
    sucursalLatitud: number;
    sucursalLongitud: number;
    nombreVendedor: string;
    usuarioLogVendedor: string;
    telefonoVendedor: string;
}