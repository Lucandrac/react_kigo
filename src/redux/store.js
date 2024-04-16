import { configureStore } from "@reduxjs/toolkit";
import filiereReducer from "./filiere/filiereSlice";
import skillReducer from "./skill/skillSlice";
import postReducer from "./post/postSlice";

const store = configureStore({
    reducer: {
        filieres: filiereReducer,
        skills: skillReducer,
        posts: postReducer,
    }
})

export default store