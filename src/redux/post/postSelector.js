import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;
const selectNormalPosts = (state) => state.posts.normalPosts;
const selectProjectPost = (state) => state.posts.projectPost;
const selectAllProjectPosts = (state) => state.posts.allProjectPosts;
const selectAllParticipatingProjects = (state) => state.posts.allParticipatingProjects;
const selectLoading = (state) => state.posts.loading;

export const selectPostData = createSelector(
    [selectPosts, selectNormalPosts, selectProjectPost, selectAllProjectPosts, selectAllParticipatingProjects, selectLoading],
    (posts, normalPosts, projectPost, allProjectPosts, allParticipatingProjects, loading) => ({
        posts,
        normalPosts,
        projectPost,
        allProjectPosts,
        allParticipatingProjects,
        loading
    })
);