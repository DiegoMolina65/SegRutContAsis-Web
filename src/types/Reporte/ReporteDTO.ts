export interface ReporteFiltrosDTO {
  idSupervisor?: number;
  idVendedor?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoReporte: string;
  // Tipos de reporte:
  // 'ASISTENCIA_DIARIA'
  // 'ASISTENCIA_PERIODO'
  // 'CONTROL_CAMPO'
  // 'VISITAS_ZONA'
  // 'VISITAS_REALIZADAS'
}
