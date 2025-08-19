import { createSlice } from '@reduxjs/toolkit';

export const schedulesSlice = createSlice({
    name: 'schedules',
    initialState: {
        isLoading: false,
        schedules: [],
        activeSchedule: null,
        errorMessage: null
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        setSchedules: (state, action) => {
            state.isLoading = false;
            state.schedules = action.payload;
        },
        addSchedule: (state, action) => {
            state.schedules.push(action.payload);
        },
        updateSchedule: (state, action) => {
            state.schedules = state.schedules.map(schedule =>
                schedule.id === action.payload.id
                    ? { ...schedule, ...action.payload }
                    : schedule
            );
        },
        deleteSchedule: (state, action) => {
            state.schedules = state.schedules.filter(
                schedule => schedule.id !== action.payload
            );
        },
        setActiveSchedule: (state, action) => {
            state.activeSchedule = action.payload;
        },
        clearActiveSchedule: (state) => {
            state.activeSchedule = null;
        },
        setError: (state, action) => {
            state.errorMessage = action.payload;
        },
        clearError: (state) => {
            state.errorMessage = null;
        }
    }
});

export const {
    startLoading,
    setSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    setActiveSchedule,
    clearActiveSchedule,
    setError,
    clearError
} = schedulesSlice.actions;