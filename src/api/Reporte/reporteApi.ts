import { axiosConfig } from "../axiosConfig";
import { ReporteFiltrosDTO } from "../../types/Reporte/ReporteDTO";

export const generarReporte = async (
  filtros: ReporteFiltrosDTO
): Promise<Blob> => {
  const response = await axiosConfig.post("/reportes/generar", filtros, {
    responseType: "blob", // Important for file downloads
  });
  return response.data;
};
