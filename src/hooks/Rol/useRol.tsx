import { useState, useEffect } from "react";
import type { RolResponseDTO } from "../../types/exportTypes";
import { obtenerRoles } from "../../api/exportApi";

export const useRol = () => {
  const [roles, setRoles] = useState<RolResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerRolesHook();
  }, []);

  const obtenerRolesHook = async () => {
    setLoading(true);
    try {
      const data = await obtenerRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener roles");
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    error,
    obtenerRolesHook,
  };
};
