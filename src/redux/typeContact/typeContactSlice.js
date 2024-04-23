import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const typeContactlice = createSlice({
    name: 'typeContacts',

    initialState: {
        typeContact: [],
        loading: false,
    },

    reducers: {
        setTypeContact: (state, action) => {
            state.typeContact = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setTypeContact, setLoading } = typeContactlice.actions;
//toutes les types de contact
export const fetchTypeContact = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/type_contacts?page=1`);
        dispatch(setTypeContact(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default typeContactlice.reducer