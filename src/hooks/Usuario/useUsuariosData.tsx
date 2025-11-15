import { useState, useEffect, useCallback } from "react";
import type {
  UsuarioResponseDTO,
} from "../../types/exportTypes";
import { obtenerVendedores, obtenerSupervisores, obtenerUsuarios } from "../../api/exportApi";

export const useUsuariosData = () => {
  const [vendedores, setVendedores] = useState<UsuarioResponseDTO[]>([]);
  const [supervisores, setSupervisores] = useState<UsuarioResponseDTO[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usuariosResult, vendedoresResult, supervisoresResult] = await Promise.allSettled([
        obtenerUsuarios(),
        obtenerVendedores(),
        obtenerSupervisores(),
      ]);

      if (usuariosResult.status === 'fulfilled') {
        setUsuarios(usuariosResult.value || []);
      } else {
        console.error("Error al obtener usuarios:", usuariosResult.reason);
        setError(usuariosResult.reason?.message || "Error al obtener usuarios");
      }

      if (vendedoresResult.status === 'fulfilled') {
        setVendedores(vendedoresResult.value || []);
      } else {
        console.error("Error al obtener vendedores:", vendedoresResult.reason);
      }

      if (supervisoresResult.status === 'fulfilled') {
        setSupervisores(supervisoresResult.value || []);
      } else {
        console.error("Error al obtener supervisores:", supervisoresResult.reason);
      }

    } catch (err: any) {

      setError(err.message || "Ocurrió un error inesperado al cargar los datos de usuario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    vendedores,
    supervisores,
    usuarios,
    loading,
    error,
    refetch: fetchAllData, // Exponemos una función para recargar todos los datos
  };
};
