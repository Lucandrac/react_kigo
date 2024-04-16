import { createSelector } from "@reduxjs/toolkit";

const selectTypeContact = (state) => state.typeContact.typeContact;
const selectLoading = (state) => state.typeContact.loading;

export const selectTypeContactData = createSelector(
    [selectTypeContact, selectLoading],
    (typeContact, loading) => ({
        typeContact,
        loading
    })
);