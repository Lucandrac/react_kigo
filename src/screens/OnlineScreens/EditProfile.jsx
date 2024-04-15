import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomInput from '../../components/CustomInput';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';
import { fetchFilieres } from '../../redux/filiere/filiereSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFiliereData } from '../../redux/filiere/filiereSelector';
import ButtonLoader from '../../components/Loaders/ButtonLoader';

const EditProfile = () => {
    const [bio, setBio] = useState('');
    const [filiere, setFiliere] = useState('');
    const dispatch = useDispatch();
    const {filieres, loading } = useSelector(selectFiliereData);
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [profilId, setProfilId] = useState('');

    const fetchProfil = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${apiUrl}/profils?page=1&userId=${params.userId}`);
          setFiliere(response.data['hydra:member'][0].filiere.id); 
          setBio(response.data['hydra:member'][0].biography);
          setProfilId(response.data['hydra:member'][0].id);
          setIsLoading(false);
        } catch (error) {
          console.log('Erreur lors de la récupération du profil : ' + error);
        }
      }
    
    useEffect(() => {
        dispatch(fetchFilieres());
        fetchProfil();
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        //change headers
        axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';

        const filiereApi = `/api/filieres/${filiere}`;

        axios.patch(`${apiUrl}/profils/${profilId}`, {
            biography: bio,
            filiere: filiereApi
        });

        navigate(`/profil/${params.userId}`);

    }

  return (
    loading ? <ButtonLoader /> :
    isLoading ? <ButtonLoader /> :
    <div className="bg-black text-white flex flex-col">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
            <textarea cols="30" rows="10" value={bio} onChange={(event) => setBio(event.target.value)}>
                {bio}
            </textarea>
            <select value={filiere} onChange={(event) => setFiliere(event.target.value)}>
                {filieres && filieres.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>{filiere.label}</option>
                ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default EditProfile