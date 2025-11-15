import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Route as RouteIcon,
  Assessment as AssessmentIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  AdminPanelSettingsOutlined,
  BusinessOutlined,
  AddCircleOutlineOutlined,
  ListAltOutlined,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useUsuario } from "../../../hooks/exportHooks";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  // Estados de administración
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openAdminTransacciones, setOpenAdminTransacciones] = useState(false);
  const [openAdminMantenimiento, setOpenAdminMantenimiento] = useState(false);

  // Estados de visitas
  const [openVisitas, setOpenVisitas] = useState(false);
  const [openVisitasTransacciones, setOpenVisitasTransacciones] =
    useState(false);
  const [openVisitasMantenimiento, setOpenVisitasMantenimiento] =
    useState(false);
  const [openReportes, setOpenReportes] = useState(false);

  const { logout, user: usuario } = useUsuario();
  const location = useLocation();
  const esSupervisor = usuario?.roles?.includes("SUPERVISOR");

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
        },
      }}
    >
      {/* Header del Sidebar */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#fafafa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              backgroundColor: "#1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <BusinessOutlined sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#1e293b",
              fontWeight: 700,
              fontSize: "1.125rem",
              flex: 1,
            }}
          >
            Sistema
          </Typography>
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: "#64748b",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            backgroundColor: "white",
            borderRadius: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#1e293b",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {usuario?.usrNombreCompleto?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {usuario?.usrNombreCompleto || "Usuario"}
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              {usuario?.roles?.join(", ") || ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List component="nav" sx={{ px: 1 }}>
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={location.pathname === "/dashboard"}
            sx={{
              borderRadius: 1.5,
              mb: 1.5,
              py: 1.25,
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              "&.Mui-selected": {
                backgroundColor: "#1e293b",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0f172a",
                },
                "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DashboardIcon sx={{ color: "#475569", fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
              }}
            />
          </ListItemButton>
          {/* ADMINISTRACIÓN */}
          <ListItemButton
            onClick={() => setOpenAdmin(!openAdmin)}
            sx={{
              borderRadius: 1.5,
              mb: 1.5,
              py: 1.25,
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              ...(openAdmin && {
                backgroundColor: "#f8fafc",
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AdminPanelSettingsOutlined
                sx={{ color: "#475569", fontSize: 22 }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Administración"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
              }}
            />
            {openAdmin ? (
              <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            )}
          </ListItemButton>

          <Collapse in={openAdmin} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1 }}>
              {/* Transacciones de Administración */}
              <ListItemButton
                onClick={() =>
                  setOpenAdminTransacciones(!openAdminTransacciones)
                }
                sx={{
                  borderRadius: 1.5,
                  mb: 1,
                  py: 1,
                  pl: 2,
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AddCircleOutlineOutlined
                    sx={{ color: "#64748b", fontSize: 20 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Transacciones"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                {openAdminTransacciones ? (
                  <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                )}
              </ListItemButton>

              <Collapse
                in={openAdminTransacciones}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {!esSupervisor && (
                    <ListItemButton
                      component={Link}
                      to="/usuarios/registro"
                      selected={location.pathname === "/usuarios/registro"}
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        py: 0.75,
                        pl: 3,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#1e293b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                          },
                          "& .MuiListItemText-primary": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary="Registrar Usuario"
                        primaryTypographyProps={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      />
                    </ListItemButton>
                  )}

                  <ListItemButton
                    component={Link}
                    to="/zona/registro"
                    selected={location.pathname === "/zona/registro"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Registrar Zona"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/cliente/registro"
                    selected={location.pathname === "/cliente/registro"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Registrar Cliente"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/direccioncliente/gestiondireccionclientes"
                    selected={
                      location.pathname ===
                      "/direccioncliente/gestiondireccionclientes"
                    }
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Registrar Dirección a un Cliente"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/asignacionclientevendedor/registro"
                    selected={
                      location.pathname ===
                      "/asignacionclientevendedor/registro"
                    }
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Registrar Cliente a un Vendedor"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  {!esSupervisor && (
                    <ListItemButton
                      component={Link}
                      to="/asignacionsupervisorvendedor/registro"
                      selected={
                        location.pathname ===
                        "/asignacionsupervisorvendedor/registro"
                      }
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        py: 0.75,
                        pl: 3,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#1e293b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                          },
                          "& .MuiListItemText-primary": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary="Registrar Supervisor a un Vendedor"
                        primaryTypographyProps={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>

              {/* Mantenimiento de Administración */}
              <ListItemButton
                onClick={() =>
                  setOpenAdminMantenimiento(!openAdminMantenimiento)
                }
                sx={{
                  borderRadius: 1.5,
                  mb: 1,
                  py: 1,
                  pl: 2,
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ListAltOutlined sx={{ color: "#64748b", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Mantenimiento"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                {openAdminMantenimiento ? (
                  <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                )}
              </ListItemButton>

              <Collapse
                in={openAdminMantenimiento}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {!esSupervisor && (
                    <ListItemButton
                      component={Link}
                      to="/usuarios/registrados"
                      selected={location.pathname === "/usuarios/registrados"}
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        py: 0.75,
                        pl: 3,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#1e293b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                          },
                          "& .MuiListItemText-primary": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary="Ver/Editar Usuarios"
                        primaryTypographyProps={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      />
                    </ListItemButton>
                  )}

                  <ListItemButton
                    component={Link}
                    to="/zona/registrados"
                    selected={location.pathname === "/zona/registrados"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Zonas"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/cliente/registrados"
                    selected={location.pathname === "/cliente/registrados"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Clientes"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/direccioncliente/gestiondireccionclientesregistradas"
                    selected={
                      location.pathname ===
                      "/direccioncliente/gestiondireccionclientesregistradas"
                    }
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Direcciones a Clientes"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/asignacionclientevendedor/registrados"
                    selected={
                      location.pathname ===
                      "/asignacionclientevendedor/registrados"
                    }
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Asignaciones de Clientes a Vendedores"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  {!esSupervisor && (
                    <ListItemButton
                      component={Link}
                      to="/asignacionsupervisorvendedor/registrados"
                      selected={
                        location.pathname ===
                        "/asignacionsupervisorvendedor/registrados"
                      }
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        py: 0.75,
                        pl: 3,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#1e293b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                          },
                          "& .MuiListItemText-primary": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary="Ver/Editar Asignaciones de Supervisores a Vendedores"
                        primaryTypographyProps={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </List>
          </Collapse>

          {/* VISITAS */}
          <ListItemButton
            onClick={() => setOpenVisitas(!openVisitas)}
            sx={{
              borderRadius: 1.5,
              mb: 1.5,
              py: 1.25,
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              ...(openVisitas && {
                backgroundColor: "#f8fafc",
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <RouteIcon sx={{ color: "#475569", fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary="Gestión Rutas/Visitas"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
              }}
            />
            {openVisitas ? (
              <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            )}
          </ListItemButton>

          <Collapse in={openVisitas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1 }}>
              {/* Transacciones de Visitas */}
              <ListItemButton
                onClick={() =>
                  setOpenVisitasTransacciones(!openVisitasTransacciones)
                }
                sx={{
                  borderRadius: 1.5,
                  mb: 1,
                  py: 1,
                  pl: 2,
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AddCircleOutlineOutlined
                    sx={{ color: "#64748b", fontSize: 20 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Transacciones"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                {openVisitasTransacciones ? (
                  <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                )}
              </ListItemButton>

              <Collapse
                in={openVisitasTransacciones}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  <ListItemButton
                    component={Link}
                    to="/ruta/registro"
                    selected={location.pathname === "/ruta/registro"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Registrar Ruta"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/visitas/registro"
                    selected={location.pathname === "/visitas/registro"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Crear Visita a una Ruta y Cliente"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Mantenimiento de Visitas */}
              <ListItemButton
                onClick={() =>
                  setOpenVisitasMantenimiento(!openVisitasMantenimiento)
                }
                sx={{
                  borderRadius: 1.5,
                  mb: 1,
                  py: 1,
                  pl: 2,
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ListAltOutlined sx={{ color: "#64748b", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Mantenimiento"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                {openVisitasMantenimiento ? (
                  <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                )}
              </ListItemButton>

              <Collapse
                in={openVisitasMantenimiento}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 2 }}>

                                    <ListItemButton
                    component={Link}
                    to="/ruta/registrados"
                    selected={location.pathname === "/ruta/registrados"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Rutas"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/visitas/registradas"
                    selected={location.pathname === "/visitas/registradas"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver/Editar Todas las Visitas"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/visitas/por-ruta"
                    selected={location.pathname === "/visitas/por-ruta"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver Visitas por Ruta"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/visitas/por-vendedor"
                    selected={location.pathname === "/visitas/por-vendedor"}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver Visitas por Vendedor"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>

                  {!esSupervisor && (
                    <ListItemButton
                      component={Link}
                      to="/visitas/por-cliente"
                      selected={location.pathname === "/visitas/por-cliente"}
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        py: 0.75,
                        pl: 3,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#1e293b",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                          },
                          "& .MuiListItemText-primary": {
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary="Ver Visitas por Cliente"
                        primaryTypographyProps={{
                          fontSize: "0.813rem",
                          fontWeight: 500,
                          color: "#64748b",
                        }}
                      />
                    </ListItemButton>
                  )}

                  <ListItemButton
                    component={Link}
                    to="/visitas/marcaciones-por-visita"
                    selected={
                      location.pathname === "/visitas/marcaciones-por-visita"
                    }
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      py: 0.75,
                      pl: 3,
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1e293b",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Ver Marcaciones por Visita"
                      primaryTypographyProps={{
                        fontSize: "0.813rem",
                        fontWeight: 500,
                        color: "#64748b",
                      }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Collapse>

          {/* REPORTES */}
          <ListItemButton
            onClick={() => setOpenReportes(!openReportes)}
            sx={{
              borderRadius: 1.5,
              mb: 1.5,
              py: 1.25,
              border: "1px solid #e2e8f0",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              ...(openReportes && {
                backgroundColor: "#f8fafc",
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AssessmentIcon sx={{ color: "#475569", fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary="Reportes"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
              }}
            />
            {openReportes ? (
              <ExpandLessIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            )}
          </ListItemButton>
          <Collapse in={openReportes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              <ListItemButton
                component={Link}
                to="/reporte/asistencia-diaria"
                selected={location.pathname === "/reporte/asistencia-diaria"}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 0.75,
                  pl: 3,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Reporte asistencia diaria"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/reporte/asistencia-periodo"
                selected={location.pathname === "/reporte/asistencia-periodo"}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 0.75,
                  pl: 3,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Reporte asistencia periodo"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/reporte/control-campo"
                selected={location.pathname === "/reporte/control-campo"}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 0.75,
                  pl: 3,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Reporte control campo"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/reporte/visitas-zona"
                selected={location.pathname === "/reporte/visitas-zona"}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 0.75,
                  pl: 3,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Reporte visitas por zona"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/reporte/visitas-realizadas"
                selected={location.pathname === "/reporte/visitas-realizadas"}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  py: 0.75,
                  pl: 3,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f172a",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemText
                  primary="Reporte visitas realizadas"
                  primaryTypographyProps={{
                    fontSize: "0.813rem",
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Footer - Logout */}
      <Box
        sx={{
          borderTop: "1px solid #e2e8f0",
          p: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 1.5,
            py: 1.25,
            "&:hover": {
              backgroundColor: "#fef2f2",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon sx={{ color: "#dc2626", fontSize: 22 }} />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#dc2626",
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
