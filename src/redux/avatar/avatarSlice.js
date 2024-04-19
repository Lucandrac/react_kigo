import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const avatarSlice = createSlice({
    name: 'avatars',

    initialState: {
        avatars: [],
        loading: false,
    },

    reducers: {
        setAvatars: (state, action) => {
            state.avatars = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setAvatars, setLoading } = avatarSlice.actions;

export const fetchAvatars = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/avatars?page=1`);
        dispatch(setAvatars(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default avatarSlice.reducer