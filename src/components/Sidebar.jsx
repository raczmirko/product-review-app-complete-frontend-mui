import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PublicIcon from '@mui/icons-material/Public';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({ isLoggedIn, expiryTime, logOut }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [formattedTime, setFormattedTime] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

    useEffect(() => {
        let timer;
        if (isLoggedIn) {

            timer = setInterval(() => {
                // Get the current time
                const currentTime = new Date().getTime();

                // Calculate remaining seconds by subtracting the current time from the target time
                const remainingSeconds = Math.max(Math.floor((expiryTime - currentTime) / 1000), 0);

                // Format remaining seconds into minutes and seconds
                const formattedMinutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
                const formattedSeconds = String(remainingSeconds % 60).padStart(2, '0');

                // Update state with the formatted time
                setFormattedTime(`${formattedMinutes}:${formattedSeconds}`);

                // If remainingSeconds is 0, call logOut and clear the interval
                if (remainingSeconds === 0) {
                    logOut();
                    clearInterval(timer);
                }
            }, 1000);
        }

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, [isLoggedIn, expiryTime, logOut]);

    const sidebarOptions = [
        { icon: <HomeIcon />, text: 'Home', route: '/', visibleWithoutLogin: true},
        { icon: <LoginIcon />, text: 'Login', route: '/login', visibleWithoutLogin: true },
        { icon: <PersonAddIcon />, text: 'Register', route: '/register', visibleWithoutLogin: true },
        { icon: <StorefrontIcon />, text: 'Brands', route: '/brand', visibleWithoutLogin: false },
        { icon: <PublicIcon />, text: 'Countries', route: '/country', visibleWithoutLogin: false }
    ];

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {isLoggedIn && (
                        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ marginRight: 1 }} />
                        {formattedTime}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline" noWrap component="div">
                    Product Review Application
                </Typography>
                </Box>
                <Box component="img" src="/icon.png" alt="logo" sx={{ height: '50px', width: 'auto', marginLeft: '10px' }} />
            </Toolbar>
        </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <Divider />
        <List>
          {sidebarOptions.map((option, index) => (
            <ListItem key={option.text} disablePadding sx={{ display: 'block' }}>
            {
                (isLoggedIn || (!isLoggedIn && option.visibleWithoutLogin)) &&
                <ListItemButton href={option.route}
                    sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                    >
                        {option.icon}
                    </ListItemIcon>
                    <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            }
            </ListItem>
          ))}
          <ListItem key={"Logout"} disablePadding sx={{ display: 'block' }}>
            {
                isLoggedIn && 
                <ListItemButton onClick={logOut}
                sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                    >
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log out"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            }
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}