import { createSlice } from '@reduxjs/toolkit';

export const rrhhSlice = createSlice({
    name: 'rrhh',
    initialState: {
        isLoading: false,
        errorMessage: null,
        companies: [],
        areas: [],
        positions: [],
        activeCompany: null,
        activeArea: null,
        activePosition: null
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            state.errorMessage = null;
        },
        setError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
        // Empresas
        setCompanies: (state, { payload }) => {
            state.companies = payload;
            state.isLoading = false;
        },
        addCompany: (state, { payload }) => {
            state.companies.push(payload);
        },
        updateCompany: (state, { payload }) => {
            state.companies = state.companies.map(company =>
                company.id === payload.id ? payload : company
            );
        },
        deleteCompany: (state, { payload }) => {
            state.companies = state.companies.filter(company => company.id !== payload);
        },
        setActiveCompany: (state, { payload }) => {
            state.activeCompany = payload;
        },
        // Áreas
        setAreas: (state, { payload }) => {
            state.areas = payload;
            state.isLoading = false;
        },
        addArea: (state, { payload }) => {
            state.areas.push(payload);
        },
        updateArea: (state, { payload }) => {
            state.areas = state.areas.map(area =>
                area.id === payload.id ? payload : area
            );
        },
        deleteArea: (state, { payload }) => {
            state.areas = state.areas.filter(area => area.id !== payload);
        },
        setActiveArea: (state, { payload }) => {
            state.activeArea = payload;
        },
        // Puestos
        setPositions: (state, { payload }) => {
            state.positions = payload;
            state.isLoading = false;
        },
        addPosition: (state, { payload }) => {
            state.positions.push(payload);
        },
        updatePosition: (state, { payload }) => {
            state.positions = state.positions.map(position =>
                position.id === payload.id ? payload : position
            );
        },
        deletePosition: (state, { payload }) => {
            state.positions = state.positions.filter(position => position.id !== payload);
        },
        setActivePosition: (state, { payload }) => {
            state.activePosition = payload;
        },
        // Limpiar estado
        clearRrhhState: (state) => {
            state.isLoading = false;
            state.errorMessage = null;
            state.companies = [];
            state.areas = [];
            state.positions = [];
            state.activeCompany = null;
            state.activeArea = null;
            state.activePosition = null;
        }
    }
});

export const {
    startLoading,
    setError,
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    setActiveCompany,
    setAreas,
    addArea,
    updateArea,
    deleteArea,
    setActiveArea,
    setPositions,
    addPosition,
    updatePosition,
    deletePosition,
    setActivePosition,
    clearRrhhState
} = rrhhSlice.actions;