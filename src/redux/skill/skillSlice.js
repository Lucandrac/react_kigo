import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const skillSlice = createSlice({
    name: 'skills',

    initialState: {
        skills: [],
        loading: false,
    },

    reducers: {
        setSkills: (state, action) => {
            state.skills = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setSkills, setLoading } = skillSlice.actions;
//toutes les compétences
export const fetchSkills = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/skills?page=1`);
        dispatch(setSkills(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default skillSlice.reducer