import React, { ReactNode } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  IconButton, 
  Avatar, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  QuestionAnswer as QuestionIcon, 
  Brightness4 as DarkModeIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Questions', icon: <QuestionIcon />, path: '/questions' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 700,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                component="span" 
                sx={{ 
                  color: 'primary.main',
                  textShadow: '0 0 5px #123456, 0 0 10px #03e9f9'
                }}
              >
                Prompt
              </Box>
              ly
            </motion.div>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button 
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color={isActive(item.path) ? 'primary' : 'inherit'}
                  sx={{ 
                    mx: 1,
                    position: 'relative',
                    '&::after': isActive(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '25%',
                      width: '50%',
                      height: '2px',
                      bgcolor: 'primary.main',
                      boxShadow: '0 0 5px #03e9f4'
                    } : {}
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <DarkModeIcon />
              </IconButton>
              <Avatar 
                sx={{ 
                  ml: 2, 
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: 'primary.main'
                }} 
                alt="User Avatar" 
                src="https://i.pravatar.cc/150?img=1" 
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.98), rgba(10, 15, 24, 0.98))',
            backdropFilter: 'blur(10px)',
            width: 240,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            onClick={toggleDrawer}
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 700
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                color: 'primary.main',
                textShadow: '0 0 5px #03e9f4, 0 0 10px #03e9f4'
              }}
            >
              Tech
            </Box>
            Nexus
          </Typography>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link} 
                to={item.path}
                onClick={toggleDrawer}
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(3, 233, 244, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(3, 233, 244, 0.15)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDrawer}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDrawer}>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary="Toggle Theme" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDrawer}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Promptly © {new Date().getFullYear()} - Smart StackOverflow with AI
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 