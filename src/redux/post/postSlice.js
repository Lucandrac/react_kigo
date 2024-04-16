import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const postSlice = createSlice({
    name: 'posts',

    initialState: {
        posts: [],
        normalPosts: [],
        loading: false,
    },

    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setNormalPosts: (state, action) => {
            state.normalPosts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setPosts, setNormalPosts, setLoading } = postSlice.actions;

export const fetchProjectPosts = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts??page=1&genre=1&creator=${id}`);
        dispatch(setPosts(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export const fetchNormalPosts = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts??page=1&genre=2&creator=${id}`);
        dispatch(setNormalPosts(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default postSlice.reducer