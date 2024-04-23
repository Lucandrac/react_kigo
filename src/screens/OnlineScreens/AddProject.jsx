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
import { changeArray } from '../../tools/miscelaneousTools';
import { fetchCategories } from '../../redux/category/categorySlice';
import { selectCategoryData } from '../../redux/category/categorySelector';
import { Label } from 'flowbite-react';

const AddProject = () => {

    const dispatch = useDispatch();
    const params = JSON.parse(localStorage.getItem('userInfos'));

    const { filieres, loading } = useSelector(selectFiliereData);
    const { skills } = useSelector(selectSkillData);
    const { categories } = useSelector(selectCategoryData);

    const [fils, setFils] = useState([]);
    const [comp, setComp] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [cat, setCat] = useState('');
    const [image, setImage] = useState(null);


    const navigate = useNavigate();

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

            const formData = new FormData();
            formData.append('file', image);
            formData.append('post', `/api/posts/${response.data.id}`);
            formData.append('postId', response.data.id);

            await axios.post(`${apiUrl}/medias`, formData);

            console.log('poste crée')
            //puis le projet qui va être linké au post
            await axios.post(`${apiUrl}/projects`, {
                filieres: changeArray(fils, 'filieres'),
                skills: changeArray(comp, 'skills'),
                isOpen: true,
                isFinished: false,
                post: `/api/posts/${response.data.id}`,
                category: `/api/categories/${cat}`,
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
        dispatch(fetchCategories());
        dispatch(fetchSkills());
        dispatch(fetchFilieres());
    }, [])

  return (
    loading ? <ButtonLoader /> :
    <div className=" flex flex-col">
        <h1 className="text-3xl text-purple-900 font-bold m-3">Ajouter un Projet</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
            <CustomInput label={'Titre'} type={'text'} state={title} callable={(event) => setTitle(event.target.value)}/>
            <textarea cols="30" rows="6" value={text} onChange={(event) => setText(event.target.value)} className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'></textarea> 
            <h2 className="text-xl text-purple-700 m-2">Filieres attendues</h2>
            <div className="flex flex-wrap justify-center">
                {filieres && filieres.map((filiere) => (
                    <div key={filiere.id} className='m-1'>
                        <input type="checkbox" value={filiere.id} onChange={handleCheckboxChangeFils}/>
                        <label htmlFor={filiere.id} className='m-1 text-purple-700 text-sm'>{filiere.label}</label>
                    </div>
                ))}
            </div>
            <h2 className="text-xl text-purple-700 m-2">Compétences attendues</h2>
            <div className="flex flex-wrap justify-center">
                {skills && skills.map((skill) => (
                    <div key={skill.id} className='m-1'>
                        <input type="checkbox" value={skill.id} onChange={handleCheckBoxChangeComp}/>
                        <label htmlFor={skill.id} className='m-1 text-purple-700 text-sm'>{skill.label}</label>
                    </div>
                ))}
            </div>
            <h2 className="text-xl text-purple-700 m-2">Catégorie</h2>
            <select value={cat} onChange={(event) => setCat(event.target.value)} className='shadow appearance-none border bg-purple-400 rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center text-lg'>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id} >{category.label}</option>
              ))}
            </select>

            <h2 className="text-xl text-purple-700 m-2">Ajouter une image</h2>
                <input type="file"  id="file-upload" onChange={(event) => setImage(event.target.files[0])} 
                className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-purple-400'/>
                
                <button type='submit' className='mt-12 w-[300px]'><img src={`gobutton.svg`} alt="bouton go" /></button>

        </form>
    </div>
  )
}

export default AddProject