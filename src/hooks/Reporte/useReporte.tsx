import { useState, useCallback } from "react";
import type { ReporteActividadRequestDTO } from "../../types/exportTypes";

import {
  generarReporteAsistenciaDiariaPDF,
  generarReporteAsistenciaPeriodoPDF,
  generarReporteControlCampoPDF,
  generarReporteVisitasPorZonaPDF,
  generarReporteVisitasRealizadasPDF,
} from "../../api/exportApi";

export const useReportesActividad = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Descargar PDF
  const descargarPDF = (blob: Blob, nombreArchivo: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ejecutarPeticion = useCallback(
    async (servicioFn: (data: ReporteActividadRequestDTO) => Promise<Blob>, data: ReporteActividadRequestDTO, nombre: string) => {
      setLoading(true);
      setError(null);
      try {
        const pdfBlob = await servicioFn(data);
        descargarPDF(pdfBlob, nombre);
      } catch (err: any) {
        setError(err.message || "Error al generar el reporte");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generarAsistenciaDiaria = useCallback(
    async (data: ReporteActividadRequestDTO) => {
      const nombre = data.nombreArchivo ?? "Reporte_Asistencia_Diaria.pdf";
      await ejecutarPeticion(generarReporteAsistenciaDiariaPDF, data, nombre);
    },
    [ejecutarPeticion]
  );

  const generarAsistenciaPeriodo = useCallback(
    async (data: ReporteActividadRequestDTO) => {
      const nombre = data.nombreArchivo ?? "Reporte_Asistencia_Periodo.pdf";
      await ejecutarPeticion(generarReporteAsistenciaPeriodoPDF, data, nombre);
    },
    [ejecutarPeticion]
  );

  const generarControlCampo = useCallback(
    async (data: ReporteActividadRequestDTO) => {
      const nombre = data.nombreArchivo ?? "Reporte_Control_Campo.pdf";
      await ejecutarPeticion(generarReporteControlCampoPDF, data, nombre);
    },
    [ejecutarPeticion]
  );

  const generarVisitasPorZona = useCallback(
    async (data: ReporteActividadRequestDTO) => {
      const nombre = data.nombreArchivo ?? "Reporte_Visitas_Zona.pdf";
      await ejecutarPeticion(generarReporteVisitasPorZonaPDF, data, nombre);
    },
    [ejecutarPeticion]
  );

  const generarVisitasRealizadas = useCallback(
    async (data: ReporteActividadRequestDTO) => {
      const nombre = data.nombreArchivo ?? "Reporte_Visitas_Realizadas.pdf";
      await ejecutarPeticion(generarReporteVisitasRealizadasPDF, data, nombre);
    },
    [ejecutarPeticion]
  );

  return {
    loading,
    error,

    generarAsistenciaDiaria,
    generarAsistenciaPeriodo,
    generarControlCampo,
    generarVisitasPorZona,
    generarVisitasRealizadas,
  };
};
