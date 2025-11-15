
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
} from "@mui/material";


import {
  SupervisorAccountOutlined,
  PersonOutline,
} from "@mui/icons-material";

import {
  ButtonCustom,
  SnackbarCustom,
  SelectCustom,
} from "../../../components/ui/exportComponentsUI";
import { theme } from "../../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useAsignacionSupervisorVendedor, useUsuariosData } from "../../../hooks/exportHooks";
import type { AsignacionSupervisorVendedorResquestDTO } from "../../../types/exportTypes";

interface FormValues {
  supId: number | null;
  venId: number | null;
}

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    supId: yup.number().required("El supervisor es obligatorio").nullable(),
    venId: yup.number().required("El vendedor es obligatorio").nullable(),
  })
  .required();

const RegistroEditarAsignacionSupervisorVendedorPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const { addAsignacion, updateAsignacion, getAsignacionById } = useAsignacionSupervisorVendedor();
  const { supervisores, vendedores } = useUsuariosData();

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
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      supId: null,
      venId: null,
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchAsignacion = async () => {
        try {
          const data = await getAsignacionById(Number(id));
          if (data) {
            setValue("supId", data.supId);
            setValue("venId", data.venId);
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
    } else {
        reset({
            supId: null,
            venId: null,
        });
    }
  }, [isEditMode, id, reset, getAsignacionById, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const payload: AsignacionSupervisorVendedorResquestDTO = {
        supId: data.supId!,
        venId: data.venId!,
      };

      if (isEditMode && id) {
        await updateAsignacion(Number(id), payload);
        setSnackbar({
          open: true,
          message: "Asignación actualizada correctamente.",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/ruta/asignacion-supervisor-vendedor"); 
        }, 2000);
      } else {
        await addAsignacion(payload);
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
              <SupervisorAccountOutlined sx={{ fontSize: 32, color: "white" }} />
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
              {isEditMode ? "Editar Asignación" : "Registro de Asignación"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1rem",
              }}
            >
              {isEditMode
                ? "Actualice la información de la asignación."
                : "Complete la información requerida para crear una nueva asignación."}
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
                      <PersonOutline sx={{ fontSize: 22, color: "#475569" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1.125rem",
                      }}
                    >
                      Información de la Asignación
                    </Typography>
                  </Stack>

                      <Controller
                        name="supId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Supervisor"
                            options={supervisores.map((s) => ({
                              value: s.supervisorId ?? "",
                              label: s.usrNombreCompleto,
                            }))}
                            error={!!errors.supId}
                            helperText={errors.supId?.message}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />

                      <Controller
                        name="venId"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            label="Vendedor"
                            options={vendedores.map((v) => ({
                              value: v.vendedorId ?? "",
                              label: v.usrNombreCompleto,
                            }))}
                            error={!!errors.venId}
                            helperText={errors.venId?.message}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
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
                    {isEditMode ? "Actualizar Asignación" : "Registrar Asignación"}
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

export default RegistroEditarAsignacionSupervisorVendedorPage;
