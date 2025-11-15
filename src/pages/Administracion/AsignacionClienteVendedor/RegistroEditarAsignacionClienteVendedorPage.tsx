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
  CardContent,
  Stack,
} from "@mui/material";
import type { AlertColor } from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  PeopleAltOutlined,
  AssignmentIndOutlined,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  SelectCustom,
  CardCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useAsignacionClienteVendedor,
  useCliente,
  useUsuariosData,
} from "../../../hooks/exportHooks";
import type { AsignacionClienteVendedorRequestDTO } from "../../../types/exportTypes";

interface FormValues {
  supId: number | null;
  venId: number | null;
  clId: number | null;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    supId: yup
      .number()
      .typeError("El supervisor es obligatorio")
      .min(1, "El supervisor es obligatorio")
      .required("El supervisor es obligatorio"),
    venId: yup
      .number()
      .typeError("El vendedor es obligatorio")
      .min(1, "El vendedor es obligatorio")
      .required("El vendedor es obligatorio"),
    clId: yup
      .number()
      .typeError("El cliente es obligatorio")
      .min(1, "El cliente es obligatorio")
      .required("El cliente es obligatorio"),
  })
  .required();

const RegistroEditarAsignacionClienteVendedorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const {
    crearAsignacionHook,
    actualizarAsignacionHook,
    obtenerAsignacionPorIdHook,
    loading,
  } = useAsignacionClienteVendedor();
  const { clientes, obtenerClientesHook } = useCliente();
  const { supervisores, vendedores } = useUsuariosData();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
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
      supId: null,
      venId: null,
      clId: null,
    },
  });

  useEffect(() => {
    obtenerClientesHook();
  }, [obtenerClientesHook]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchAsignacion = async () => {
        try {
          const data = await obtenerAsignacionPorIdHook(Number(id));
          if (data) {
            reset({
              supId: data.supId,
              venId: data.venId,
              clId: data.clId,
            });
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error al cargar la asignación.",
            severity: "error",
          });
        }
      };
      fetchAsignacion();
    } else if (!isEditMode) {
      reset({
        supId: null,
        venId: null,
        clId: null,
      });
    }
  }, [isEditMode, id, reset, obtenerAsignacionPorIdHook]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload: AsignacionClienteVendedorRequestDTO = {
        supId: Number(data.supId),
        venId: Number(data.venId),
        clId: Number(data.clId),
      };

      if (isEditMode && id) {
        await actualizarAsignacionHook(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Asignación actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/asignacionclientevendedor/registrados");
        }, 2000);
      } else {
        await crearAsignacionHook(payload);
        setSnackbar({
          open: true,
          message: "Asignación registrada correctamente.",
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
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: "100vh", backgroundColor: "#ffffff", py: 6, px: 2 }}
      >
        <Container maxWidth="md">
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
              <AssignmentIndOutlined sx={{ fontSize: 32, color: "white" }} />
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
              {isEditMode
                ? "Editar Asignación"
                : "Registrar Asignación Cliente-Vendedor"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "1rem" }}
            >
              {isEditMode
                ? "Actualice la información de la asignación."
                : "Complete la información para asignar un cliente a un vendedor bajo un supervisor."}
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
                      <PeopleAltOutlined
                        sx={{ fontSize: 22, color: "#475569" }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Detalles de la Asignación
                    </Typography>
                  </Stack>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="supId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Supervisor"
                            error={!!errors.supId}
                            helperText={errors.supId?.message}
                            options={supervisores.map((s) => ({
                              value: s.supervisorId ?? "",
                              label: s.usrNombreCompleto,
                            }))}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="venId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Vendedor"
                            error={!!errors.venId}
                            helperText={errors.venId?.message}
                            options={vendedores.map((v) => ({
                              value: v.vendedorId ?? "",
                              label: v.usrNombreCompleto,
                            }))}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                      <Controller
                        name="clId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Cliente"
                            error={!!errors.clId}
                            helperText={errors.clId?.message}
                            options={clientes.map((c) => ({
                              value: c.clId,
                              label: c.clNombreCompleto,
                            }))}
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
                      "&:hover": { backgroundColor: "#0f172a" },
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                    loading={loading}
                    type="submit"
                  >
                    {isEditMode
                      ? "Actualizar Asignación"
                      : "Registrar Asignación"}
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

export default RegistroEditarAsignacionClienteVendedorPage;