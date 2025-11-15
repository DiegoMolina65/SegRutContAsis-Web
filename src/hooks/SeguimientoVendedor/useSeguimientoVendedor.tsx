import { useState} from "react";
import type { SeguimientoVendedorRequestDTO, SeguimientoVendedorResponseDTO } from "../../types/exportTypes";
import { 
  crearSeguimientoVendedor,
  obtenerTodosSeguimientosVendedores,
  obtenerSeguimientosDeUnVendedor
} from "../../api/exportApi";

export const useSeguimientoVendedor = () => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoVendedorResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerTodosSeguimientosVendedoresHook = async () => {
    setLoading(true);
    try {
      const data = await obtenerTodosSeguimientosVendedores();
      setSeguimientos(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener seguimientos");
    } finally {
      setLoading(false);
    }
  };

  const obtenerSeguimientosUnVendedorHook = async (venId: number) => {
    setLoading(true);
    try {
      const data = await obtenerSeguimientosDeUnVendedor(venId);
      setSeguimientos(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener seguimientos del vendedor");
    } finally {
      setLoading(false);
    }
  };

  const crearNuevoSeguimiento = async (dto: SeguimientoVendedorRequestDTO) => {
    setLoading(true);
    try {
      const data = await crearSeguimientoVendedor(dto);
      setSeguimientos((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear seguimiento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    seguimientos,
    loading,
    error,
    obtenerTodosSeguimientosVendedoresHook,
    obtenerSeguimientosUnVendedorHook,
    crearNuevoSeguimiento,
  };
};
