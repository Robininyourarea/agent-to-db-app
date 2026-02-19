'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { darkTheme } from '@/theme/theme';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export default function MuiThemeProvider({ children }: Readonly<MuiThemeProviderProps>) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
