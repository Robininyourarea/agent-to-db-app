'use client';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../Sidebar';
import { useState, useEffect } from 'react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const drawerWidth = 320;

// creates a responsive layout structure
export default function LayoutWrapper({ children }: Readonly<LayoutWrapperProps>) {
  // Get theme
  const theme = useTheme();

  // Check if screen size is smaller than medium or not
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginTop: isMobile ? 0 : '10px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 