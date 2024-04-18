import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchAllProjectPosts } from '../../redux/post/postSlice';
import { Link } from 'react-router-dom';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import { convertDate } from '../../tools/miscelaneousTools';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';

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
        <h1>Liste des projets</h1>
        {allProjectPosts && allProjectPosts.map((post) => (
            <div key={post.id} className='bg-green-400 text-black mt-1'>
                <Link to={`/project/${post.project.id}`}>{post.titre}</Link>
                <p>{post.content}</p>
                <p>{convertDate(post.dateCreation) }</p>
                <p>{convertDate(post.dateModified)}</p>
                <p>{post.creator.firstName} {post.creator.name}</p>
                {isLoading ? <ButtonLoader />
                 : (isSent.includes(post.project.id)
                  ? <button disabled>Invitation envoyé</button>
                   : <button onClick={(e) => handleClick(e, post.project.id)}>Participer</button>)}
            </div>
        ))}
        
    </div>
  )
}

export default ProjectList