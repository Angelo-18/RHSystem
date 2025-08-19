
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import { personalSlice } from './personal';
import { rrhhSlice } from './rrhh';
import { attendanceSlice } from './attendance/attendanceSlice';
import { schedulesSlice } from './schedules/schedulesSlice';
import { justificationsSlice } from './justifications/justificationsSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        personal: personalSlice.reducer,
        rrhh: rrhhSlice.reducer,
        attendance: attendanceSlice.reducer,
        schedules: schedulesSlice.reducer,
        justifications: justificationsSlice.reducer,
    },
})