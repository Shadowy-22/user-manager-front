import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Switch, FormControlLabel, PaletteOptions, Shadows } from '@mui/material';
import App from './App'; 

const AppWrapper = () => {
  const [darkMode, setDarkMode] = useState(false);

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
      paper: '#fbfbfe',
    },
    primary: {
      main: '#3a31d8',
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
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#bfc0c0', // Custom border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#666', // Color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3a31d8', // Focus color
                        },
                    },
                    '& label': {
                    color: '#bfc0c0', 
                    },
                    '& .MuiInputBase-input': {
                      color: '#040316', 
                      letterSpacing: '1.5px', // Add letter spacing here
                  },
                },
            },
        },
        // Add more customizations for other components if needed
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
          control={<Switch checked={darkMode} onChange={handleThemeChange} />}
          label="Dark Mode"
        />
      </div>
      <App />
    </ThemeProvider>
  );
};

export default AppWrapper;
