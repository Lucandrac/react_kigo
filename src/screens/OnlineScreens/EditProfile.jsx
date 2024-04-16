import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomInput from '../../components/CustomInput';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';
import { fetchFilieres } from '../../redux/filiere/filiereSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFiliereData } from '../../redux/filiere/filiereSelector';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import { fetchSkills } from '../../redux/skill/skillSlice';
import { selectSkillData } from '../../redux/skill/skillSelector';


const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [filiere, setFiliere] = useState('');
  const dispatch = useDispatch();
  const { filieres, loading } = useSelector(selectFiliereData);
  const { skills } = useSelector(selectSkillData);
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profilId, setProfilId] = useState('');
  const [comp, setComp] = useState([]);

  const changeArray = (arr, entity) => {
    const newArr = [];
    arr.forEach((item) => {
      newArr.push(`/api/${entity}/${item}`);
    })
    return newArr
  }


  const fetchProfil = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/profils?page=1&userId=${params.userId}`);
      response.data['hydra:member'][0].filiere ? setFiliere(response.data['hydra:member'][0].filiere.id) : setFiliere(1);
      setBio(response.data['hydra:member'][0].biography);
      setProfilId(response.data['hydra:member'][0].id);
      response.data['hydra:member'][0].skills.forEach((skill) => {
        setComp((prevComp) => [...prevComp, skill.id]);
      });
      setIsLoading(false);
    } catch (error) {
      console.log('Erreur lors de la récupération du profil : ' + error);
    }
  }

  useEffect(() => {
    dispatch(fetchSkills());
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
      filiere: filiereApi,
      skills: changeArray(comp, 'skills')
    });

    navigate(`/profil/${params.userId}`);

  }

  const handleCheckBoxChangeComp = (event) => {
    const targetValue = event.target.value;
    if (event.target.checked && !comp.includes(targetValue)) {
      setComp((prevComp) => [...prevComp, targetValue]);
    } else {
      setComp((prevComp) => prevComp.filter((c) => c !== targetValue));
    }
  }

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
            <button type="submit">Submit</button>
          </form>
        </div>
  )
}

export default EditProfile