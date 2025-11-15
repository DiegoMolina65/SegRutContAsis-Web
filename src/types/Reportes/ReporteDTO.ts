export interface ReporteActividadRequestDTO {
  // Tipo de reporte a generar
  // "asistencia-diaria", "asistencia-semanal", "control-campo", "visitas-zona", "visitas-realizadas"
  tipoReporte: string;

  // Filtros principales
  supervisorId?: number | null;
  vendedorId?: number | null;
  zonaId?: number | null;
  rutaId?: number | null;

  // Fechas
  fechaInicio?: string | null; 
  fechaFin?: string | null;

  // Opciones del reporte
  incluirUbicacion?: boolean;
  nombreUsuarioGenera?: string | null;

  // Personalización del PDF
  tituloReporte?: string | null;
  subtitulo?: string | null;
  nombreArchivo?: string | null;
}


export interface ReporteActividadResponseDTO {
  titulo: string;
  subtitulo: string;
  fechaGeneracion: string; 
  generadoPor: string;

  tipoReporte: string;

  // Cabeceras
  nombreSupervisor?: string | null;
  nombreVendedor?: string | null;
  nombreZona?: string | null;
  nombreRuta?: string | null;

  // Tabla de datos
  detalles: DetalleActividadDTO[];

  // Totales
  totalAsistencias?: number | null;
  totalVisitas?: number | null;
  totalHorasTrabajadas?: string | null; 
}

export interface DetalleActividadDTO {
  fecha: string; 
  tipoActividad: string;

  horaEntrada?: string | null; 
  horaSalida?: string | null;
  duracionJornada?: string | null;

  cliente?: string | null;
  direccion?: string | null;
  resultadoVisita?: string | null;

  latitud?: number | null;
  longitud?: number | null;

  estado?: string | null;
}
