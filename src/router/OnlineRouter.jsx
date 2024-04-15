import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import Register from "../screens/OfflineScreens/Register";
import LoginScreen from "../screens/OfflineScreens/LoginScreen";
import Screen1 from "../screens/Screen1";
import Screen2 from "../screens/Screen2";
import HomeOnline from "../screens/OnlineScreens/HomeOnline";
import UserProfile from "../screens/OnlineScreens/UserProfile";
import EditProfile from "../screens/OnlineScreens/EditProfile";
import AddProject from "../screens/OnlineScreens/AddProject";

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
                element: <Screen1 /> //TODO: Dashboard
            },
            {
                path: "/register",
                element: <Screen2 /> //TODO: Liste projets, add project, detail projet, edit projet, profil, edit profil, add post...
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
                path: "/addproject/:userId",
                element: <AddProject />
            }
        ]
    }
])

export default OnlineRouter