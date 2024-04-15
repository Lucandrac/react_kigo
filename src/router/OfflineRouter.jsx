import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import Register from "../screens/OfflineScreens/Register";
import LoginScreen from "../screens/OfflineScreens/LoginScreen";

const OfflineRouter = createBrowserRouter([
    {
        element: (
            <>
                <HomeOffline />
            </>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <LoginScreen />
            },
            {
                path: "/register",
                element: <Register />
            }
        ]
    }
])

export default OfflineRouter