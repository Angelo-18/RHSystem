import { createSlice } from '@reduxjs/toolkit';

export const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        isLoading: false,
        attendanceRecords: [],
        activeRecord: null,
        errorMessage: null
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
        },
        updateAttendanceRecord: (state, { payload }) => {
            state.attendanceRecords = state.attendanceRecords.map(record =>
                record.id === payload.id ? payload : record
            );
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
    clearError
} = attendanceSlice.actions;