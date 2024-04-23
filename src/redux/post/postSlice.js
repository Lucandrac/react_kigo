import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const postSlice = createSlice({
    name: 'posts',

    initialState: {
        posts: [],
        normalPosts: [],
        projectPost: {},
        allProjectPosts: [],
        allParticipatingProjects: [],
        loading: false,
    },

    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setNormalPosts: (state, action) => {
            state.normalPosts = action.payload;
        },
        setProjectPost: (state, action) => {
            state.projectPost = action.payload;
        },
        setAllProjectPosts: (state, action) => {
            state.allProjectPosts = action.payload;
        },
        setAllParticipatingProjects: (state, action) => {
            state.allParticipatingProjects = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setPosts, setNormalPosts, setProjectPost, setAllProjectPosts, setAllParticipatingProjects, setLoading } = postSlice.actions;

//tous les posts de projects crées par l'utilisateur
export const fetchProjectPosts = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts?page=1&genre=1&creator=${id}`);
        dispatch(setPosts(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

//tous les posts normal de l'utilisateur
export const fetchNormalPosts = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts?page=1&genre=2&creator=${id}`);
        dispatch(setNormalPosts(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}
//un seul project
export const fetchProjectPost = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/projects/${id}`);
        dispatch(setProjectPost(response.data));
        dispatch(setLoading(false));
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}
//tous les posts de projects
export const fetchAllProjectPosts = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts?page=1&genre=1&isOpen=true`);
        dispatch(setAllProjectPosts(response.data['hydra:member']));
        dispatch(setLoading(false));
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

//tous les projects avec l'utilisateur en participant ou createur
export const fetchAllParticipatingProjects = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/posts?page=1&genre=1&project.participant.id=${id}`);
        dispatch(setAllParticipatingProjects(response.data['hydra:member']));
        dispatch(setLoading(false));
    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default postSlice.reducer