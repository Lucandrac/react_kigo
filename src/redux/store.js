import { configureStore } from "@reduxjs/toolkit";
import filiereReducer from "./filiere/filiereSlice";
import skillReducer from "./skill/skillSlice";
import postReducer from "./post/postSlice";
import typeContactReducer from "./typeContact/typeContactSlice";

const store = configureStore({
    reducer: {
        filieres: filiereReducer,
        skills: skillReducer,
        posts: postReducer,
        typeContact: typeContactReducer,
    }
})

export default store