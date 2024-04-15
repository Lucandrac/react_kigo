import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const filiereSlice = createSlice({
    name: 'filieres',

    initialState: {
        filieres: [],
        loading: false,
    },

    reducers: {
        setFilieres: (state, action) => {
            state.filieres = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setFilieres, setLoading } = filiereSlice.actions;

export const fetchFilieres = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/filieres?page=1`);
        dispatch(setFilieres(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default filiereSlice.reducer