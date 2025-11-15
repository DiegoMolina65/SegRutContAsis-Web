import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Stack, Chip } from "@mui/material";
import {
  RouteOutlined,
  VisibilityOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { useVisita, useRuta } from "../../../hooks/exportHooks";
import {
  SelectCustom,
  TableCustom,
} from "../../../components/ui/exportComponentsUI";
import type { VisitaResponseDTO } from "../../../types/exportTypes";
import type { Column } from "../../../components/ui/TableCustom";

const VerVisitasPorRuta = () => {
  const [selectedRuta, setSelectedRuta] = useState<number | null>(null);
  const { visitas, filtrarVisitasPorRuta } = useVisita();
  const { rutas, obtenerRutasHook } = useRuta();

  useEffect(() => {
    obtenerRutasHook();
  }, [obtenerRutasHook]);

  useEffect(() => {
    if (selectedRuta) {
      filtrarVisitasPorRuta(selectedRuta);
    }
  }, [selectedRuta, filtrarVisitasPorRuta]);

  const columns: Column<VisitaResponseDTO>[] = [
    { field: "visId", headerName: "VISITA ID", width: 80 },
    { field: "nombreVendedor", headerName: "NOMBRE VENDEDOR", width: 200 },
    { field: "nombreCliente", headerName: "NOMBRE CLIENTE", width: 200 },
    { field: "nombreRuta", headerName: "NOMBRE RUTA", width: 200 },
    { field: "fechaEjecucionRuta", headerName: "EJECUCIÓN RUTA", width: 200 },
    { field: "nombreSucursalCliente", headerName: "NOMBRE SUCUSAL", width: 200 },
    { field: "nombreZona", headerName: "NOMBRE ZONA", width: 200 },
    { field: "visComentario", headerName: "COMENTARIO", width: 300 },
  ];

  const selectedRutaData = rutas.find(r => r.rutId === selectedRuta);

  const uniqueClientes = new Set(visitas.map(v => v.nombreCliente)).size;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
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
            <RouteOutlined sx={{ fontSize: 24, color: "#475569" }} />
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
              Visitas por Ruta
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Consulte el historial de visitas realizadas en cada ruta
            </Typography>
          </Box>
        </Stack>
      </Box>

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
              <PlaceOutlined sx={{ fontSize: 18, color: "#475569" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Seleccionar Ruta
            </Typography>
          </Stack>

          <SelectCustom
            label="Ruta"
            value={selectedRuta ?? ""}
            onChange={(value) => {
              setSelectedRuta(
                value === "" || value === null ? null : Number(value)
              );
            }}
            options={rutas.map((ruta) => ({
              value: ruta.rutId,
              label: `${ruta.rutNombre} - ${ruta.nombreVendedor}`,
            }))}
            sx={{ mb: 0 }}
          />

          {selectedRutaData && (
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
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RouteOutlined
                    sx={{
                      color: "white",
                      fontSize: "1.25rem",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.938rem",
                    }}
                  >
                    {selectedRutaData.rutNombre}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.813rem",
                    }}
                  >
                    Ruta seleccionada
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

      {selectedRuta && visitas.length > 0 && (
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
                  <PlaceOutlined sx={{ fontSize: 20, color: "#16a34a" }} />
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
        </Stack>
      )}

      {selectedRuta ? (
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
                <RouteOutlined sx={{ fontSize: 40, color: "#94a3b8" }} />
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
                  Seleccione una Ruta
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  Para ver el historial de visitas, seleccione una ruta del menú desplegable superior
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VerVisitasPorRuta;