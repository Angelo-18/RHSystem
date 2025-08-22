import { useSelector } from 'react-redux';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { AssignmentInd, Assessment, Description, AdminPanelSettings, ExpandLess, ExpandMore, Timer, NoteAdd, Schedule, Article, FileCopy, Settings } from '@mui/icons-material';
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
    {
        title: 'Evaluaciones',
        icon: Assessment,
        description: 'Gestión de evaluaciones',
        isSection: true,
        isOpen: openSection === 'evaluaciones',
        subItems: [
            { title: 'Evaluaciones Pendientes', icon: Assessment, path: '/evaluaciones/pendientes', description: 'Realizar evaluaciones asignadas' },
            { title: 'Mis Resultados', icon: Assessment, path: '/evaluaciones/resultados', description: 'Ver resultados de evaluaciones' }
        ]
    },
    {
        title: 'Documentación',
        icon: Description,
        description: 'Gestión de documentos',
        isSection: true,
        isOpen: openSection === 'documentacion',
        subItems: [
            { title: 'Mis Documentos', icon: Article, path: '/documentacion/personal', description: 'Ver y firmar documentos personales' }
        ]
    }],
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
    {
        title: 'Evaluaciones',
        icon: Assessment,
        description: 'Gestión de evaluaciones',
        isSection: true,
        isOpen: openSection === 'evaluaciones',
        subItems: [
            { title: 'Asignar Evaluaciones', icon: Assessment, path: '/evaluaciones/asignar', description: 'Asignar evaluaciones al personal' },
            { title: 'Evaluaciones Pendientes', icon: Assessment, path: '/evaluaciones/pendientes', description: 'Realizar evaluaciones asignadas' },
            { title: 'Gestión de Resultados', icon: Assessment, path: '/evaluaciones/resultados', description: 'Ver y gestionar resultados' }
        ]
    },
    {
        title: 'Documentación',
        icon: Description,
        description: 'Gestión de documentos',
        isSection: true,
        isOpen: openSection === 'documentacion',
        subItems: [
            { title: 'Mis Documentos', icon: Article, path: '/documentacion/personal', description: 'Ver y firmar documentos personales' },
            { title: 'Generar Documentos', icon: FileCopy, path: '/documentacion/generar', description: 'Crear contratos y boletas' },
            { title: 'Gestión Documental', icon: Settings, path: '/documentacion/gestion', description: 'Administrar documentación' }
        ]
    }],
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
    {
        title: 'Evaluaciones',
        icon: Assessment,
        description: 'Gestión de evaluaciones',
        isSection: true,
        isOpen: openSection === 'evaluaciones',
        subItems: [
            { title: 'Evaluaciones Pendientes', icon: Assessment, path: '/evaluaciones/pendientes', description: 'Evaluar al personal asignado' },
            { title: 'Resultados del Equipo', icon: Assessment, path: '/evaluaciones/resultados', description: 'Ver resultados del equipo' }
        ]
    },
    {
        title: 'Documentación',
        icon: Description,
        description: 'Gestión de documentos',
        isSection: true,
        isOpen: openSection === 'documentacion',
        subItems: [
            { title: 'Mis Documentos', icon: Article, path: '/documentacion/personal', description: 'Ver y firmar documentos personales' }
        ]
    }],
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
    {
        title: 'Evaluaciones',
        icon: Assessment,
        description: 'Gestión de evaluaciones',
        isSection: true,
        isOpen: openSection === 'evaluaciones',
        subItems: [
            { title: 'Asignar Evaluaciones', icon: Assessment, path: '/evaluaciones/asignar', description: 'Asignar evaluaciones al personal' },
            { title: 'Evaluaciones Pendientes', icon: Assessment, path: '/evaluaciones/pendientes', description: 'Realizar evaluaciones asignadas' },
            { title: 'Gestión de Resultados', icon: Assessment, path: '/evaluaciones/resultados', description: 'Ver todos los resultados' },
            { title: 'Configuración', icon: AdminPanelSettings, path: '/evaluaciones/config', description: 'Configurar tipos de evaluación' }
        ]
    },
    {
        title: 'Documentación',
        icon: Description,
        description: 'Gestión de documentos',
        isSection: true,
        isOpen: openSection === 'documentacion',
        subItems: [
            { title: 'Mis Documentos', icon: Article, path: '/documentacion/personal', description: 'Ver y firmar documentos personales' },
            { title: 'Generar Documentos', icon: FileCopy, path: '/documentacion/generar', description: 'Crear contratos y boletas' },
            { title: 'Gestión Documental', icon: Settings, path: '/documentacion/gestion', description: 'Administrar documentación' },
            { title: 'Configuración', icon: AdminPanelSettings, path: '/documentacion/admin', description: 'Configuración avanzada' }
        ]
    },
    { title: 'Administración', icon: AdminPanelSettings, path: '/admin', description: 'Gestionar usuarios y permisos' }]
});

export const SideBarMenu = () => {
    const { profile } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState('');

    const handleSectionClick = (sectionName) => {
        setOpenSection(prevSection => prevSection === sectionName ? '' : sectionName);
    };

    const handleSubItemClick = (path) => {
        navigate(path, { replace: true });
    };

    const menuItems = getMenuConfig(openSection)[profile] || getMenuConfig(openSection).colaborador;

    return (
        <List>
            {menuItems.map((item) => (
                <div key={item.title}>
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => item.isSection ? handleSectionClick(item.title.toLowerCase()) : handleSubItemClick(item.path)}
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