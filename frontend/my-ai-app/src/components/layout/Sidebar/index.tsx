'use client';
import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ChatHistoryList from '../../section/ChatHistoryList';
import { useRouter } from 'next/navigation';


const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
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
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: Readonly<SidebarProps>) {

  // Access the theme
  const router = useRouter();

  const handleNewChat = () => {
    router.push('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>

      {/* Sidebar */}
      <Drawer variant="permanent" open={isOpen} anchor='left'>
        {/* Sidebar Header */}
        <DrawerHeader>
          {isOpen ? (
            <>
              <Typography
                fontFamily='var(--font-manrope)'
                variant="h5"
                sx={{ flexGrow: 1, ml: 1 }}>
                zentrix.ai
              </Typography>
              <IconButton onClick={onToggle}>
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={onToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>

        <Divider />

        {/* Sidebar Menu */}
        <List>
          {/* New Chat Button */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                isOpen
                  ? {
                    justifyContent: 'initial',
                  }
                  : {
                    justifyContent: 'center',
                  },
              ]}
              onClick={handleNewChat}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                  },
                  isOpen
                    ? {
                      mr: 3,
                    }
                    : {
                      mr: 'auto',
                    },
                ]}
              >
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="New Chat"
                sx={[
                  isOpen
                    ? {
                      opacity: 1,
                    }
                    : {
                      opacity: 0,
                    },
                ]}
              />
            </ListItemButton>
          </ListItem>

          {/* Settings Button */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                isOpen
                  ? {
                    justifyContent: 'initial',
                  }
                  : {
                    justifyContent: 'center',
                  },
              ]}
              onClick={() => router.push('/db-schema')}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                  },
                  isOpen
                    ? {
                      mr: 3,
                    }
                    : {
                      mr: 'auto',
                    },
                ]}
              >
                <DataArrayIcon />
              </ListItemIcon>
              <ListItemText
                primary="DB Schema"
                sx={[
                  isOpen
                    ? {
                      opacity: 1,
                    }
                    : {
                      opacity: 0,
                    },
                ]}
              />
            </ListItemButton>
          </ListItem>

          {/* Tools Button */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                isOpen
                  ? {
                    justifyContent: 'initial',
                  }
                  : {
                    justifyContent: 'center',
                  },
              ]}
              onClick={() => router.push('/tools')}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                  },
                  isOpen
                    ? {
                      mr: 3,
                    }
                    : {
                      mr: 'auto',
                    },
                ]}
              >
                <TuneIcon />
              </ListItemIcon>
              <ListItemText
                primary="Tools"
                sx={[
                  isOpen
                    ? {
                      opacity: 1,
                    }
                    : {
                      opacity: 0,
                    },
                ]}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        {/* Chat History List */}
        <Box sx={{
          flexGrow: 1,
          overflow: 'hidden',
          display: isOpen ? 'block' : 'none'
        }}>
          <ChatHistoryList />
        </Box>

      </Drawer>
    </Box>
  );
} 