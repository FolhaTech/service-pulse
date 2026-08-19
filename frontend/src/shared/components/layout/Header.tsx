import CloudUpload from '@mui/icons-material/CloudUpload';
import Help from '@mui/icons-material/Help';
import Search from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export interface HeaderProps {
  title: string;
  drawerWidth: number;
}

export function Header({ title, drawerWidth }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        ml: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 4 }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Juridico
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            /
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <TextField
          size="small"
          placeholder="Buscar..."
          sx={{
            width: { xs: 0, md: 240 },
            display: { xs: 'none', md: 'block' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'grey.50',
              '& fieldset': { borderColor: 'divider' },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          component={Link}
          to="/analytics/import"
          size="small"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Importar CSV
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Ajuda">
          <IconButton aria-label="Ajuda" sx={{ borderRadius: 2, color: 'text.secondary' }}>
            <Help />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
