import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Card, CardContent, Stack, Chip, Avatar } from "@mui/material";
import {
  PersonOutlined,
  VisibilityOutlined,
  TrendingUpOutlined,
  BadgeOutlined,
  MapOutlined,
} from "@mui/icons-material";
import { useVisita } from "../../../hooks/exportHooks";
import { useUsuariosData } from "../../../hooks/Usuario/useUsuariosData";
import {
  SelectCustom,
  TableCustom,
  MapCustom,
} from "../../../components/ui/exportComponentsUI";
import type { VisitaResponseDTO } from "../../../types/exportTypes";
import type { Column } from "../../../components/ui/TableCustom";
import type {
  MarkerData,
  InfoWindowData,
  PathData,
} from "../../../components/ui/MapaGoogle/MapCustom";

const VerVisitasPorVendedor = () => {
  const [selectedVendedor, setSelectedVendedor] = useState<number | null>(null);
  const { visitas, filtrarVisitasPorVendedor } = useVisita();
  const { vendedores } = useUsuariosData();

  useEffect(() => {
    if (selectedVendedor) {
      filtrarVisitasPorVendedor(selectedVendedor);
    }
  }, [selectedVendedor, filtrarVisitasPorVendedor]);

  const columns: Column<VisitaResponseDTO>[] = [
    { field: "visId", headerName: "VISITA ID", width: 80 },
    { field: "nombreCliente", headerName: "NOMBRE CLIENTE", width: 200 },
    { field: "nombreRuta", headerName: "NOMBRE RUTA", width: 200 },
    { field: "fechaEjecucionRuta", headerName: "EJECUCIÓN RUTA", width: 200 },
    { field: "nombreSucursalCliente", headerName: "NOMBRE SUCUSAL", width: 200 },
    { field: "nombreZona", headerName: "NOMBRE ZONA", width: 200 },
    { field: "visComentario", headerName: "COMENTARIO", width: 300 },
  ];

  const selectedVendedorData = vendedores.find(v => v.vendedorId === selectedVendedor);
  const uniqueClientes = new Set(visitas.map(v => v.nombreCliente)).size;
  const uniqueSucursales = new Set(visitas.map(v => v.nombreSucursalCliente)).size;

  const { mapMarkers, mapPaths } = useMemo(() => {

    const newMarkers: MarkerData[] = [];
    const newPaths: PathData[] = [
      {
        path: [],
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      },
    ];

    const uniqueLocations = new Map<string, VisitaResponseDTO>();

    let visitOrder = 1;
    uniqueLocations.forEach((visita) => {
      if (visita.sucursalLatitud && visita.sucursalLongitud) {
        const info: InfoWindowData = {
          title: "Ubicación del Cliente",
          content: {
            nombreCliente: visita.nombreCliente,
            nombreSucursal: visita.nombreSucursalCliente,
            direccion: visita.direccion,
            nombreZona: visita.nombreZona || "No visible",
            latitud: visita.sucursalLatitud,
            longitud: visita.sucursalLongitud,
          },
        };

        newMarkers.push({
          position: {
            lat: visita.sucursalLatitud,
            lng: visita.sucursalLongitud,
          },
          type: "client",
          title: visita.nombreSucursalCliente,
          id: `client-${visita.visId}`,
          info,
          label: visitOrder.toString(),
        });

        newPaths[0].path.push({
          lat: visita.sucursalLatitud,
          lng: visita.sucursalLongitud,
        });

        visitOrder++;
      }
    });

    return { mapMarkers: newMarkers, mapPaths: newPaths };
  }, [visitas]);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BadgeOutlined sx={{ fontSize: 24, color: "#475569" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "2rem" },
                letterSpacing: "-0.5px",
              }}
            >
              Visitas por Vendedor
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Consulte el historial de visitas realizadas por cada vendedor
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Filtro de Vendedor */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlined sx={{ fontSize: 18, color: "#475569" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Seleccionar Vendedor
            </Typography>
          </Stack>

          <SelectCustom
            label="Vendedor"
            value={selectedVendedor ?? ""}
            onChange={(value) => {
              setSelectedVendedor(
                value === "" || value === null ? null : Number(value)
              );
            }}
            options={vendedores.map((vendedor) => ({
              value: vendedor.vendedorId ?? "",
              label: vendedor.usrNombreCompleto,
            }))}
            sx={{ mb: 0 }}
          />

          {/* Info del vendedor seleccionado */}
          {selectedVendedorData && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#1e293b",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {selectedVendedorData.usrNombreCompleto.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.938rem",
                    }}
                  >
                    {selectedVendedorData.usrNombreCompleto}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.813rem",
                    }}
                  >
                    Vendedor seleccionado
                  </Typography>
                </Box>
                <Chip
                  label={`${visitas.length} ${visitas.length === 1 ? 'visita' : 'visitas'}`}
                  size="small"
                  sx={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.813rem",
                  }}
                />
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      {selectedVendedor && visitas.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VisibilityOutlined sx={{ fontSize: 20, color: "#3b82f6" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Total de Visitas
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {visitas.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonOutlined sx={{ fontSize: 20, color: "#16a34a" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Clientes Visitados
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {uniqueClientes}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUpOutlined sx={{ fontSize: 20, color: "#f59e0b" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 0.5, fontSize: "0.813rem" }}
                  >
                    Sucursales
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    {uniqueSucursales}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {selectedVendedor && visitas.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapOutlined sx={{ fontSize: 18, color: "#475569" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Mapa de Clientes
              </Typography>
            </Stack>
            <Box sx={{ height: 500 }}>
              <MapCustom markers={mapMarkers} paths={mapPaths} />
            </Box>
          </CardContent>
        </Card>
      )}

      {selectedVendedor ? (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableCustom
              columns={columns}
              rows={visitas.map(v => ({ ...v, id: v.visId }))}
              title="Historial de Visitas"
            />
          </CardContent>
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BadgeOutlined sx={{ fontSize: 40, color: "#94a3b8" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Seleccione un Vendedor
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  Para ver el historial de visitas, seleccione un vendedor del menú desplegable superior
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VerVisitasPorVendedor;