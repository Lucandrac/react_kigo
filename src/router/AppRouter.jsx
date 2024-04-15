import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import OnlineRouter  from './OnlineRouter';
import OfflineRouter from './OfflineRouter';

//creation d'un mini context pour la session
const SessionContext = createContext({
    inSession: false
});
//creation du hook pour utiliser le context de session 
export const useSessionContext = () => useContext(SessionContext);



const AppRouter = () => {
    //on déclare notre state session
    const [inSession, setInSession] = useState(null);
    //on récupère les infos de notre authContext 
    const {userId, setUserId, setEmail, setName, setFirstName} = useAuthContext();
    //on va regarder si on a des infos sur le local storage
    const getUserInfos = async () => {
        const user = JSON.parse(localStorage.getItem('userInfos'));
        if(user) {
            setUserId(user.userId);
            setEmail(user.email);
            setName(user.name);
            setFirstName(user.firstName);
            setInSession(true);
        }else{
            setInSession(false);
        }
    }

    useEffect(() => {
        getUserInfos();
    }, [userId])

    const value = {
        inSession
    }

    return (
    //on récupère le contexte de Session
    <SessionContext.Provider value={value}>
       <RouterProvider router={inSession ? OnlineRouter : OfflineRouter} />
    </SessionContext.Provider>
  )
}

export default AppRouter