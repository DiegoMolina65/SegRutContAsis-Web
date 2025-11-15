import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";

// Administracion
import RegistroUsuarioPage from "../pages/Administracion/Usuario/RegistroEdicionUsuarioPage";
import UsuariosRegistradosPage from "../pages/Administracion/Usuario/UsuariosRegistradosPage";
import RegistroEdicionZonaPage from "../pages/Administracion/Zona/RegistroEdicionZonaPage";
import ZonasRegistradasPage from "../pages/Administracion/Zona/ZonasRegistradasPage";
import RegistroEdicionClientePage from "../pages/Administracion/Cliente/RegistroEdicionClientePage";
import ClientesRegistradosPage from "../pages/Administracion/Cliente/ClientesRegistradosPage";
import RegistroDireccionClientePage from "../pages/Administracion/ClienteDireccion/RegistroEditarDireccionClientePage";
import DireccionesClientesRegistradasPage from "../pages/Administracion/ClienteDireccion/DireccionesClientesRegistradasPage";
import RegistroEdicionRutaPage from "../pages/GestionVisitas/Ruta/RegistroEdicionRutaPage";
import RutasRegistradasPage from "../pages/GestionVisitas/Ruta/RutasRegistradasPage";
import RegistroEditarAsignacionClienteVendedorPage from "../pages/Administracion/AsignacionClienteVendedor/RegistroEditarAsignacionClienteVendedorPage";
import AsignacionClientesVendedorRegistradasPage from "../pages/Administracion/AsignacionClienteVendedor/AsignacionClientesVendedorRegistradas";
import RegistroEditarAsignacionSupervisorVendedorPage from "../pages/Administracion/AsignacionSupervisorVendedor/RegistroEditarAsignacionSupervisorVendedorPage";
import AsignacionSupervisorVendedorRegistradas from "../pages/Administracion/AsignacionSupervisorVendedor/AsignacionSupervisorVendedorRegistradas";


// Visitas
import CrearEditarVisitasRutaCliente from "../pages/GestionVisitas/Visita/CrearEditarVisitas";
import VisitasRutaClienteRegistrados from "../pages/GestionVisitas/Visita/VisitasRegistradas";
import VerVisitasPorCliente from "../pages/GestionVisitas/VerVisitas/VerVisitasPorClientePage";
import VerVisitasPorRuta from "../pages/GestionVisitas/VerVisitas/VerVisitasPorRutaPage";
import VerVisitasPorVendedor from "../pages/GestionVisitas/VerVisitas/VerVisitasPorVendedorPage";
import VerMarcacionesPorVisitaPage from "../pages/GestionVisitas/VerVisitas/VerMarcacionesPorVisitaPage";
// --

// Reportes
import ReporteAsistenciaDiariaPage from "../pages/Reportes/ReporteAsistenciaDiariaPage";
import ReporteAsistenciaPeriodoPage from "../pages/Reportes/ReporteAsistenciaPeriodoPage";
import ReporteControlCampoPage from "../pages/Reportes/ReporteControlCampoPage";
import ReporteVisitasPorZonaPage from "../pages/Reportes/ReporteVisitasPorZonaPage";
import ReporteVisitasRealizadasPage from "../pages/Reportes/ReporteVisitasRealizadasPage";
// --

import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Login/LoginPage";

import { useUsuario } from "../hooks/exportHooks";
import { Layout } from "../components/ui/exportComponentsUI";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { user } = useUsuario();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const { user } = useUsuario();
  return !user ? children : <Navigate to="/dashboard" />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="usuarios/registro" element={<RegistroUsuarioPage />} />
          <Route
            path="usuarios/registrados"
            element={<UsuariosRegistradosPage />}
          />

          <Route path="zona/registro" element={<RegistroEdicionZonaPage />} />
          <Route path="zona/registrados" element={<ZonasRegistradasPage />} />

          <Route
            path="cliente/registro"
            element={<RegistroEdicionClientePage />}
          />
          <Route
            path="cliente/registrados"
            element={<ClientesRegistradosPage />}
          />

          <Route
            path="direccioncliente/gestiondireccionclientes"
            element={<RegistroDireccionClientePage />}
          />
          <Route
            path="direccioncliente/gestiondireccionclientesregistradas"
            element={<DireccionesClientesRegistradasPage />}
          />

          <Route path="ruta/registro" element={<RegistroEdicionRutaPage />} />
          <Route path="ruta/registrados" element={<RutasRegistradasPage />} />

          <Route
            path="asignacionclientevendedor/registro"
            element={<RegistroEditarAsignacionClienteVendedorPage />}
          />
          <Route
            path="asignacionclientevendedor/registrados"
            element={<AsignacionClientesVendedorRegistradasPage />}
          />

          <Route
            path="asignacionsupervisorvendedor/registro"
            element={<RegistroEditarAsignacionSupervisorVendedorPage />}
          />

          <Route
            path="asignacionsupervisorvendedor/registrados"
            element={<AsignacionSupervisorVendedorRegistradas />}
          />

          

          <Route
            path="visitas/registro"
            element={<CrearEditarVisitasRutaCliente />}
          />
          <Route
            path="visitas/registradas"
            element={<VisitasRutaClienteRegistrados />}
          />
          <Route
            path="visitas/por-cliente"
            element={<VerVisitasPorCliente />}
          />
          <Route path="visitas/por-ruta" element={<VerVisitasPorRuta />} />
          <Route
            path="visitas/por-vendedor"
            element={<VerVisitasPorVendedor />}
          />

          <Route
            path="visitas/marcaciones-por-visita"
            element={<VerMarcacionesPorVisitaPage />}
          />

          <Route
            path="reporte/asistencia-diaria"
            element={<ReporteAsistenciaDiariaPage />}
          />
          <Route
            path="reporte/asistencia-periodo"
            element={<ReporteAsistenciaPeriodoPage />}
          />
          <Route
            path="reporte/control-campo"
            element={<ReporteControlCampoPage />}
          />
          <Route
            path="reporte/visitas-zona"
            element={<ReporteVisitasPorZonaPage />}
          />
          <Route
            path="reporte/visitas-realizadas"
            element={<ReporteVisitasRealizadasPage />}
          />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
