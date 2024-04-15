import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import Register from "../screens/OfflineScreens/Register";
import LoginScreen from "../screens/OfflineScreens/LoginScreen";
import Screen1 from "../screens/Screen1";
import Screen2 from "../screens/Screen2";
import HomeOnline from "../screens/OnlineScreens/HomeOnline";

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
                path: "/register",
                element: <Screen2 />
            }
        ]
    }
])

export default OnlineRouter