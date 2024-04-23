import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomInput from '../../components/CustomInput';
import axios from 'axios';
import { apiRoot, apiUrl } from '../../constants/apiConstants';
import { fetchFilieres } from '../../redux/filiere/filiereSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFiliereData } from '../../redux/filiere/filiereSelector';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import { fetchSkills } from '../../redux/skill/skillSlice';
import { selectSkillData } from '../../redux/skill/skillSelector';
import { changeArray } from '../../tools/miscelaneousTools';
import { selectTypeContactData } from '../../redux/typeContact/typeContactSelector';
import { fetchTypeContact } from '../../redux/typeContact/typeContactSlice';
import { fetchAvatars } from '../../redux/avatar/avatarSlice';
import { selectAvatarData } from '../../redux/avatar/avatarSelector';
import { FaTrashAlt } from 'react-icons/fa';


const EditProfile = () => {
  const dispatch = useDispatch();
  //on recupère les données depuis le redux
  const { filieres, loading } = useSelector(selectFiliereData);
  const { typeContact } = useSelector(selectTypeContactData);
  const { skills } = useSelector(selectSkillData);
  const { avatars } = useSelector(selectAvatarData);
  
  //on recupère l'utilisateur avec le localStorage
  const params = JSON.parse(localStorage.getItem('userInfos'));

  const navigate = useNavigate();
  //on initialise les states
  const [isLoading, setIsLoading] = useState(true);
  const [profil, setProfil] = useState({});
  const [profilId, setProfilId] = useState('');
  const [comp, setComp] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [picture, setPicture] = useState('');
  const [bio, setBio] = useState('');
  const [filiere, setFiliere] = useState('');
  

  //on récupère toutes les données du profil et on les met dans les states
  const fetchProfil = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/profils?page=1&userId=${params.userId}`);
      response.data['hydra:member'][0].filiere ? setFiliere(response.data['hydra:member'][0].filiere.id) : setFiliere(1);
      setBio(response.data['hydra:member'][0].biography);
      setProfil(response.data['hydra:member'][0]);
      setProfilId(response.data['hydra:member'][0].id);
      response.data['hydra:member'][0].avatar ? setPicture(response.data['hydra:member'][0].avatar.id) : setPicture(1);
      response.data['hydra:member'][0].skills.forEach((skill) => {
        setComp((prevComp) => [...prevComp, skill.id]);
      });
      setIsLoading(false);
    } catch (error) {
      console.log('Erreur lors de la récupération du profil : ' + error);
    }
  }

  useEffect(() => {
    dispatch(fetchAvatars());
    dispatch(fetchSkills());
    dispatch(fetchTypeContact());
    dispatch(fetchFilieres());
    fetchProfil();
  }, [])

  //on met les contacts dans le state
  useEffect(() => {
    if (profil.contacts) {
      setContacts(profil.contacts.map((contact) => ({
        typeContact: contact.type.id,
        value: contact.value,
      })))
    }
  }, [profil.contacts])

  //au submit du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    //change headers
    axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
    const filiereApi = `/api/filieres/${filiere}`;
    //on patch le profil
    await axios.patch(`${apiUrl}/profils/${profilId}`, {
      biography: bio,
      filiere: filiereApi,
      skills: changeArray(comp, 'skills'),
    });

    //puis on patch son avatar (associé à user)
    await axios.patch (`${apiUrl}/users/${params.userId}`, {
      avatar: `/api/avatars/${picture}`
    });

    //on récupère tout les contacts du profil
    const response = await axios.get(`${apiUrl}/contacts?page=1&profil=${profilId}`);

    //on delete tous les contacts qui ont une liaison avec le profil
    if (Array.isArray(response.data['hydra:member'])) {

      response.data['hydra:member'].map((contact) => {
        axios.delete(`${apiUrl}/contacts/${contact.id}`);
      })
      //puis on les reposts
      axios.defaults.headers.post['Content-Type'] = 'application/ld+json';

      //on post les nouveaux contacts
      contacts.map(async (contact) => {
        await axios.post(`${apiUrl}/contacts`, {
          type: `/api/type_contacts/${contact.typeContact}`,
          value: contact.value,
          profil: `/api/profils/${profilId}`
        });
      })

    } else {
      console.log('Erreur lors de la création des contacts');
    }

    navigate(`/profil/${params.userId}`);
  }

  // on update le state contact avec les nouvelles valeurs
  const handleChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
    console.log(contacts);
  };

  //on update le state picture(avatar) avec la nouvelle valeur
  const handleSwitchPicture = (event) => {
    setPicture(event.target.value);
    
  }

  //on update le state comp selon les checkboxs cochées en ajoutant au tableau actuel ou supprimant
  const handleCheckBoxChangeComp = (event) => {
    const targetValue = event.target.value;
    if (event.target.checked && !comp.includes(targetValue)) {
      setComp((prevComp) => [...prevComp, targetValue]);
    } else {
      setComp((prevComp) => prevComp.filter((c) => c != targetValue));
    }
  }

  //crée un nouveau contact vierge
  const handleAddContact = (e) => {
    e.preventDefault();
    const newContact = {
      typeContact: typeContact[0].id,
      value: '',
    };

    setContacts([...contacts, newContact]);
  };

  return (
    isLoading ? <ButtonLoader /> :
      loading ? <ButtonLoader /> :
        <div className="flex flex-col">
          <h2 className="text-center text-purple-900 text-bold text-3xl m-3">Modification du Profil</h2>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
            <textarea cols="30" rows="6" value={bio} onChange={(event) => setBio(event.target.value)} className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'>
              {bio}
            </textarea>
            <select value={filiere} onChange={(event) => setFiliere(event.target.value)} className='my-3 shadow appearance-none border rounded w-[300px] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'>
              {filieres && filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.id}>{filiere.label}</option>
              ))}
            </select>

            <div className="flex flex-wrap my-3">
              {skills && skills.map((skill) => (
                <div key={skill.id} className="bg-purple-700 text-white rounded-lg mx-2 px-1">
                  <input
                    type="checkbox"
                    value={skill.id}
                    onChange={handleCheckBoxChangeComp}
                    defaultChecked={comp.includes(skill.id) ? 'checked' : ''}
                  />
                  <label htmlFor={skill.id}>{skill.label}</label>
                </div>
              ))}
            </div>
            <div className="flex flex-col">

              {contacts.map((contact, index) => (
                <div key={index} className="flex justify-center items-center">
                  <select
                    value={contact.typeContact}
                    onChange={(e) => handleChange(index, 'typeContact', e.target.value)}
                    className='my-3 shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline w-1/2'
                  >
                    {typeContact && typeContact.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    className='my-3 shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline w-4/5'
                  />
                  <div><button onClick={() => setContacts(contacts.filter((_, i) => i !== index))} ><FaTrashAlt className='text-red-500 ml-2'/></button></div>
                </div>
              ))}
            </div>
              <div><button onClick={handleAddContact} className='text-white bg-purple-700 rounded-lg p-2'>Ajouter un Contact</button></div>
            <div className='flex flex-wrap flex-row gap-2 border border-purple-700 mt-2 mx-1'>
              {avatars && avatars.map((avatar) => (
                <div key={avatar.id}>
                  <input
                    type="radio"
                    value={avatar.id}
                    defaultChecked={picture === avatar.id}
                    onChange={handleSwitchPicture}
                    name="avatar"
                  />
                  <img
                    src={`${apiRoot}/images/avatars/${avatar.imagePath}`}
                    alt={avatar.imagePath}
                  />
                </div>
              ))}
            </div>
            <button type='submit' className='mt-5 w-[200px] bg-purple-800 text-white rounded-lg'>Enregistrer</button>

          </form>
        </div>
  )
}

export default EditProfile