import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography } from '@mui/material';
import { Scale } from './Scale';
import { blue, red } from '@mui/material/colors';

function App() {
  let theme = createTheme();

  theme = createTheme(theme, {
    palette: {
      low: theme.palette.augmentColor({
        color: {
          main: blue[500],
        },
        name: 'low',
      }),

      high: theme.palette.augmentColor({
        color: {
          main: red[500],
        },
        name: 'low',
      }),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ textAlign: 'center' }}>
        <CssBaseline />
        <Typography variant="h2">Лад</Typography>
        <Scale />
      </Container>
    </ThemeProvider>
  );
}

export default App;
