import { createSelector } from "@reduxjs/toolkit";

const selectFilieres = (state) => state.filieres.filieres;
const selectLoading = (state) => state.filieres.loading;

export const selectFiliereData = createSelector(
    [selectFilieres, selectLoading],
    (filieres, loading) => ({
        filieres,
        loading
    })
);