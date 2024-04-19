import { createSelector } from "@reduxjs/toolkit";

const selectAvatars = (state) => state.avatars.avatars;
const selectLoading = (state) => state.avatars.loading;

export const selectAvatarData = createSelector(
    [selectAvatars, selectLoading],
    (avatars, loading) => ({
        avatars,
        loading
    })
);