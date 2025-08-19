import { useState, useEffect } from 'react';
import { Calendar } from 'react-big-calendar';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useAttendanceStore } from '../../hooks/useAttendanceStore';
import { AttendanceModal } from './AttendanceModal';
import { AttendanceEvent } from './AttendanceEvent';
import { localizer } from '../../helpers/calendarLocalizer';
import { getMessagesES } from '../../helpers/getMessages';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export const AttendanceCalendar = () => {
    const { userProfile } = useSelector(state => state.auth);
    const { events, activeEvent, loadAttendanceRecords, setActiveEvent, startAddingAttendance } = useAttendanceStore();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        loadAttendanceRecords();
    }, []);

    // Removed handleSelectSlot as we don't want to create new events

    const handleSelectEvent = (event) => {
        setActiveEvent(event);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setActiveEvent(null);
        setOpenModal(false);
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = '#757575';
        let borderColor = 'transparent';
        
        if (event.isWithinSchedule) {
            backgroundColor = '#2196f3'; // Azul para marcaciones dentro del horario
        } else if (event.isLate) {
            backgroundColor = '#ff9800'; // Naranja para tardanzas
        } else {
            backgroundColor = '#f44336'; // Rojo para marcaciones fuera de horario
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                opacity: 0.8,
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 5px',
                fontWeight: 500
            }
        };
    };

    // Convertir fechas ISO a objetos Date para el calendario
    const eventsWithDates = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        startBreak: event.startBreak ? new Date(event.startBreak) : null,
        endBreak: event.endBreak ? new Date(event.endBreak) : null
    }));

    return (
        <Box sx={{ height: 'calc(100vh - 200px)' }}>
            <Calendar
                localizer={localizer}
                events={eventsWithDates}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                selectable={false}

                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: AttendanceEvent
                }}
                messages={getMessagesES()}
            />

            <AttendanceModal
                open={openModal}
                onClose={handleCloseModal}
                selectedEvent={activeEvent}
            />
        </Box>
    );
};