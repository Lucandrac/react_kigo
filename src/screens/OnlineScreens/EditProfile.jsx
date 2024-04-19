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


const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [filiere, setFiliere] = useState('');
  const dispatch = useDispatch();
  const { filieres, loading } = useSelector(selectFiliereData);
  const { typeContact } = useSelector(selectTypeContactData);
  const { skills } = useSelector(selectSkillData);
  const params = JSON.parse(localStorage.getItem('userInfos'));
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profil, setProfil] = useState({});
  const [profilId, setProfilId] = useState('');
  const [comp, setComp] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { avatars } = useSelector(selectAvatarData);
  const [picture, setPicture] = useState('');



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

  useEffect(() => {
    if (profil.contacts) {
      setContacts(profil.contacts.map((contact) => ({
        typeContact: contact.type.id,
        value: contact.value,
      })))
    }
  }, [profil.contacts])

  const handleSubmit = async (event) => {
    event.preventDefault();
    //change headers
    axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';

    const filiereApi = `/api/filieres/${filiere}`;
    await axios.patch(`${apiUrl}/profils/${profilId}`, {
      biography: bio,
      filiere: filiereApi,
      skills: changeArray(comp, 'skills'),
    });

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

  const handleChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
    console.log(contacts);
  };

  const handleSwitchPicture = (event) => {
    setPicture(event.target.value);
    
  }

  const handleCheckBoxChangeComp = (event) => {
    const targetValue = event.target.value;
    if (event.target.checked && !comp.includes(targetValue)) {
      setComp((prevComp) => [...prevComp, targetValue]);
    } else {
      setComp((prevComp) => prevComp.filter((c) => c != targetValue));
    }
  }

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
        <div className="bg-black text-white flex flex-col">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} >
            <textarea cols="30" rows="10" value={bio} onChange={(event) => setBio(event.target.value)}>
              {bio}
            </textarea>
            <select value={filiere} onChange={(event) => setFiliere(event.target.value)}>
              {filieres && filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.id}>{filiere.label}</option>
              ))}
            </select>

            <div className="flex flex-wrap">
              {skills && skills.map((skill) => (
                <div key={skill.id}>
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
                <div key={index} className="flex">
                  <select
                    value={contact.typeContact}
                    onChange={(e) => handleChange(index, 'typeContact', e.target.value)}
                  >
                    {typeContact && typeContact.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                  />
                  <div><button onClick={() => setContacts(contacts.filter((_, i) => i !== index))}>Delete</button></div>
                </div>
              ))}
            </div>
            <div className='flex flex-wrap flex-row gap-2'>
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
            <div><button onClick={handleAddContact}>Add Contact</button></div>
            <button type="submit">Submit</button>
          </form>
        </div>
  )
}

export default EditProfile