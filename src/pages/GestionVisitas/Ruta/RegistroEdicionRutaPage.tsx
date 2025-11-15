import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Box,
  Typography,
  CardContent,
  InputAdornment,
  Stack,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import { RouteOutlined, CommentOutlined } from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  InputTextCustom,
  SelectCustom,
  CardCustom,
  DatePickerCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useRuta, useUsuariosData } from "../../../hooks/exportHooks";
import type { RutaRequestDTO } from "../../../types/exportTypes";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface FormValues {
  venId: number | null;
  supId?: number | null;
  nombre: string;
  comentario?: string | null;
  fechaEjecucion: string;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    venId: yup
      .number()
      .min(1, "El vendedor es obligatorio")
      .required("El vendedor es obligatorio"),
    supId: yup.number().nullable(),
    nombre: yup.string().required("El nombre de la ruta es obligatorio"),
    comentario: yup.string().nullable(),
    fechaEjecucion: yup
      .string()
      .required("La fecha de ejecución es obligatoria"),
  })
  .required();

const diasSemanaOptions = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
  { value: "OTRO", label: "OTRO" },
];

const RegistroEdicionRutaPage = () => {
  const [loading, setLoading] = useState(false);
  const [esOtro, setEsOtro] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const { crearNuevaRuta, actualizarRutaExistente, obtenerRutaPorIdHook } =
    useRuta();
  const { vendedores, supervisores } = useUsuariosData();

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
      venId: null,
      supId: null,
      nombre: "",
      comentario: "",
      fechaEjecucion: "",
    },
  });

  const vendedorOptions = useMemo(
    () =>
      vendedores.map((v) => ({
        value: v.vendedorId ?? "",
        label: v.usrNombreCompleto,
      })),
    [vendedores]
  );

  const supervisorOptions = useMemo(
    () =>
      supervisores.map((s) => ({
        value: s.supervisorId ?? "",
        label: s.usrNombreCompleto,
      })),
    [supervisores]
  );

  useEffect(() => {
    if (isEditMode && id) {
      const fetchRuta = async () => {
        try {
          const data = await obtenerRutaPorIdHook(Number(id));
          if (data) {
            reset({
              venId: data.venId,
              supId: data.supId,
              nombre: data.rutNombre,
              comentario: data.rutComentario,
              fechaEjecucion: data.rutFechaEjecucion,
            });
            setEsOtro(data.rutNombre === "OTRO");
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error al cargar la ruta.",
            severity: "error",
          });
        }
      };
      fetchRuta();
    } else {
      reset({
        venId: null,
        supId: null,
        nombre: "",
        comentario: "",
      });
      setEsOtro(false);
    }
  }, [isEditMode, id, reset, obtenerRutaPorIdHook]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload: RutaRequestDTO = {
        venId: data.venId!,
        supId: data.supId,
        rutNombre: data.nombre,
        rutComentario: data.comentario,
        rutFechaEjecucion: data.fechaEjecucion,
      };

      if (isEditMode && id) {
        await actualizarRutaExistente(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Ruta actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => navigate("/ruta/registradas"), 2000);
      } else {
        await crearNuevaRuta(payload);
        setSnackbar({
          open: true,
          message: "Ruta registrada correctamente.",
          severity: "success",
        });
        reset();
        setEsOtro(false);
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
        sx={{ minHeight: "100vh", backgroundColor: "#ffffff", py: 6, px: 2 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, textAlign: "center" }}>
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
              <RouteOutlined sx={{ fontSize: 32, color: "white" }} />
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
              {isEditMode ? "Editar Ruta" : "Registro de Ruta"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "1rem" }}
            >
              {isEditMode
                ? "Actualice la información de la ruta."
                : "Complete la información requerida para crear una nueva ruta en el sistema"}
            </Typography>
          </Box>

          <CardCustom
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
                      Información de la Ruta
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <>
                            <SelectCustom
                              label="Nombre de la Ruta"
                              value={esOtro ? "OTRO" : field.value || ""}
                              onChange={(value) => {
                                if (value === "OTRO") {
                                  setEsOtro(true);
                                  field.onChange("");
                                } else {
                                  setEsOtro(false);
                                  field.onChange(value);
                                }
                              }}
                              options={diasSemanaOptions}
                              error={!!errors.nombre}
                              helperText={errors.nombre?.message}
                              renderValue={(selected) =>
                                selected ? selected : <em>Seleccione...</em>
                              }
                            />
                            {esOtro && (
                              <Box sx={{ mt: 2 }}>
                                <InputTextCustom
                                  label="Ingrese nombre de la ruta"
                                  fullWidth
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  error={!!errors.nombre}
                                  helperText={errors.nombre?.message}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: "#f8fafc",
                                    },
                                  }}
                                />
                              </Box>
                            )}
                          </>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="venId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            label="Vendedor"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(Number(value))}
                            options={vendedorOptions}
                            error={!!errors.venId}
                            helperText={errors.venId?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="supId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            label="Supervisor (Opcional)"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value)}
                            options={
                              supervisorOptions.length > 0
                                ? supervisorOptions
                                : [{ value: "", label: "Cargando..." }]
                            }
                            error={!!errors.supId}
                            helperText={errors.supId?.message}
                            renderValue={(selected) =>
                              selected ? (
                                supervisorOptions.find(
                                  (o) => o.value === selected
                                )?.label
                              ) : (
                                <em>Seleccione...</em>
                              )
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name="comentario"
                        control={control}
                        render={({ field }) => (
                          <InputTextCustom
                            {...field}
                            fullWidth
                            label="Comentario (Opcional)"
                            multiline
                            rows={4}
                            error={!!errors.comentario}
                            helperText={errors.comentario?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CommentOutlined
                                    sx={{ color: "#94a3b8", fontSize: 20 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="fechaEjecucion"
                      control={control}
                      render={({ field }) => (
                        <DatePickerCustom
                          label="Fecha de Ejecución"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date: Dayjs | null) => {
                            field.onChange(
                              date ? date.startOf("day").toISOString() : ""
                            );
                          }}
                          error={!!errors.fechaEjecucion}
                          required
                        />
                      )}
                    />
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
                      "&:hover": { backgroundColor: "#0f172a" },
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                    loading={loading}
                    type="submit"
                  >
                    {isEditMode ? "Actualizar Ruta" : "Registrar Ruta"}
                  </ButtonCustom>
                </Box>
              </Box>
            </CardContent>
          </CardCustom>
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

export default RegistroEdicionRutaPage;
