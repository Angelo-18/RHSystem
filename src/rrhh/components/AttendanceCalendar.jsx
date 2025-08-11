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

    const handleSelectSlot = async ({ start }) => {
        if (userProfile === 'colaborador') {
            const timestamp = new Date(start);
            const newRecord = {
                title: 'Marcación: entrada',
                start: timestamp.toISOString(),
                end: timestamp.toISOString(),
                type: 'entrada',
                status: 'registered',
                createdAt: new Date().toISOString()
            };

            const result = await startAddingAttendance(newRecord);
            if (result.success) {
                await loadAttendanceRecords();
            }
        }
    };

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

        // switch (event.status) {
        //     case 'pending':
        //         backgroundColor = '#ffd700';
        //         break;
        //     case 'approved':
        //         backgroundColor = '#4caf50';
        //         break;
        //     case 'rejected':
        //         backgroundColor = '#f44336';
        //         break;
        //     case 'registered':
        //         backgroundColor = '#2196f3';
        //         break;
        //     default:
        //         if (event.title.includes('después de break')) {
        //             backgroundColor = '#9c27b0';
        //         }
        // }

        return {
            style: {
                backgroundColor,
                opacity: 0.8,
                color: 'white',
                border: 'none'
            }
        };
    };

    return (
        <Box sx={{ height: 'calc(100vh - 200px)' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                selectable={userProfile === 'colaborador'}
                onSelectSlot={handleSelectSlot}
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