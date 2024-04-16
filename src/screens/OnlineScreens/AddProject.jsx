import React, { useEffect, useState } from 'react'
import CustomInput from '../../components/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectSkillData } from '../../redux/skill/skillSelector';
import { selectFiliereData } from '../../redux/filiere/filiereSelector';
import filiereSlice, { fetchFilieres } from '../../redux/filiere/filiereSlice';
import { fetchSkills } from '../../redux/skill/skillSlice';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';
import { useNavigate, useParams } from 'react-router-dom';

const AddProject = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const { filieres, loading } = useSelector(selectFiliereData);
    const { skills } = useSelector(selectSkillData);

    const [fils, setFils] = useState([]);
    const [comp, setComp] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const navigate = useNavigate();
    
    const changeArray = (arr, entity) => {
        const newArr = [];
        arr.forEach((item) => {
            newArr.push(`/api/${entity}/${item}`);
        })
        return newArr
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //change headers
            axios.defaults.headers.post['Content-Type'] = 'application/ld+json';

            //on crée d'abord le post
            const response = await axios.post(`${apiUrl}/posts`, {
                titre: title,
                content: text,
                dateCreation: new Date(),
                dateModified: new Date(),
                creator: `/api/users/${params.userId}`,
                genre: '/api/genres/1',
            });

            console.log('poste crée')
            //puis le projet qui va être linké au post
            await axios.post(`${apiUrl}/projects`, {
                filieres: changeArray(fils, 'filieres'),
                skills: changeArray(comp, 'skills'),
                isOpen: true,
                isFinished: false,
                post: `/api/posts/${response.data.id}`,
            });
            console.log('projet crée')
    
            navigate(`/profil/${params.userId}`);
        } catch (error) {
            console.log('Erreur lors de la création du projet : ' + error);
        }

        
    }

    const handleCheckboxChangeFils = (event) => {
        const targetValue = event.target.value;
        if (event.target.checked) {
          setFils((prevFils) => [...prevFils, targetValue]);
        } else {
          setFils((prevFils) => prevFils.filter((f) => f !== targetValue));
        }
    };

    const handleCheckBoxChangeComp = (event) => {
        const targetValue = event.target.value;
        if (event.target.checked) {
          setComp((prevComp) => [...prevComp, targetValue]);
        } else {
          setComp((prevComp) => prevComp.filter((c) => c !== targetValue));
        }
    }

    useEffect(() => {
        dispatch(fetchSkills());
        dispatch(fetchFilieres());
    }, [])

  return (
    loading ? <ButtonLoader /> :
    <div className="bg-black text-white flex flex-col">
        <h1>AddProject</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
            <CustomInput label={'Titre'} type={'text'} state={title} callable={(event) => setTitle(event.target.value)}/>
            {/* change to textarea */}
            <textarea cols="30" rows="10" value={text} onChange={(event) => setText(event.target.value)}></textarea> 
            <h2>Filieres attendues</h2>
            <div className="flex flex-wrap">
                {filieres && filieres.map((filiere) => (
                    <div key={filiere.id}>
                        <input type="checkbox" value={filiere.id} onChange={handleCheckboxChangeFils}/>
                        <label htmlFor={filiere.id}>{filiere.label}</label>
                    </div>
                ))}
            </div>
            <h2>Compétences attendues</h2>
            <div className="flex flex-wrap">
                {skills && skills.map((skill) => (
                    <div key={skill.id}>
                        <input type="checkbox" value={skill.id} onChange={handleCheckBoxChangeComp}/>
                        <label htmlFor={skill.id}>{skill.label}</label>
                    </div>
                ))}
            </div>

            <button type="submit">Ajouter</button>
        </form>
    </div>
  )
}

export default AddProject