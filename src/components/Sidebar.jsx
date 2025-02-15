import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleIcon from "@mui/icons-material/BrunchDining";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductIcon from "@mui/icons-material/EmojiSymbols";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PublicIcon from "@mui/icons-material/Public";
import QuizIcon from "@mui/icons-material/Quiz";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CharacteristicsIcon from "@mui/icons-material/Style";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNotification } from "../services/NotificationProvider";
import { useCallback } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ isLoggedIn, expiryTime, logOut }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [username, setUsername] = useState("");
  const showNotification = useNotification();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = useCallback(() => {
    showNotification("info", "INFO: You have been logged out.");
    logOut();
  }, [showNotification, logOut]);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [isLoggedIn]);

  useEffect(() => {
    let timer;
    if (isLoggedIn) {
      timer = setInterval(() => {
        // Get the current time
        const currentTime = new Date().getTime();

        // Calculate remaining seconds by subtracting the current time from the target time
        const remainingSeconds = Math.max(
          Math.floor((expiryTime - currentTime) / 1000),
          0
        );

        // Format remaining seconds into minutes and seconds
        const formattedMinutes = String(
          Math.floor(remainingSeconds / 60)
        ).padStart(2, "0");
        const formattedSeconds = String(remainingSeconds % 60).padStart(2, "0");

        // Update state with the formatted time
        setFormattedTime(`${formattedMinutes}:${formattedSeconds}`);

        // If remainingSeconds is 0, call logOut and clear the interval
        if (remainingSeconds === 0) {
          handleLogout();
          clearInterval(timer);
        }
      }, 1000);
    }

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [isLoggedIn, expiryTime, logOut, handleLogout]);

  const sidebarOptions = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      route: "/dashboard",
      visibleWithoutLogin: false,
    },
    {
      icon: <LoginIcon />,
      text: "Login",
      route: "/login",
      visibleWithoutLogin: true,
    },
    {
      icon: <PersonAddIcon />,
      text: "Register",
      route: "/register",
      visibleWithoutLogin: true,
    },
    {
      icon: <StorefrontIcon />,
      text: "Brands",
      route: "/brands",
      visibleWithoutLogin: false,
    },
    {
      icon: <PublicIcon />,
      text: "Countries",
      route: "/countries",
      visibleWithoutLogin: false,
    },
    {
      icon: <CategoryIcon />,
      text: "Categories",
      route: "/categories",
      visibleWithoutLogin: false,
    },
    {
      icon: <CharacteristicsIcon />,
      text: "Characteristics",
      route: "/characteristics",
      visibleWithoutLogin: false,
    },
    {
      icon: <ArticleIcon />,
      text: "Articles",
      route: "/articles",
      visibleWithoutLogin: false,
    },
    {
      icon: <InventoryIcon />,
      text: "Packagings",
      route: "/packagings",
      visibleWithoutLogin: false,
    },
    {
      icon: <QuizIcon />,
      text: "Aspects",
      route: "/aspects",
      visibleWithoutLogin: false,
    },
    {
      icon: <ProductIcon />,
      text: "Products",
      route: "/products",
      visibleWithoutLogin: false,
    },
    {
      icon: <RateReviewIcon />,
      text: "Reviews",
      route: "/reviews",
      visibleWithoutLogin: false,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            {isLoggedIn && (
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ marginRight: 1 }} />
                {formattedTime}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="overline" noWrap component="div">
              Product Review Application
            </Typography>
          </Box>
          <Box
            component="img"
            src="/icon.png"
            alt="logo"
            sx={{ height: "50px", width: "auto", marginLeft: "10px" }}
          />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <Divider />
        <List>
          {sidebarOptions.map((option, index) => (
            <ListItem
              key={option.text}
              disablePadding
              sx={{ display: "block" }}
            >
              {(isLoggedIn || (!isLoggedIn && option.visibleWithoutLogin)) && (
                <ListItemButton
                  href={option.route}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <Tooltip title={option.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {option.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={option.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
          <Tooltip title="Logout" placement="right">
            <ListItem key={"Logout"} disablePadding sx={{ display: "block" }}>
              {isLoggedIn && (
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Log out"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          </Tooltip>
          <ListItem>
            {isLoggedIn && (
              <Typography
                variant="overline"
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  wordBreak: "break-all",
                  opacity: open ? 1 : 0,
                }}
              >
                Logged in as {username}
              </Typography>
            )}
          </ListItem>
        </List>
      </Drawer>
      {/* Adjust content margin based on sidebar state */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0, // Add margin if sidebar is open
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      ></Box>
    </Box>
  );
}
