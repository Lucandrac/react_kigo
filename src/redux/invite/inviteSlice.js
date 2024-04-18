import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../constants/apiConstants";

const inviteSlice = createSlice({
    name: 'invites',

    initialState: {
        invites: [],
        loading: false,
    },

    reducers: {
        setInvites: (state, action) => {
            state.invites = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }

})

export const { setInvites, setLoading } = inviteSlice.actions;

export const fetchInvites = (projectId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${apiUrl}/invites?page=1&isActive=true&project=%22%2Fapi%2Fproject%2F${projectId}%22`);
        dispatch(setInvites(response.data['hydra:member']));
        dispatch(setLoading(false));

    } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
    }
}

export default inviteSlice.reducer