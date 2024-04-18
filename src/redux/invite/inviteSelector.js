import { createSelector } from "@reduxjs/toolkit";

const selectInvites = (state) => state.invites.invites;
const selectLoading = (state) => state.invites.loading;

export const selectInviteData = createSelector(
    [selectInvites, selectLoading],
    (invites, loading) => ({
        invites,
        loading
    })
);