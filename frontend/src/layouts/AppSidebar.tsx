import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout, type User } from "../api/auth";

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

interface SidebarProps {
  mobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  expanded: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardRoundedIcon />,
    disabled: false,
  },
  {
    label: "Edytuj swoje wesele",
    path: "/wedding/settings",
    icon: <SettingsOutlinedIcon />,
    disabled: false,
  },
  {
    label: "Budżet",
    path: "/budget",
    icon: <AccountBalanceWalletOutlinedIcon />,
    disabled: true,
  },
  {
    label: "Zadania",
    path: "/tasks",
    icon: <CheckCircleOutlineRoundedIcon />,
    disabled: true,
  },
  {
    label: "Usługodawcy",
    path: "/vendors",
    icon: <StorefrontOutlinedIcon />,
    disabled: true,
  },
];

export default function Sidebar({
  mobile,
  mobileOpen,
  onMobileClose,
  expanded,
  onToggle,
}: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);

  const showLabels = mobile || expanded;
  const width = expanded
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  const displayName =
    user?.first_name?.trim() || user?.username || "Użytkownik";

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

  function handleNavigation(path: string) {
    navigate(path);
    if (mobile) onMobileClose();
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  }

  return (
    <>
      <Drawer
        variant={mobile ? "temporary" : "permanent"}
        open={mobile ? mobileOpen : true}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: mobile ? SIDEBAR_EXPANDED_WIDTH : width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: mobile ? SIDEBAR_EXPANDED_WIDTH : width,
            boxSizing: "border-box",
            overflowX: "hidden",
            borderRight: "1px solid",
            borderColor: "divider",
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.shorter,
            }),
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          <List sx={{ px: expanded ? 1.5 : 1, pt: 2 }}>
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              const menuButton = (
                <ListItemButton
                  selected={active}
                  disabled={item.disabled}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    mb: 0.75,
                    px: expanded ? 1.5 : 0,
                    borderRadius: 2.5,
                    justifyContent: showLabels ? "flex-start" : "center",
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "& .MuiListItemText-primary": {
                        color: "primary.main",
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: showLabels ? 40 : 0,
                      justifyContent: "center",
                      color: active ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {showLabels && <ListItemText primary={item.label} />}
                </ListItemButton>
              );

              return (
                <Tooltip
                  key={item.path}
                  title={showLabels ? "" : item.label}
                  placement="right"
                >
                  <Box>{menuButton}</Box>
                </Tooltip>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              p: expanded ? 2 : 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Tooltip
              title={showLabels ? "" : `Witaj, ${displayName}`}
              placement="right"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: showLabels ? "flex-start" : "center",
                  gap: 1.3,
                  px: showLabels ? 1 : 0,
                  py: 1.25,
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "primary.main",
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>

                {showLabels && (
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      Witaj
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayName}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Tooltip>

            <Tooltip
              title={showLabels ? "" : "Wyloguj"}
              placement="right"
            >
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  mt: 0.5,
                  minHeight: 48,
                  px: showLabels ? 2 : 0,
                  borderRadius: 2.5,
                  justifyContent: showLabels ? "flex-start" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: showLabels ? 40 : 0,
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <LogoutRoundedIcon />
                </ListItemIcon>

                {showLabels && <ListItemText primary="Wyloguj" />}
              </ListItemButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      {!mobile && (
        <Tooltip title={expanded ? "Zwiń menu" : "Rozwiń menu"} placement="right">
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              position: "fixed",
              top: 26,
              left: width - 14,
              width: 28,
              height: 28,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
              zIndex: theme.zIndex.drawer + 1,
              transition: theme.transitions.create("left", {
                duration: theme.transitions.duration.shorter,
              }),
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            {expanded ? (
              <ChevronLeftRoundedIcon sx={{ fontSize: 19 }} />
            ) : (
              <ChevronRightRoundedIcon sx={{ fontSize: 19 }} />
            )}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}