import { configureStore } from "@reduxjs/toolkit";
import filiereReducer from "./filiere/filiereSlice";
import skillReducer from "./skill/skillSlice";

const store = configureStore({
    reducer: {
        filieres: filiereReducer,
        skills: skillReducer,
    }
})

export default store