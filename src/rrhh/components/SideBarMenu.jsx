import { useSelector } from 'react-redux';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { AssignmentInd, Assessment, Description, AdminPanelSettings, ExpandLess, ExpandMore, Timer, NoteAdd, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const getMenuConfig = (openSection) => ({
    colaborador: [{
        title: 'Asistencias',
        icon: AssignmentInd,
        description: 'Gestión de asistencias',
        isSection: true,
        isOpen: openSection === 'asistencias',
        subItems: [
            { title: 'Marcar Asistencia', icon: Timer, path: '/marcar-asistencia', description: 'Registrar entrada/salida' },
            { title: 'Ver Asistencias', icon: AssignmentInd, path: '/asistencias', description: 'Ver registro de asistencias' },
            { title: 'Justificaciones', icon: NoteAdd, path: '/justificaciones', description: 'Gestionar justificaciones' }
        ]
    },
        { title: 'Evaluaciones', icon: Assessment, path: '/evaluaciones', description: 'Ver y realizar evaluaciones programadas' },
        { title: 'Documentación', icon: Description, path: '/documentacion', description: 'Ver boletas, legajos y contratos' }
    ],
    recursos_humanos: [{
        title: 'Asistencias',
        icon: AssignmentInd,
        description: 'Gestión de asistencias',
        isSection: true,
        isOpen: openSection === 'asistencias',
        subItems: [
            { title: 'Registro de Asistencias', icon: Timer, path: '/asistencias', description: 'Ver todas las asistencias' },
            { title: 'Justificaciones', icon: NoteAdd, path: '/justificaciones', description: 'Gestionar justificaciones' }
        ]
    },
        { title: 'Evaluaciones', icon: Assessment, path: '/evaluaciones', description: 'Gestionar y programar evaluaciones' },
        { title: 'Documentación', icon: Description, path: '/documentacion', description: 'Gestionar documentación del personal' }
    ],
    supervisor: [{
        title: 'Asistencias',
        icon: AssignmentInd,
        description: 'Gestión de asistencias',
        isSection: true,
        isOpen: openSection === 'asistencias',
        subItems: [
            { title: 'Registro de Asistencias', icon: Timer, path: '/asistencias', description: 'Ver asistencias del equipo' },
            { title: 'Justificaciones', icon: NoteAdd, path: '/justificaciones', description: 'Gestionar justificaciones del equipo' }
        ]
    },
        { title: 'Evaluaciones', icon: Assessment, path: '/evaluaciones', description: 'Ver evaluaciones del personal a cargo' },
        { title: 'Documentación', icon: Description, path: '/documentacion', description: 'Ver documentación propia' }
    ],
    admin: [{
        title: 'Asistencias',
        icon: AssignmentInd,
        description: 'Gestión de asistencias',
        isSection: true,
        isOpen: openSection === 'asistencias',
        subItems: [
            { title: 'Registro de Asistencias', icon: Timer, path: '/asistencias', description: 'Ver todas las asistencias' },
            { title: 'Justificaciones', icon: NoteAdd, path: '/justificaciones', description: 'Gestionar todas las justificaciones' }
        ]
    },
        { title: 'Evaluaciones', icon: Assessment, path: '/evaluaciones', description: 'Gestionar todas las evaluaciones' },
        { title: 'Documentación', icon: Description, path: '/documentacion', description: 'Gestionar toda la documentación' },
        { title: 'Administración', icon: AdminPanelSettings, path: '/admin', description: 'Gestionar usuarios y permisos' }
    ]
});

export const SideBarMenu = () => {
    const { userProfile } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState('');

    const handleSectionClick = (sectionName) => {
        setOpenSection(prevSection => prevSection === sectionName ? '' : sectionName);
    };

    const handleSubItemClick = (path) => {
        navigate(path, { replace: true });
    };

    const menuItems = getMenuConfig(openSection)[userProfile] || getMenuConfig(openSection).colaborador;

    return (
        <List>
            {menuItems.map((item) => (
                <div key={item.title}>
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => item.isSection ? handleSectionClick('asistencias') : handleSubItemClick(item.path)}
                        >
                            <ListItemIcon>
                                <item.icon />
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.title}
                                secondary={item.description}
                            />
                            {item.isSection && (item.isOpen ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                    </ListItem>
                    {item.isSection && (
                        <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.subItems.map((subItem) => (
                                    <ListItem key={subItem.title} disablePadding>
                                        <ListItemButton 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubItemClick(subItem.path);
                                            }}
                                            sx={{ pl: 4 }}
                                        >
                                            <ListItemIcon>
                                                <subItem.icon />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={subItem.title}
                                                secondary={subItem.description}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    )}
                </div>
            ))}
        </List>
    );
};