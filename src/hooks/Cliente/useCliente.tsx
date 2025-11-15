import { useState, useCallback } from "react";
import type { ClienteRequestDTO, ClienteResponseDTO } from "../../types/exportTypes";
import { 
  obtenerClientes, 
  obtenerClientePorId, 
  crearCliente, 
  actualizarCliente, 
  deshabilitarCliente 
} from "../../api/exportApi";

export const useCliente = () => {
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los clientes
  const obtenerClientesHook = useCallback(async (): Promise<ClienteResponseDTO[]> => {
    setLoading(true);
    try {
      const data = await obtenerClientes();
      setClientes(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener clientes");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener cliente por ID
  const obtenerClientePorIdHook = useCallback(async (id: number): Promise<ClienteResponseDTO | null> => {
    setLoading(true);
    try {
      const data = await obtenerClientePorId(id);
      setCliente(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener cliente");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  // Crear nuevo cliente
  const crearNuevoCliente = useCallback(async (dto: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
    setLoading(true);
    try {
      const data = await crearCliente(dto);
      setClientes((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al crear cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  // Actualizar cliente existente
  const actualizarClienteExistente = useCallback(async (id: number, dto: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
    setLoading(true);
    try {
      const data = await actualizarCliente(id, dto);
      setClientes((prev) =>
        prev.map((c) => (c.clId === id ? data : c))
      );
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deshabilitar cliente por ID
  const deshabilitarClientePorId = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await deshabilitarCliente(id);
      setClientes((prev) => prev.filter((c) => c.clId !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Error al deshabilitar cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clientes,
    cliente,
    loading,
    error,
    obtenerClientesHook,
    obtenerClientePorIdHook,
    crearNuevoCliente,
    actualizarClienteExistente,
    deshabilitarClientePorId,
  };
};
