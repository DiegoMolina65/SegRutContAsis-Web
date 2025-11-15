import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";

import { RouteOutlined, BusinessOutlined } from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  SelectCustom,
  InputTextCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useVisita,
  useRuta,
  useDireccionCliente,
} from "../../../hooks/exportHooks";
import type { VisitaRequestDTO } from "../../../types/exportTypes";

interface FormValues {
  rutId: number;
  dirClId: number;
  visComentario?: string;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    rutId: yup.number().required("La ruta es obligatoria"),
    dirClId: yup.number().required("La dirección del cliente es obligatoria"),
    visComentario: yup.string(),
  })
  .required();

const CrearEditarVisitasRutaCliente = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const { crearNuevaVisita, actualizarVisitaId, obtenerVisitaIdHook } =
    useVisita();
  const { rutas, obtenerRutasHook } = useRuta();
  const { direcciones, obtenerTodasDireccionesHook } = useDireccionCliente();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      rutId: undefined,
      dirClId: undefined,
      visComentario: "",
    },
  });

  useEffect(() => {
    obtenerRutasHook();
    obtenerTodasDireccionesHook();
  }, [obtenerRutasHook, obtenerTodasDireccionesHook]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchVisita = async () => {
        try {
          const data = await obtenerVisitaIdHook(Number(id));
          if (data) {
            reset({
              rutId: data.rutId,
              dirClId: data.dirClId,
              visComentario: data.visComentario || "",
            });
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error al cargar la visita.",
            severity: "error",
          });
        }
      };
      fetchVisita();
    } else {
      reset({
        rutId: undefined,
        dirClId: undefined,
        visComentario: "",
      });
    }
  }, [isEditMode, id, obtenerVisitaIdHook, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload: VisitaRequestDTO = {
        rutId: data.rutId,
        dirClId: data.dirClId,
        visComentario: data.visComentario,
      };

      if (isEditMode && id) {
        await actualizarVisitaId(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Visita actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/visitas/registradas");
        }, 2000);
      } else {
        await crearNuevaVisita(payload);
        setSnackbar({
          open: true,
          message: "Visita registrada correctamente.",
          severity: "success",
        });
        reset();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error en ${
          isEditMode ? "la actualización" : "el registro"
        }. Inténtalo nuevamente.`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          py: 6,
          px: 2,
          alignContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 2,
                backgroundColor: "#1e293b",
                mb: 2,
              }}
            >
              <BusinessOutlined sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                mb: 1,
                letterSpacing: "-0.5px",
              }}
            >
              {isEditMode ? "Editar Visita" : "Registro de Visita"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1rem",
              }}
            >
              {isEditMode
                ? "Actualice la información de la visita."
                : "Complete la información requerida para crear una nueva visita."}
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Box sx={{ mb: 4 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RouteOutlined sx={{ fontSize: 22, color: "#475569" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Información de la Visita
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={12}>
                      <Controller
                        name="rutId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Ruta"
                            options={rutas.map((ruta) => ({
                              value: ruta.rutId,
                              label: `${ruta.rutNombre} - ${ruta.nombreVendedor}`,
                            }))}
                            error={!!errors.rutId}
                            helperText={errors.rutId?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name="dirClId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Dirección del Cliente"
                            options={direcciones.map((dir) => ({
                              value: dir.dirClId,
                              label: `${dir.dirClDireccion} - ${dir.nombreCliente}`,
                            }))}
                            error={!!errors.dirClId}
                            helperText={errors.dirClId?.message}
                          />
                        )}
                      />
                    </Grid>
            
                    <Grid size={12}>
                      <Controller
                        name="visComentario"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            label="Comentario"
                            multiline
                            rows={4}
                            error={!!errors.visComentario}
                            helperText={errors.visComentario?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                  <ButtonCustom
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.5,
                      fontSize: "0.938rem",
                      fontWeight: 600,
                      textTransform: "none",
                      backgroundColor: "#1e293b",
                      "&:hover": {
                        backgroundColor: "#0f172a",
                      },
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                    loading={loading}
                    type="submit"
                  >
                    {isEditMode ? "Actualizar Visita" : "Registrar Visita"}
                  </ButtonCustom>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>

        <SnackbarCustom
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CrearEditarVisitasRutaCliente;
