import { useDispatch, useSelector } from 'react-redux';
import {
    startLoadingSchedules,
    startAddingSchedule,
    startUpdatingSchedule,
    startDeletingSchedule
} from '../store/schedules/thunks';
import {
    setActiveSchedule,
    clearActiveSchedule,
    clearError
} from '../store/schedules/schedulesSlice';

export const useScheduleStore = () => {
    const dispatch = useDispatch();
    const { schedules, activeSchedule, isLoading, errorMessage } = useSelector(state => state.schedules);

    const loadSchedules = async () => {
        await dispatch(startLoadingSchedules());
    };

    const createSchedule = async (scheduleData) => {
        const result = await dispatch(startAddingSchedule(scheduleData));
        return result;
    };

    const updateSchedule = async (scheduleId, updateData) => {
        const result = await dispatch(startUpdatingSchedule(scheduleId, updateData));
        return result;
    };

    const deleteSchedule = async (scheduleId) => {
        const result = await dispatch(startDeletingSchedule(scheduleId));
        return result;
    };

    const setScheduleActive = (schedule) => {
        dispatch(setActiveSchedule(schedule));
    };

    const clearScheduleActive = () => {
        dispatch(clearActiveSchedule());
    };

    const clearScheduleError = () => {
        dispatch(clearError());
    };

    return {
        // Propiedades
        schedules,
        activeSchedule,
        isLoading,
        errorMessage,

        // Métodos
        loadSchedules,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        setScheduleActive,
        clearScheduleActive,
        clearScheduleError
    };
};