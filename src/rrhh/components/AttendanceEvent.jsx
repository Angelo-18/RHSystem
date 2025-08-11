import { Typography, Box } from '@mui/material';

export const AttendanceEvent = ({ event }) => {
    const { title, status } = event;

    const getStatusColor = () => {
        switch (status) {
            case 'pending':
                return '#ffd700'; // Amarillo para pendiente
            case 'approved':
                return '#4caf50'; // Verde para aprobado
            case 'rejected':
                return '#f44336'; // Rojo para rechazado
            case 'registered':
                return '#2196f3'; // Azul para registrado
            default:
                return '#757575'; // Gris por defecto
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            p: 0.5
        }}>
            <Typography
                variant="caption"
                sx={{
                    color: getStatusColor(),
                    fontWeight: 'bold'
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};