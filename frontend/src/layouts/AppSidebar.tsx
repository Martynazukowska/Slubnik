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

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  logout,
  type User,
} from "../api/auth";


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
        label: "Edytuj Swoje Wesele",
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

  const [user, setUser] =
    useState<User | null>(null);


  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        navigate("/login");
      }
    }

    loadUser();
  }, [navigate]);


  const width = expanded
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;


  const displayName =
    user?.first_name?.trim() ||
    user?.username ||
    "Użytkownik";


  const handleNavigation = (
    path: string,
  ) => {
    navigate(path);

    if (mobile) {
      onMobileClose();
    }
  };


  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };


  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* MENU */}

      <List
        sx={{
          px: expanded ? 1.5 : 1,
          pt: 2,
        }}
      >
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path;

          const button = (
            <ListItemButton
              selected={active}
              disabled={item.disabled}
              onClick={() =>
                handleNavigation(item.path)
              }
              sx={{
                minHeight: 48,
                mb: 0.75,
                borderRadius: 2.5,

                px: expanded
                  ? 1.5
                  : 0,

                justifyContent:
                  expanded
                    ? "flex-start"
                    : "center",

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

                "&.Mui-selected:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth:
                    expanded
                      ? 40
                      : 0,

                  justifyContent: "center",

                  color: active
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {expanded && (
                <ListItemText
                  primary={item.label}
                />
              )}
            </ListItemButton>
          );

          if (expanded || mobile) {
            return (
              <Box key={item.label}>
                {button}
              </Box>
            );
          }

          return (
            <Tooltip
              key={item.label}
              title={item.label}
              placement="right"
            >
              {button}
            </Tooltip>
          );
        })}
      </List>


      <Box sx={{ flexGrow: 1 }} />


      {/* USER */}

      <Box
        sx={{
          p: expanded ? 2 : 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {expanded || mobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.3,
              px: 1,
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
              {displayName
                .charAt(0)
                .toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
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
          </Box>
        ) : (
          <Tooltip
            title={`Witaj, ${displayName}`}
            placement="right"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "primary.main",
                }}
              >
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>
            </Box>
          </Tooltip>
        )}


        {expanded || mobile ? (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mt: 0.5,
              borderRadius: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "text.secondary",
              }}
            >
              <LogoutRoundedIcon />
            </ListItemIcon>

            <ListItemText
              primary="Wyloguj"
            />
          </ListItemButton>
        ) : (
          <Tooltip
            title="Wyloguj"
            placement="right"
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                mt: 0.5,
                px: 0,
                justifyContent: "center",
                borderRadius: 2.5,
              }}
            >
              <LogoutRoundedIcon
                sx={{
                  color: "text.secondary",
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );


  return (
    <>
      <Drawer
        variant={
          mobile
            ? "temporary"
            : "permanent"
        }
        open={
          mobile
            ? mobileOpen
            : true
        }
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: mobile
            ? SIDEBAR_EXPANDED_WIDTH
            : width,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: mobile
              ? SIDEBAR_EXPANDED_WIDTH
              : width,

            boxSizing: "border-box",

            borderRight: "1px solid",
            borderColor: "divider",

            overflowX: "hidden",

            transition:
              theme.transitions.create(
                "width",
                {
                  duration:
                    theme.transitions
                      .duration.shorter,
                },
              ),
          },
        }}
      >
        {content}
      </Drawer>


      {/* COLLAPSE BUTTON
          Jest POZA Drawerem,
          więc nie zostanie ucięty. */}

      {!mobile && (
        <Tooltip
          title={
            expanded
              ? "Zwiń menu"
              : "Rozwiń menu"
          }
          placement="right"
        >
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

              zIndex: (theme) =>
                theme.zIndex.drawer + 1,

              transition:
                theme.transitions.create(
                  "left",
                  {
                    duration:
                      theme.transitions
                        .duration.shorter,
                  },
                ),

              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            {expanded ? (
              <ChevronLeftRoundedIcon
                sx={{ fontSize: 19 }}
              />
            ) : (
              <ChevronRightRoundedIcon
                sx={{ fontSize: 19 }}
              />
            )}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}