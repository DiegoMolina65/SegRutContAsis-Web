import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import type { SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Box,
  Typography,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";
import type { AlertColor } from "@mui/material";
import { AssessmentOutlined, PeopleAltOutlined } from "@mui/icons-material";
import {
  ButtonCustom,
  SnackbarCustom,
  SelectCustom,
  CardCustom,
  InputTextCustom,
} from "../../components/ui/exportComponentsUI";
import { theme } from "../../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useReportesActividad,
  useUsuariosData,
} from "../../hooks/exportHooks";
import type { ReporteActividadRequestDTO } from "../../types/exportTypes";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


interface FormValues {
  supervisorId?: number | null;
  vendedorId?: number | null;
  fecha: Dayjs;
  nombreArchivo?: string;
}

const schema = yup.object().shape({
  supervisorId: yup.number().nullable().optional(),
  vendedorId: yup.number().nullable().optional(),
  fecha: yup
    .mixed<Dayjs>()
    .required("La fecha es obligatoria")
    .test("is-valid", "La fecha no es válida", (value) =>
      dayjs.isDayjs(value) && value.isValid()
    ),
  nombreArchivo: yup.string().optional(),
});


const ReporteAsistenciaDiariaPage = () => {
  const { vendedores } = useUsuariosData();
  const { generarAsistenciaDiaria, loading } = useReportesActividad();

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
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues, any>,
    defaultValues: {
      supervisorId: undefined,
      vendedorId: undefined,
      fecha: dayjs(),
      nombreArchivo: `Reporte_Asistencia_Diaria_${dayjs().format("YYYY-MM-DD")}.pdf`,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const fechaFormateada = data.fecha
        ? data.fecha.format("YYYY-MM-DD")
        : null;

      const payload: ReporteActividadRequestDTO = {
        tipoReporte: "asistencia-diaria",
        supervisorId: data.supervisorId || undefined,
        vendedorId: data.vendedorId || undefined,
        fechaInicio: fechaFormateada,
        fechaFin: fechaFormateada,
        nombreArchivo: data.nombreArchivo,
      };

      await generarAsistenciaDiaria(payload);

      setSnackbar({
        open: true,
        message: "Reporte generado y descarga iniciada.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al generar el reporte. Inténtalo nuevamente.",
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
              <AssessmentOutlined sx={{ fontSize: 32, color: "white" }} />
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
              Reporte de Asistencia Diaria
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "1rem" }}
            >
              Seleccione los filtros para generar el reporte de asistencia.
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
                onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
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
                      Filtros del Reporte
                    </Typography>
                  </Stack>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="vendedorId"
                          control={control}
                          render={({ field }) => (
                            <SelectCustom
                              {...field}
                              label="Vendedor"
                              error={!!errors.vendedorId}
                              helperText={errors.vendedorId?.message}
                              options={vendedores.map((v) => ({
                                value: v.vendedorId ?? "",
                                label: v.usrNombreCompleto,
                              }))}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="fecha"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              {...field}
                              label="Fecha del Reporte"
                              format="YYYY/MM/DD"
                              slotProps={{
                                textField: {
                                  error: !!error,
                                  helperText: error ? error.message : null,
                                  fullWidth: true,
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="nombreArchivo"
                          control={control}
                          render={({ field }) => (
                            <InputTextCustom
                              {...field}
                              label="Nombre del Archivo"
                              error={!!errors.nombreArchivo}
                              helperText={errors.nombreArchivo?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
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
                    Generar Reporte
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

export default ReporteAsistenciaDiariaPage;