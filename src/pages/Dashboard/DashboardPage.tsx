import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  useUsuariosData,
  useAsignacionSupervisorVendedor,
  useDireccionCliente,
  useAsistencia,
  useSeguimientoVendedor,
} from "../../hooks/exportHooks";
import { useEffect, useState } from "react";
import type {
  UsuarioResponseDTO,
  AsistenciaResponseDTO,
  SeguimientoVendedorResponseDTO,
} from "../../types/exportTypes";
import MapCustom from "../../components/ui/MapaGoogle/MapCustom";
import type {
  MarkerData,
  PathData,
  CircleData,
} from "../../components/ui/MapaGoogle/MapCustom";
import dayjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// --- INTERFACES ---
interface UserCounts {
  administradores: number;
  supervisores: number;
  vendedores: number;
}
interface SupervisorVendedorCount {
  supervisor: string;
  vendedores: number;
}

interface AsistenciaConNombre extends AsistenciaResponseDTO {
  nombreVendedor: string;
}

const DashboardPage = () => {
  // --- HOOKS ---
  const {
    usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useUsuariosData();
  const {
    asignaciones,
    loading: loadingAsignaciones,
    error: errorAsignaciones,
  } = useAsignacionSupervisorVendedor();
  const {
    direcciones,
    loading: loadingDirecciones,
    error: errorDirecciones,
  } = useDireccionCliente();
  const {
    obtenerAsistencias,
    loading: loadingAsistenciasHook,
    error: errorAsistenciasHook,
  } = useAsistencia();
  const {
    seguimientos,
    loading: loadingSeguimientos,
    error: errorSeguimientos,
    obtenerTodosSeguimientosVendedoresHook,
  } = useSeguimientoVendedor();

  // --- STATES ---
  const [userCounts, setUserCounts] = useState<UserCounts>({
    administradores: 0,
    supervisores: 0,
    vendedores: 0,
  });
  const [lastRegisteredUsers, setLastRegisteredUsers] = useState<
    UsuarioResponseDTO[]
  >([]);
  const [supervisorVendedorData, setSupervisorVendedorData] = useState<
    SupervisorVendedorCount[]
  >([]);
  const [asistencias, setAsistencias] = useState<AsistenciaConNombre[]>([]);
  const [asistenciaMarkers, setAsistenciaMarkers] = useState<MarkerData[]>([]);
  const [clienteMarkers, setClienteMarkers] = useState<MarkerData[]>([]);
  const [rawAsistencias, setRawAsistencias] = useState<AsistenciaResponseDTO[]>(
    []
  );
  const [seguimientoMarkers, setSeguimientoMarkers] = useState<MarkerData[]>(
    []
  );
  const [seguimientoPaths, setSeguimientoPaths] = useState<PathData[]>([]);
  const [seguimientoCircles, setSeguimientoCircles] = useState<CircleData[]>(
    []
  );
  const [selectedVendedorId ] = useState<number>(0);

  // --- EFFECTS ---
  // Fetch Asistencias
  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await obtenerAsistencias();
        setRawAsistencias(data || []);
      } catch (e) {
        setRawAsistencias([]);
      }
    };
    fetchAsistencias();
  }, [obtenerAsistencias]);

  useEffect(() => {
    obtenerTodosSeguimientosVendedoresHook();
    const interval = setInterval(() => {
      obtenerTodosSeguimientosVendedoresHook();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Process Data
  useEffect(() => {
    // Procesar Usuarios
    if (usuarios && usuarios.length > 0) {
      const activeUsers = usuarios.filter((u) => u.usrEstadoDel);

      const counts = activeUsers.reduce(
        (acc, user) => {
          if (user.roles?.includes("ADMINISTRADOR")) acc.administradores += 1;
          if (user.roles?.includes("SUPERVISOR")) acc.supervisores += 1;
          if (user.roles?.includes("VENDEDOR")) acc.vendedores += 1;
          return acc;
        },
        { administradores: 0, supervisores: 0, vendedores: 0 }
      );

      setUserCounts(counts);

      const sortedUsers = [...usuarios].sort((a, b) => b.usrId - a.usrId);
      setLastRegisteredUsers(sortedUsers.slice(0, 5));

    }

    // Procesar Asignaciones
    if (asignaciones && asignaciones.length > 0) {
      const activeAsignaciones = asignaciones.filter((a) => a.asvEstadoDel);

      const data = activeAsignaciones.reduce((acc, asignacion) => {
        const supervisor = asignacion.nombreSupervisor || "Sin asignar";
        if (!acc[supervisor]) {
          acc[supervisor] = { supervisor, vendedores: 0 };
        }
        acc[supervisor].vendedores += 1;
        return acc;
      }, {} as Record<string, SupervisorVendedorCount>);

      const supervisorData = Object.values(data);
      setSupervisorVendedorData(supervisorData);
    }

    // Procesar Direcciones de Clientes
    if (direcciones && direcciones.length > 0) {
      const validDirecciones = direcciones.filter(
        (d) =>
          d.dirClEstadoDel &&
          d.dirClLatitud &&
          d.dirClLongitud &&
          !isNaN(d.dirClLatitud) &&
          !isNaN(d.dirClLongitud)
      );

      const markers = validDirecciones.map(
        (direccion): MarkerData => ({
          position: {
            lat: Number(direccion.dirClLatitud),
            lng: Number(direccion.dirClLongitud),
          },
          type: "client",
          title: `Cliente: ${direccion.nombreCliente || "Sin nombre"}`,
          info: {
            title: `🏢 ${direccion.nombreCliente || "Sin nombre"}`,
            content: {
              nombreSucursal:
                direccion.dirClNombreSucursal ?? "Sin información",
              nombreCliente: direccion.nombreCliente ?? "Sin información",
              direccion: direccion.dirClDireccion || "Sin dirección",
              nombreZona: direccion.nombreZona ?? "Sin información",
              latitud: direccion.dirClLatitud,
              longitud: direccion.dirClLongitud,
            },
          },
        })
      );
      setClienteMarkers(markers);
    }

    // Procesar Asistencias
    if (
      rawAsistencias &&
      rawAsistencias.length > 0 &&
      usuarios &&
      usuarios.length > 0
    ) {
      const asistenciasConNombre = rawAsistencias.map((asistencia) => {
        const nombre =
          asistencia.nombreVendedor ||
          usuarios.find((u) => u.vendedorId === asistencia.venId)
            ?.usrNombreCompleto ||
          "Desconocido";
        return {
          ...asistencia,
          nombreVendedor: nombre,
        };
      });

      setAsistencias(asistenciasConNombre);

      const validAsistencias = asistenciasConNombre.filter(
        (a) =>
          a.asiLatitud &&
          a.asiLongitud &&
          !isNaN(a.asiLatitud) &&
          !isNaN(a.asiLongitud)
      );

      const markers = validAsistencias.map(
        (asistencia): MarkerData => ({
          position: {
            lat: Number(asistencia.asiLatitud),
            lng: Number(asistencia.asiLongitud),
          },
          type: "vendor",
          title: `Asistencia de ${asistencia.nombreVendedor}`,
          info: {
            title: `${asistencia.nombreVendedor}`,
            content: {
              nombreVendedor: asistencia.nombreVendedor,
              direccion: `Entrada: ${dayjs(asistencia.asiHoraEntrada).format(
                "HH:mm A"
              )}${
                asistencia.asiHoraSalida
                  ? ` | Salida: ${dayjs(asistencia.asiHoraSalida).format(
                      "HH:mm A"
                    )}`
                  : ""
              }`,
              latitud: asistencia.asiLatitud,
              longitud: asistencia.asiLongitud,
            },
          },
        })
      );

      setAsistenciaMarkers(markers);
    }
  }, [usuarios, asignaciones, direcciones, rawAsistencias]);

  useEffect(() => {
    if (seguimientos && seguimientos.length > 0) {
      const filteredSeguimientos =
        selectedVendedorId === 0
          ? seguimientos
          : seguimientos.filter((seg) => seg.venId === selectedVendedorId);

      const seguimientosPorVendedor = filteredSeguimientos.reduce(
        (acc, seg) => {
          if (!acc[seg.venId]) {
            acc[seg.venId] = [];
          }
          acc[seg.venId].push(seg);
          return acc;
        },
        {} as { [key: number]: SeguimientoVendedorResponseDTO[] }
      );

      const colors = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FF33A1",
        "#A133FF",
        "#33FFA1",
        "#FFC300",
        "#C70039",
      ];
      let colorIndex = 0;
      const vendedorColors: { [key: number]: string } = {};

      Object.keys(seguimientosPorVendedor).forEach((venId) => {
        const numericVenId = Number(venId);
        if (!vendedorColors[numericVenId]) {
          vendedorColors[numericVenId] = colors[colorIndex % colors.length];
          colorIndex++;
        }
      });

      const markers: MarkerData[] = Object.values(seguimientosPorVendedor).map(
        (vendedorSeguimientos) => {
          const ultimoSeguimiento =
            vendedorSeguimientos[vendedorSeguimientos.length - 1];
          return {
            position: {
              lat: ultimoSeguimiento.segLatitud,
              lng: ultimoSeguimiento.segLongitud,
            },
            type: "vendor",
            title: `Vendedor: ${ultimoSeguimiento.vendedorNombre}`,
            info: {
              title: `🚚 ${ultimoSeguimiento.vendedorNombre}`,
              content: {
                nombreVendedor: ultimoSeguimiento.vendedorNombre,
                latitud: ultimoSeguimiento.segLatitud,
                longitud: ultimoSeguimiento.segLongitud,
              },
            },
          };
        }
      );

      const paths: PathData[] = Object.values(seguimientosPorVendedor).map(
        (vendedorSeguimientos) => {
          const venId = vendedorSeguimientos[0].venId;
          return {
            path: vendedorSeguimientos.map((seg) => ({
              lat: seg.segLatitud,
              lng: seg.segLongitud,
            })),
            strokeColor: vendedorColors[venId],
          };
        }
      );

      const circles: CircleData[] = Object.values(seguimientosPorVendedor)
        .flat()
        .map((seg) => {
          const color = vendedorColors[seg.venId];
          return {
            center: { lat: seg.segLatitud, lng: seg.segLongitud },
            radius: 15, // Radio para el punto
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1,
          };
        });
      setSeguimientoMarkers(markers);
      setSeguimientoPaths(paths);
      setSeguimientoCircles(circles);
    } else {
      setSeguimientoMarkers([]);
      setSeguimientoPaths([]);
      setSeguimientoCircles([]);
    }
  }, [seguimientos, selectedVendedorId]);

  // --- LOADING & ERROR ---
  const loading =
    loadingUsuarios ||
    loadingAsignaciones ||
    loadingDirecciones ||
    loadingAsistenciasHook ||
    loadingSeguimientos;
  const error =
    errorUsuarios ||
    errorAsignaciones ||
    errorDirecciones ||
    errorAsistenciasHook ||
    errorSeguimientos;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Typography color="error" variant="h6">
              ❌ Error al cargar los datos
            </Typography>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  console.log("Datos para la tabla de asistencia:", asistencias);

  // --- RENDER ---
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <TrendingUpIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Box>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen general del sistema
          </Typography>
        </Box>
      </Box>

      {/* SECCIÓN: CONTEO DE USUARIOS */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Administradores Activos
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {userCounts.administradores}
                  </Typography>
                </Box>
                <AdminPanelSettingsIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Supervisores Activos
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {userCounts.supervisores}
                  </Typography>
                </Box>
                <SupervisorAccountIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Vendedores Activos
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {userCounts.vendedores}
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECCIÓN: SEGUIMIENTO DE VENDEDORES */}
      <Typography
        component="h2"
        variant="h5"
        gutterBottom
        mt={4}
        mb={3}
        fontWeight="bold"
      >
        🚚 Seguimiento de Vendedores en Tiempo Real
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, maxWidth: 400 }}>
              </Box>
              {seguimientoMarkers.length > 0 ? (
                <Box sx={{ height: 500 }}>
                  <MapCustom
                    markers={[...seguimientoMarkers, ...clienteMarkers]}
                    paths={seguimientoPaths}
                    circles={seguimientoCircles}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    No hay datos de seguimiento de vendedores para mostrar.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* SECCIÓN: USUARIOS Y ASIGNACIONES */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              📊 Usuarios por Rol
            </Typography>
            {userCounts.administradores +
              userCounts.supervisores +
              userCounts.vendedores >
            0 ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Administradores", "Supervisores", "Vendedores"],
                    categoryGapRatio: 0.5,
                  },
                ]}
                series={[
                  {
                    data: [
                      userCounts.administradores,
                      userCounts.supervisores,
                      userCounts.vendedores,
                    ],
                    label: "Cantidad",
                    color: "#667eea",
                  },
                ]}
                height={320}
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">
                  No hay datos de usuarios para mostrar
                </Typography>
              </Box>
            )}
          </CardContent>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Últimos Usuarios Registrados
              </Typography>
              {lastRegisteredUsers.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Nombre</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Correo</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Rol</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lastRegisteredUsers.map((u) => (
                        <TableRow key={u.usrId} hover>
                          <TableCell>{u.usrNombreCompleto}</TableCell>
                          <TableCell sx={{ fontSize: "0.85rem" }}>
                            {u.usrCorreo}
                          </TableCell>
                          <TableCell>
                            {u.roles?.map((rol, idx) => (
                              <Chip
                                key={idx}
                                label={rol}
                                size="small"
                                sx={{ mr: 0.5, fontSize: "0.7rem" }}
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography color="text.secondary">
                    No hay usuarios registrados
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECCIÓN: ASIGNACIONES SUPERVISOR -> VENDEDOR */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                👥 Vendedores por Supervisor
              </Typography>
              {supervisorVendedorData.length > 0 ? (
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: supervisorVendedorData.map((d) => d.supervisor),
                      categoryGapRatio: 0.4,
                    },
                  ]}
                  series={[
                    {
                      data: supervisorVendedorData.map((d) => d.vendedores),
                      label: "Vendedores",
                      color: "#f5576c",
                    },
                  ]}
                  height={320}
                  margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                />
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography color="text.secondary">
                    No hay asignaciones para mostrar
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                📋 Tabla de Asignaciones
              </Typography>
              {supervisorVendedorData.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Supervisor</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>N° Vendedores</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supervisorVendedorData.map((d) => (
                        <TableRow key={d.supervisor} hover>
                          <TableCell>{d.supervisor}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={d.vendedores}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography color="text.secondary">
                    No hay asignaciones
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECCIÓN: ASISTENCIA DEL DÍA */}
      <Typography
        component="h2"
        variant="h5"
        gutterBottom
        mt={4}
        mb={3}
        fontWeight="bold"
      >
        📅 Asistencia del Día
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                📍 Ubicación de marcación a visitas
              </Typography>
              {asistenciaMarkers.length > 0 ? (
                <Box sx={{ height: 400 }}>
                  <MapCustom markers={asistenciaMarkers} />
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    No hay asistencias registradas hoy
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                ✅ Vendedores con Asistencia Hoy
              </Typography>
              {asistencias.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Vendedor</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Hora Entrada</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Hora Salida</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {asistencias.map((a) => (
                        <TableRow key={a.asiId} hover>
                          <TableCell>{a.nombreVendedor}</TableCell>
                          <TableCell>
                            <Chip
                              label={dayjs(a.asiHoraEntrada).format("HH:mm A")}
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            {a.asiHoraSalida ? (
                              <Chip
                                label={dayjs(a.asiHoraSalida).format("HH:mm A")}
                                size="small"
                                color="error"
                              />
                            ) : (
                              <Chip
                                label="Pendiente"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography color="text.secondary">
                    No hay registros de asistencia
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECCIÓN: UBICACIÓN DE CLIENTES */}
      <Typography
        component="h2"
        variant="h5"
        gutterBottom
        mt={4}
        mb={3}
        fontWeight="bold"
      >
        🏢 Ubicación de Clientes
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent>
              {clienteMarkers.length > 0 ? (
                <Box sx={{ height: 500 }}>
                  <MapCustom markers={clienteMarkers} />
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    No hay clientes con ubicación registrada
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
