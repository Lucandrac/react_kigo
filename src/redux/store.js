import { configureStore } from "@reduxjs/toolkit";
import filiereReducer from "./filiere/filiereSlice";
import skillReducer from "./skill/skillSlice";
import postReducer from "./post/postSlice";
import typeContactReducer from "./typeContact/typeContactSlice";
import categoryReducer from "./category/categorySlice";
import inviteReducer from "./invite/inviteSlice";
import avatarReducer from "./avatar/avatarSlice";

const store = configureStore({
    reducer: {
        filieres: filiereReducer,
        skills: skillReducer,
        posts: postReducer,
        typeContact: typeContactReducer,
        categories: categoryReducer,
        invites: inviteReducer,
        avatars: avatarReducer,
    }
})

export default store