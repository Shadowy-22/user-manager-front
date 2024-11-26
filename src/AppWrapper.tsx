import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Switch, FormControlLabel, PaletteOptions, Shadows } from '@mui/material';
import App from './App'; 
import { DarkMode, LightMode } from '@mui/icons-material';

const AppWrapper = () => {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  useEffect(() => {
    // Guardamos el estado del tema en localStorage cada vez que cambie
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Tipografia compartida
  const typography = {
    fontFamily: 'Playfair Display, serif',
  };

  // Definicion de la paleta
  const darkPalette: PaletteOptions = {
    mode: 'dark',
    text: {
      primary: '#eae9fc',
    },
    background: {
      default: '#010104',
    },
    primary: {
      main: '#7370d1',
    },
    secondary: {
      main: '#020024',
    },
  };

  const lightPalette: PaletteOptions = {
    mode: 'light',
    text: {
      primary: '#040316',
    },
    background: {
      default: '#fbfbfe',
      paper: '#fbfbfe',
    },
    primary: {
      main: '#2f27ce',
    },
    secondary: {
      main: '#dddbff',
    },
  };

  // Cambio de tema dinamico basado en el State
  const theme = createTheme({
    palette: darkMode ? darkPalette : lightPalette,
    typography,
    shadows: [
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.2)',
        '0px 3px 6px rgba(0, 0, 0, 0.3)',
        '0px 4px 8px rgba(0, 0, 0, 0.4)',
        '0px 5px 10px rgba(6, 0, 194, 0.3)', 
        '0px 5px 15px rgba(255, 255, 255, 0.5)', 
        ...Array(20).fill('none')
      ] as Shadows,
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            // Estilado del Autofill
            '& input:-webkit-autofill': {
              WebkitBoxShadow: darkMode ? '0 0 0 100px #020024 inset' : null,
              WebkitTextFillColor: darkMode ? '#eae9fc' : null,
            },
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#010104' : '#fbfbfe',
            color: darkMode ? '#eae9fc' : '#040316',
          },
        },
      },
    },
  });

  // Switch que cambia el mode
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}> {/* Envolvemos el App en el ThemeProvider para que se aplique */}
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'right', padding: '1rem' }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={handleThemeChange}
              icon={<LightMode sx={{ color: "#040313" }} />}
              checkedIcon={<DarkMode sx={{ color: "#eae9fc" }} />}
            />
          }
          label="Tema"
        />
      </div>
      <App />
    </ThemeProvider>
  );
};

export default AppWrapper;