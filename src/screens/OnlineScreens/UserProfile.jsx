import React, { useEffect, useState } from 'react'
import { apiRoot, apiUrl } from '../../constants/apiConstants'
import { Link, useParams } from 'react-router-dom'
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { selectPostData } from '../../redux/post/postSelector';
import { fetchAllParticipatingProjects, fetchNormalPosts, fetchProjectPosts } from '../../redux/post/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate } from '../../tools/miscelaneousTools';
import { FaEdit } from 'react-icons/fa';


const UserProfile = () => {

  const [profil, setProfil] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { posts, normalPosts, loading, allParticipatingProjects } = useSelector(selectPostData);
  const dispatch = useDispatch();


  const params = useParams();
  //on recupère le profil de l'utilisateur avec son id passé en paramètre (pas forcément celui qui est connecté)
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

  //on récupère les posts de l'utilisateur, les projets auquels il a participé et les projets crées
  useEffect(() => {
    fetchProfil();
    dispatch(fetchAllParticipatingProjects(params.userId));
    dispatch(fetchProjectPosts(params.userId));
    dispatch(fetchNormalPosts(params.userId));
  }, [params]);

  return (
    loading ? <ButtonLoader /> :
      isLoading ? <ButtonLoader /> :
        <div>
          <div className="flex m-5">
            {profil.userId.avatar ? <img src={`${apiRoot}/images/avatars/${profil.userId.avatar.imagePath}`} alt="avatar" /> : <img src={`${apiRoot}/images/avatars/avatar1.png`} alt="avatar" />}
            <div className="flex flex-col ml-3">
              <h1 className='text-3xl text-purple-800 text-bold'>{profil.userId.name} {profil.userId.firstName}</h1>

              <h3 className='text-xl text-purple-800'>{profil.filiere ? profil.filiere.label : 'filiere non renseignée'}</h3>
            </div>
          </div>
          {profil.userId.id === JSON.parse(localStorage.getItem('userInfos')).userId && (
            <Link to={`/editprofil/${profil.userId.id}`}><FaEdit className='text-3xl text-purple-800 absolute top-0' /></Link>
          )}
          <p className='m-5 text-sm text-black lg:text-center lg:text-lg'>{profil.biography ? profil?.biography : 'biographie non renseignée'}</p>
          <h2 className='mt-3 text-purple-800 text-center lg:text-2xl'>Compétences : </h2>
          <div className="flex lg:justify-center">
            {profil.skills && profil.skills.map((skill) => (
              <div key={skill.id} className='m-3'>
                <p className='text-sm text-purple-800 lg:text-lg'>{skill.label}</p>
              </div>
            ))}
          </div>
            <h2 className='mt-3 text-purple-800 text-center lg:text-2xl'>Contacts</h2>
            {profil.contacts && profil.contacts.map((contact) => (
              <div key={contact.id} className='m-3'>
                <p className='text-sm text-purple-800 lg:text-lg'>{contact.type.label} : {contact.value}</p>
              </div>
            ))}

          <h2 className='mt-3 text-purple-800 text-center lg:text-2xl'>Projets crées : </h2>
          {posts && posts.map((post) => (
             <div key={post.id} className='mb-3'>
             <div className="flex">
               {post.creator.avatar &&
               <img src={`${apiRoot}/images/avatars/${post.creator.avatar.imagePath}`} alt="profil" className='w-8 h-8 lg:w-12 lg:h-12'/>
               }
               <div className="flex flex-col lg:text-lg">
                 <Link to={`/profil/${post.creator.id}`}>
                   <p className="font-bold text-purple-700 underline">{post.creator.firstName}</p>
                 </Link>
                 <p className='text-sm lg:text-lg'>{post.creator.profil.filiere.label}</p>
               </div>
             </div>
             { post.media && post.media.length > 0 &&
             <div className="flex justify-center"><img src={`${apiRoot}/upload/${post.media[0].url}`} alt="image projet" className='rounded-2xl w-3/4 lg:w-1/3'/></div>
             }
             {post.project && 
             <Link to={`/project/${post.project.id}`}><p className='ml-4 text-purple-900 font-bold lg:text-center'>{post.titre}</p></Link>
             }
           </div>
          ))}
          <h2 className='mt-3 text-purple-800 text-center lg:text-2xl'>Projets participés</h2>
          {allParticipatingProjects && allParticipatingProjects.map((project) => (
        <div key={project.id} className='mb-3'>
        <div className="flex">
          <img src={`${apiRoot}/images/avatars/${project.creator.avatar.imagePath}`} alt="profil" className='w-8 h-8 lg:w-12 lg:h-12'/>
          <div className="flex flex-col">
            <Link to={`/profil/${project.creator.id}`}>
              <p className="font-bold text-purple-700 underline lg:text-lg">{project.creator.firstName}</p>
            </Link>
            <p className='text-sm lg:text-lg'>{project.creator.profil.filiere.label}</p>
          </div>
        </div>
        { project.media && project.media.length > 0 &&
        <div className="flex justify-center"><img src={`${apiRoot}/upload/${project.media[0].url}`} alt="image projet" className='rounded-2xl w-3/4 lg:w-1/3'/></div>
        }
        <Link to={`/project/${project.project.id}`}><p className='ml-4 text-purple-900 font-bold lg:text-center'>{project.titre}</p></Link>
      </div>
      ))}
          <h2 className='mt-3 text-purple-800 text-center lg:text-2xl'>Posts</h2>
          {normalPosts && normalPosts.map((post) => (
            <div key={post.id} className='mb-6 bg-purple-300 mx-3 rounded-2xl py-3 pb-6'>
              <div className="flex justify-center">
                {post.media && post.media.map((media) => (
                  <img src={`${apiRoot}/upload/${media.url}`} alt={media.label} className='w-3/4 rounded-2xl lg:w-1/3'/>
                ))}
              </div>
              <h3 className='ml-4 text-purple-900 font-bold text-lg lg:text-center'>{post.titre}</h3>
              <p className='mx-6 text-purple-900 text-sm'>{post.content}</p>
              <p className='float-right text-gray-500 text-xs'>{convertDate(post.dateCreation)}</p>
            </div>
          ))}
        </div>
  )
}

export default UserProfile