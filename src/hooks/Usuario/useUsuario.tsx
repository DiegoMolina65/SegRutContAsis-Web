import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { UsuarioResponseDTO } from "../../types/exportTypes";
import { logoutUsuario } from "../../api/exportApi";

interface UserContextType {
  user: UsuarioResponseDTO | null;
  login: (userData: UsuarioResponseDTO) => void;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUsuario = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsuario debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UsuarioResponseDTO | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usrNombreCompleto = localStorage.getItem("usrNombreCompleto");
    const roles = localStorage.getItem("roles");
    const usrId = localStorage.getItem("usrId");
    const usrCorreo = localStorage.getItem("usrCorreo");
    const usrTelefono = localStorage.getItem("usrTelefono");
    const usrCarnetIdentidad = localStorage.getItem("usrCarnetIdentidad");
    const usrNitEmpleado = localStorage.getItem("usrNitEmpleado");

    if (token && usrNombreCompleto && roles && usrId) {
      setUser({
        usrId: parseInt(usrId, 10),
        token,
        usrNombreCompleto,
        roles: JSON.parse(roles),
        usrCorreo,
        usrTelefono,
        usrCarnetIdentidad,
        usrNitEmpleado,
      } as UsuarioResponseDTO);
    }
  }, []);

  // Iniciar sesión
  const login = (userData: UsuarioResponseDTO) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("usrId", userData.usrId.toString());
    localStorage.setItem("usrNombreCompleto", userData.usrNombreCompleto);
    localStorage.setItem("roles", JSON.stringify(userData.roles));
    setUser(userData);
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await logoutUsuario();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usrNombreCompleto");
      localStorage.removeItem("roles");
      localStorage.removeItem("usrId");
      setUser(null);

      window.location.href = "/login";
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
