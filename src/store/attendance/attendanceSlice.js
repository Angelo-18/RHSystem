import { createSlice } from '@reduxjs/toolkit';

export const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        isLoading: false,
        attendanceRecords: [],
        activeRecord: null,
        errorMessage: null,
        currentDayRecords: []
    },
    reducers: {
        startLoadingAttendance: (state) => {
            state.isLoading = true;
            state.errorMessage = null;
        },
        setAttendanceRecords: (state, { payload }) => {
            state.isLoading = false;
            state.attendanceRecords = payload;
        },
        addAttendanceRecord: (state, { payload }) => {
            state.attendanceRecords.push(payload);
            // Actualizar registros del día actual
            const today = new Date().toISOString().split('T')[0];
            const recordDate = new Date(payload.start).toISOString().split('T')[0];
            if (today === recordDate) {
                state.currentDayRecords.push(payload);
            }
        },
        updateAttendanceRecord: (state, { payload }) => {
            state.attendanceRecords = state.attendanceRecords.map(record =>
                record.id === payload.id ? payload : record
            );
            // Actualizar en currentDayRecords si corresponde
            const today = new Date().toISOString().split('T')[0];
            const recordDate = new Date(payload.start).toISOString().split('T')[0];
            if (today === recordDate) {
                state.currentDayRecords = state.currentDayRecords.map(record =>
                    record.id === payload.id ? payload : record
                );
            }
        },
        setActiveRecord: (state, { payload }) => {
            state.activeRecord = payload;
        },
        clearActiveRecord: (state) => {
            state.activeRecord = null;
        },
        setError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
        clearError: (state) => {
            state.errorMessage = null;
        },
        setCurrentDayRecords: (state, { payload }) => {
            state.currentDayRecords = payload;
        },
        clearCurrentDayRecords: (state) => {
            state.currentDayRecords = [];
        }
    }
});

export const {
    startLoadingAttendance,
    setAttendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    setActiveRecord,
    clearActiveRecord,
    setError,
    clearError,
    setCurrentDayRecords,
    clearCurrentDayRecords
} = attendanceSlice.actions;