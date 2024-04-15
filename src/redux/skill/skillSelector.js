import { createSelector } from "@reduxjs/toolkit";

const selectSkills = (state) => state.skills.skills;
const selectLoading = (state) => state.skills.loading;

export const selectSkillData = createSelector(
    [selectSkills, selectLoading],
    (skills, loading) => ({
        skills,
        loading
    })
);