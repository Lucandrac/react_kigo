import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

//creation du contexte d'authentification
const AuthContext = createContext({
    //on liste les states de notre contexte et leur fonction de modification
    userId: '',
    email: '',
    name: '',
    firstName: '',
    setUserId: () => {},
    setEmail: () => {},
    setName: () => {},
    setFirstName: () => {},
    signIn: async () => {}, //fonction d'authentification
    signOut: async () => {}, //fonction de deconnexion
});

//on définit toute la mécanique de notre contexte
const AuthContextProvider = ({children}) => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    
    const signIn = async (user) => {
        try {
            //on remplie les states depuis l'objet user
            setUserId(user.userId);
            setEmail(user.email);
            setName(user.name);
            setFirstName(user.firstName);
            //on envoie les informations de l'utilisateur dans le localStorage
            localStorage.setItem('userInfos', JSON.stringify(user));

        } catch (error) {
            throw new Error("Erreur lors de l'authentification : " + error);
        }
    };

    const signOut = async () => {
        try {
            //on vide tout
            setUserId('');
            setEmail('');
            setName('');
            setFirstName('');
            localStorage.removeItem('userInfos');
        } catch (error) {
            throw new Error("Erreur lors de la déconnexion : " + error);

        }
    };
    
    //on prend toute la logique de notre contexte
    const value = {
        userId,
        email,
        name,
        firstName,
        setUserId,
        setEmail,
        setName,
        setFirstName,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

//creation de notre propre hook pour utiliser le contexte d'authentification
const useAuthContext = () => useContext(AuthContext);


export {AuthContext, AuthContextProvider, useAuthContext}