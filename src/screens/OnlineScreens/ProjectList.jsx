import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchAllProjectPosts } from '../../redux/post/postSlice';
import { Link } from 'react-router-dom';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import { convertDate } from '../../tools/miscelaneousTools';
import axios from 'axios';
import { apiRoot, apiUrl } from '../../constants/apiConstants';

const ProjectList = () => {

    const dispatch = useDispatch();
    const { allProjectPosts, loading } = useSelector(selectPostData); 
    const user = JSON.parse(localStorage.getItem('userInfos'));

    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState([]);

    useEffect(() => {
        dispatch(fetchAllProjectPosts());
        setIsSent(JSON.parse(localStorage.getItem('isSent')) || []);
    }, [])

    const handleClick = async (e, id) => {
        e.preventDefault();
     
        setIsLoading(true);
        //on créer une invitation
        try {
             axios.defaults.headers.post['Content-Type'] = 'application/ld+json';

        await axios.post(`${apiUrl}/invites`, {
            userId: `/api/users/${user.userId}`,
            project: `/api/projects/${id}`,
            isActive: true,
            dateCreated: new Date(),
        });
        setIsLoading(false);
        setIsSent([...isSent, id]);
        localStorage.setItem('isSent', JSON.stringify([...isSent, id]));

        } catch (error) {
            console.log("Erreur lors de l'envoi de l'invitation : " + error);
            setIsLoading(false);

        }
    }
    
  return (
    loading ? <ButtonLoader /> :
    <div className='flex flex-col'>
         <h1 className='text-3xl font-bold mb-3 text-purple-900 lg:text-center mt-2'>Liste des projets</h1>
        {allProjectPosts && allProjectPosts.map((post) => (
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
           <Link to={`/project/${post.project.id}`}><p className='ml-4 text-purple-900 font-bold lg:text-center lg:text-xl'>{post.titre}</p></Link>
           }
        {!(post.isOpen || post.creator !== `/api/users/${user.userId}`) ? <p>Impossible de rejoindre</p> :
                                isLoading ? <ButtonLoader />
                                : (isSent.includes(post.project.id)
                                ? <button disabled className='text-purple-800 text-sm ml-3'>Invitation envoyé</button>
                                : <button onClick={(e) => handleClick(e, post.project.id)} className='text-purple-800 text-sm ml-3 bg-purple-300 rounded px-2'>Participer</button>)}
         </div>
        ))}
                
    </div>
  )
}
export default ProjectList