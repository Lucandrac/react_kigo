import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import Register from "../screens/OfflineScreens/Register";
import LoginScreen from "../screens/OfflineScreens/LoginScreen";
import Screen1 from "../screens/Screen1";
import HomeOnline from "../screens/OnlineScreens/HomeOnline";
import UserProfile from "../screens/OnlineScreens/UserProfile";
import EditProfile from "../screens/OnlineScreens/EditProfile";
import AddProject from "../screens/OnlineScreens/AddProject";
import ProjectDetail from "../screens/OnlineScreens/ProjectDetail";
import ProjectList from "../screens/OnlineScreens/ProjectList";
import AddPost from "../screens/OnlineScreens/AddPost";

const OnlineRouter = createBrowserRouter([
    {
        element: (
            <>
                <HomeOnline />
            </>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Screen1 /> 
            },
            {
                path: "/addpost",
                element: <AddPost />
            },
            {
                path: "/profil/:userId",
                element: <UserProfile />
            },
            {
                path: "/editprofil/:userId",
                element: <EditProfile />
            },
            {
                path: "/addproject",
                element: <AddProject />
            },
            {
                path: "/project/:id",
                element: <ProjectDetail />
            },
            {
                path: "/projects",
                element: <ProjectList />
            }
        ]
    }
])

export default OnlineRouter