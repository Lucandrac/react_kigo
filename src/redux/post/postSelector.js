import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;
const selectNormalPosts = (state) => state.posts.normalPosts;
const selectLoading = (state) => state.posts.loading;

export const selectPostData = createSelector(
    [selectPosts, selectNormalPosts, selectLoading],
    (posts, normalPosts, loading) => ({
        posts,
        normalPosts,
        loading
    })
);