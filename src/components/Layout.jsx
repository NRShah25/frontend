import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Divider, Avatar
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    AccountBalanceWallet as BudgetIcon,
    Logout as LogoutIcon,
    AccountBalance as LogoIcon
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 240;

const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
    { label: 'Budgets', path: '/budgets', icon: <BudgetIcon /> },
];

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logoutUser } = useAuth();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: '#1a1f2e',
                        color: 'white',
                        borderRight: 'none',
                    },
                }}
            >
                {/* Logo */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LogoIcon sx={{ color: '#4f8ef7', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold" color="white">
                        FinanceTracker
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Nav Items */}
                <List sx={{ px: 1, mt: 1, flexGrow: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: isActive ? 'rgba(79, 142, 247, 0.15)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        color: isActive ? '#4f8ef7' : 'rgba(255,255,255,0.5)',
                                        minWidth: 40
                                    }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* User + Logout */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, px: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f8ef7', fontSize: 14 }}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="white" fontWeight={600} noWrap>
                                {user?.fullName}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.5)" noWrap>
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <ListItemButton
                        onClick={logoutUser}
                        sx={{
                            borderRadius: 2,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                fontSize: 14,
                                color: 'rgba(255,255,255,0.6)'
                            }}
                        />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{
                flexGrow: 1,
                bgcolor: '#f5f7fa',
                minHeight: '100vh',
                overflow: 'auto'
            }}>
                {children}
            </Box>
        </Box>
    );
}

export default Layout;