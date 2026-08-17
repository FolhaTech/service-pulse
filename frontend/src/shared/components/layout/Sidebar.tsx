import Analytics from '@mui/icons-material/Analytics';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Dashboard from '@mui/icons-material/Dashboard';
import Gavel from '@mui/icons-material/Gavel';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';

const mainNavigation = [
  { label: 'Dashboard', path: '/analytics/dashboard', icon: <Dashboard /> },
  { label: 'Auditoria', path: '/analytics/audits', icon: <Gavel /> },
  { label: 'Importar dados', path: '/analytics/import', icon: <CloudUpload /> },
];

export interface SidebarProps {
  drawerWidth: number;
}

export function Sidebar({ drawerWidth }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'grey.50',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar sx={{ px: 2.5, gap: 1.5 }}>
        <Avatar variant="rounded" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Analytics fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Juridico
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Analytics
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 1.5, flex: 1, overflowY: 'auto' }}>
        {mainNavigation.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                ...(active && {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'inherit' },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: active ? 'inherit' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ fontWeight: active ? 600 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
