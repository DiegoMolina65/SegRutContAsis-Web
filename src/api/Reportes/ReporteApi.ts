import api from "../axiosConfig";
import type { 
  ReporteActividadRequestDTO 
} from "../../types/exportTypes";

// GENERAR REPORTE DE ASISTENCIA DIARIA
export const generarReporteAsistenciaDiariaPDF = async (
  data: ReporteActividadRequestDTO
): Promise<Blob> => {
  const response = await api.post("/ReporteActividad/asistencia/diaria/pdf", data, {
    responseType: "blob",
  });
  return response.data;
};

// GENERAR REPORTE DE ASISTENCIA POR PERIODO
export const generarReporteAsistenciaPeriodoPDF = async (
  data: ReporteActividadRequestDTO
): Promise<Blob> => {
  const response = await api.post("/ReporteActividad/asistencia/periodo/pdf", data, {
    responseType: "blob",
  });
  return response.data;
};

// GENERAR INFORME CONTROL DE CAMPO
export const generarReporteControlCampoPDF = async (
  data: ReporteActividadRequestDTO
): Promise<Blob> => {
  const response = await api.post("/ReporteActividad/control-campo/pdf", data, {
    responseType: "blob",
  });
  return response.data;
};

// GENERAR REPORTE DE VISITAS POR ZONA
export const generarReporteVisitasPorZonaPDF = async (
  data: ReporteActividadRequestDTO
): Promise<Blob> => {
  const response = await api.post("/ReporteActividad/visitas/por-zona/pdf", data, {
    responseType: "blob",
  });
  return response.data;
};

// GENERAR REPORTE DE VISITAS REALIZADAS

export const generarReporteVisitasRealizadasPDF = async (
  data: ReporteActividadRequestDTO
): Promise<Blob> => {
  const response = await api.post("/ReporteActividad/visitas/realizadas/pdf", data, {
    responseType: "blob",
  });
  return response.data;
};
