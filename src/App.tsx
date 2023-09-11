import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Link,
  Container,
  CssBaseline,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Scale } from './Scale';
import { blue, red } from '@mui/material/colors';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Container component="footer" maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          padding: '1rem',
          // borderTop: '1px solid #ccc'
        }}
      >
        <Typography variant="body1">
          © Олег Дашевский {new Date().getFullYear()}
        </Typography>

        <Box>
          <IconButton
            color="primary"
            aria-label="Telegram"
            href="mailto:be9@be9.ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            <EmailIcon />
          </IconButton>

          <IconButton
            color="primary"
            aria-label="Telegram"
            href="https://t.me/beeee9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TelegramIcon />
          </IconButton>

          <IconButton
            color="primary"
            aria-label="GitHub"
            href="https://github.com/be9/scalez"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

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
        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
