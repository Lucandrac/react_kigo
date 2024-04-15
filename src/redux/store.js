import { configureStore } from "@reduxjs/toolkit";
import filiereReducer from "./filiere/filiereSlice";

const store = configureStore({
    reducer: {
        filieres: filiereReducer,
    }
})

export default store