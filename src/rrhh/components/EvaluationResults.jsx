import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    LinearProgress,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Rating
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import {
    TrendingUp,
    TrendingDown,
    RemoveRedEye,
    Star,
    Assignment,
    Group
} from '@mui/icons-material';

// Datos de ejemplo - Esto se reemplazará con datos reales de Firebase
const mockEvaluationData = {
    summary: {
        overallScore: 4.2,
        totalEvaluations: 5,
        completedEvaluations: 3,
        pendingEvaluations: 2,
        averageScores: {
            'Competencias Técnicas': 4.5,
            'Habilidades Blandas': 4.0,
            'Objetivos y Metas': 4.1
        }
    },
    recentEvaluations: [
        {
            id: '1',
            type: '360',
            evaluator: 'Carlos López',
            date: '2024-02-15',
            score: 4.3,
            status: 'completed'
        },
        {
            id: '2',
            type: '180',
            evaluator: 'María García',
            date: '2024-02-10',
            score: 4.1,
            status: 'completed'
        }
    ],
    strengthAreas: [
        { name: 'Trabajo en equipo', score: 4.8 },
        { name: 'Resolución de problemas', score: 4.6 },
        { name: 'Comunicación', score: 4.5 }
    ],
    improvementAreas: [
        { name: 'Gestión del tiempo', score: 3.5 },
        { name: 'Liderazgo', score: 3.7 },
        { name: 'Delegación', score: 3.8 }
    ]
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export const EvaluationResults = ({ evaluatedPerson }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const renderScoreCard = (title, score, icon) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                    {score.toFixed(1)}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={(score / 5) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </CardContent>
        </Card>
    );

    const renderProgressSection = (title, items) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <List>
                    {items.map((item, index) => (
                        <Box key={index}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        {item.score >= 4.5 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.name}
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Rating value={item.score} readOnly size="small" />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                ({item.score.toFixed(1)})
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < items.length - 1 && <Divider variant="inset" component="li" />}
                        </Box>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Paper sx={{ width: '100%', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab icon={<RemoveRedEye />} label="Vista General" />
                    <Tab icon={<Assignment />} label="Evaluaciones Recientes" />
                    <Tab icon={<Star />} label="Competencias" />
                    <Tab icon={<Group />} label="Retroalimentación" />
                </Tabs>

                {/* Vista General */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            {renderScoreCard(
                                'Puntuación General',
                                mockEvaluationData.summary.overallScore,
                                <Star color="primary" />
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Estado de Evaluaciones
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Chip
                                            label={`${mockEvaluationData.summary.completedEvaluations} Completadas`}
                                            color="success"
                                        />
                                        <Chip
                                            label={`${mockEvaluationData.summary.pendingEvaluations} Pendientes`}
                                            color="warning"
                                        />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(mockEvaluationData.summary.completedEvaluations / mockEvaluationData.summary.totalEvaluations) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Puntuación por Categorías
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {Object.entries(mockEvaluationData.summary.averageScores).map(([category, score]) => (
                                            <Grid item xs={12} md={4} key={category}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {category}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Rating value={score} readOnly size="small" />
                                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                                        ({score.toFixed(1)})
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(score / 5) * 100}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Evaluaciones Recientes */}
                <TabPanel value={tabValue} index={1}>
                    <Timeline>
                        {mockEvaluationData.recentEvaluations.map((evaluation) => (
                            <TimelineItem key={evaluation.id}>
                                <TimelineSeparator>
                                    <TimelineDot color="primary" />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">
                                                Evaluación {evaluation.type}°
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Por: {evaluation.evaluator}
                                            </Typography>
                                            <Typography variant="body2">
                                                Fecha: {evaluation.date}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Rating value={evaluation.score} readOnly />
                                                <Typography variant="body2">
                                                    Puntuación: {evaluation.score.toFixed(1)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </TabPanel>

                {/* Competencias */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            {renderProgressSection('Fortalezas', mockEvaluationData.strengthAreas)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {renderProgressSection('Áreas de Mejora', mockEvaluationData.improvementAreas)}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Retroalimentación */}
                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Comentarios Recientes
                                    </Typography>
                                    <List>
                                        {mockEvaluationData.recentEvaluations.map((evaluation) => (
                                            <Box key={evaluation.id}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar>{evaluation.evaluator[0]}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={evaluation.evaluator}
                                                        secondary={
                                                            <>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    Evaluación {evaluation.type}° - {evaluation.date}
                                                                </Typography>
                                                                {" — Comentarios de retroalimentación pendientes de implementar..."}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </Box>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Box>
    );
};