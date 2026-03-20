import { alpha, createTheme } from '@mui/material/styles'

const ink = '#0f2742'
const tide = '#0f5b8d'
const aqua = '#0e9f96'
const sand = '#f6e6c8'
const coral = '#d96b49'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tide,
      light: '#4b8ec2',
      dark: '#0b4267',
      contrastText: '#ffffff',
    },
    secondary: {
      main: aqua,
      light: '#6bc6bf',
      dark: '#0a6f6a',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#e3a33c',
      light: '#f1c778',
      dark: '#aa6d11',
    },
    success: {
      main: '#21966d',
      light: '#69c49f',
      dark: '#14684b',
    },
    error: {
      main: coral,
      light: '#ef9a81',
      dark: '#a9472c',
    },
    background: {
      default: '#f3f7fb',
      paper: 'rgba(255, 255, 255, 0.88)',
    },
    text: {
      primary: ink,
      secondary: alpha(ink, 0.72),
    },
    divider: alpha(ink, 0.08),
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"DM Serif Display", serif',
      fontSize: '3.35rem',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"DM Serif Display", serif',
      fontSize: '2.7rem',
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: '"DM Serif Display", serif',
      fontSize: '2rem',
      lineHeight: 1.14,
    },
    h4: {
      fontWeight: 800,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 800,
      fontSize: '1.2rem',
    },
    h6: {
      fontWeight: 800,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    body1: {
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f3f7fb',
          backgroundImage: [
            'radial-gradient(circle at top left, rgba(14, 159, 150, 0.14), transparent 35%)',
            'radial-gradient(circle at top right, rgba(15, 91, 141, 0.18), transparent 28%)',
            'linear-gradient(180deg, #f9fbfd 0%, #eef4fa 100%)',
          ].join(','),
          color: ink,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alpha(ink, 0.08)}`,
          boxShadow: `0 24px 60px ${alpha(ink, 0.08)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: alpha('#ffffff', 0.72),
          '& fieldset': {
            borderColor: alpha(ink, 0.12),
          },
          '&:hover fieldset': {
            borderColor: alpha(tide, 0.3),
          },
          '&.Mui-focused fieldset': {
            borderWidth: 1,
            borderColor: tide,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: `linear-gradient(180deg, ${alpha('#082033', 0.98)} 0%, ${alpha('#0f2742', 0.96)} 55%, ${alpha('#0d4265', 0.95)} 100%)`,
          color: '#eff7ff',
          borderRight: `1px solid ${alpha('#ffffff', 0.08)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(135deg, ${alpha('#082033', 0.94)} 0%, ${alpha('#0f2742', 0.86)} 55%, ${alpha('#0f5b8d', 0.88)} 100%)`,
          backdropFilter: 'blur(18px)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(ink, 0.08),
        },
        head: {
          fontWeight: 800,
          color: alpha(ink, 0.68),
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.72rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 10,
        },
      },
    },
  },
  customTokens: {
    ink,
    tide,
    aqua,
    sand,
  },
})

export { ink, tide, aqua, sand, coral }
