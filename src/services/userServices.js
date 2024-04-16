import axios from "axios";
import { apiUrl } from "../constants/apiConstants";

export const checkUser = async (userInfo) => {
    try {
        //on récupère l'utilisateur dans la bdd avec l'id en session
        const response = await axios.get(`${apiUrl}/users/${userInfo.userId}`);
        const user = response.data;
        //on compare l'email et le nickname de la bdd avec l'email et le nickname de l'utilisateur en session
        if (user.email === userInfo.email && user.name === userInfo.name) {
            return true;
        }
        return false;
    } catch (error) {
        console.log('Erreur du checkUser : ', error);
        return false;
    }
}