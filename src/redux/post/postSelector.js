import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;
const selectNormalPosts = (state) => state.posts.normalPosts;
const selectProjectPost = (state) => state.posts.projectPost;
const selectLoading = (state) => state.posts.loading;

export const selectPostData = createSelector(
    [selectPosts, selectNormalPosts, selectProjectPost, selectLoading],
    (posts, normalPosts, projectPost, loading) => ({
        posts,
        normalPosts,
        projectPost,
        loading
    })
);