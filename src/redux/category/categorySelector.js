import { createSelector } from "@reduxjs/toolkit";

const selectCategories = (state) => state.categories.categories;
const selectLoading = (state) => state.categories.loading;

export const selectCategoryData = createSelector(
    [selectCategories, selectLoading],
    (categories, loading) => ({
        categories,
        loading
    })
);