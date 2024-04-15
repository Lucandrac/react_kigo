import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../constants/apiConstants'
import { Link, useParams } from 'react-router-dom'
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { PiCarProfileBold } from 'react-icons/pi';

const UserProfile = () => {

  const [profil, setProfil] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  const fetchProfil = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/profils?page=1&userId=${params.userId}`);
      setProfil(response.data['hydra:member'][0]); // Assuming response contains the data
      setIsLoading(false);
    } catch (error) {
      console.log('Erreur lors de la récupération du profil : ' + error);
    }
  }
  
  useEffect(() => {
    fetchProfil();
    console.log(profil)
  }, []);

  return (
    isLoading ? <ButtonLoader /> :
    <div>
      {/* avatar ici */}
      <h1>{profil.userId.name} {profil.userId.firstName}</h1>
      <h3>{profil.filiere.label}</h3>
      <p>{profil?.biography}</p>
      {profil.userId.id === JSON.parse(localStorage.getItem('userInfos')).userId && (
        <Link to={`/editprofil/${profil.userId.id}`}>Modifier mon profil</Link>
      )}
     {/* projet == true et projet.creator == user */}
     <h2>Projets crées</h2>
     {/* projet == true et projet.creator != user */}
     <h2>Projets participés</h2>
     {/* projet == false */}
     <h2>Posts</h2>
    </div>
  )
}

export default UserProfile