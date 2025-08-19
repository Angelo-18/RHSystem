import { Typography, Box, Tooltip } from '@mui/material';

export const AttendanceEvent = ({ event }) => {
    const { title, status, notes, startBreak, endBreak, estado } = event;

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

    const getStatusText = () => {
        let statusText = `Estado: ${status === 'registered' ? 'Registrado' : 
                                  status === 'pending' ? 'Pendiente de revisión' :
                                  status === 'approved' ? 'Aprobado' :
                                  status === 'rejected' ? 'Rechazado' : 'Estado desconocido'}`;

        if (event.isWithinSchedule !== undefined) {
            statusText += `\nTolerancia: ${event.isWithinSchedule ? 'Dentro del horario' : 
                          event.isLate ? 'Tardanza' : 'Fuera de horario'}`;
        }

        if (startBreak && endBreak) {
            const breakStart = new Date(startBreak).toLocaleTimeString();
            const breakEnd = new Date(endBreak).toLocaleTimeString();
            statusText += `\nBreak: ${breakStart} - ${breakEnd}`;
        } else if (startBreak) {
            const breakStart = new Date(startBreak).toLocaleTimeString();
            statusText += `\nBreak iniciado: ${breakStart}`;
        }

        if (notes) {
            statusText += `\nNotas: ${notes}`;
        }

        return statusText;
    };

    return (
        <Tooltip title={getStatusText()}>
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
                        color: '#ffffff',
                        fontWeight: 'bold',
                        textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {title}
                </Typography>
                {notes && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {notes}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
};