import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../constants/apiConstants'
import { Link, useParams } from 'react-router-dom'
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { selectPostData } from '../../redux/post/postSelector';
import { fetchNormalPosts, fetchProjectPosts } from '../../redux/post/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate } from '../../tools/miscelaneousTools';

const UserProfile = () => {

  const [profil, setProfil] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {posts, normalPosts, loading } = useSelector(selectPostData);
  const dispatch = useDispatch();


  const params = JSON.parse(localStorage.getItem('userInfos'));
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
    dispatch(fetchProjectPosts());
    dispatch(fetchNormalPosts());
  }, []);

  return (
    loading ? <ButtonLoader /> :
    isLoading ? <ButtonLoader /> :
    <div>
      {/* avatar ici */}
      <h1>{profil.userId.name} {profil.userId.firstName}</h1>
      
      <h3>{profil.filiere ? profil.filiere.label : 'filiere non renseignée'}</h3>
      <p>{profil?.biography}</p>
      {profil.userId.id === JSON.parse(localStorage.getItem('userInfos')).userId && (
        <Link to={`/editprofil/${profil.userId.id}`}>Modifier mon profil</Link>
      )}
     <h2>Projets crées</h2>
      {posts && posts.map((post) => (
        <div key={post.id} className='bg-green-400 text-black'>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>{convertDate(post.dateCreation)}</p>
          <p>{convertDate(post.dateModified)}</p>
          <p>{post.creator.firstName} {post.creator.name}</p>
          <p>{post.project.isOpen ? 'Ouvert' : 'Ferme'}
          </p>
          <Link to={`/project/${post.project.id}`}>Voir le projet</Link>
        </div>
      ))}
     <h2>Projets participés</h2>
     {/* ici, on peut aller chercher les posts avec des projects qui ont ce type là en participants TODO: */}
     <h2>Posts</h2>
     {normalPosts && normalPosts.map((post) => (
       <div key={post.id} className='bg-green-500 text-black'>
         <h3>{post.title}</h3>
         <p>{post.content}</p>
         <p>{convertDate(post.dateCreation)}</p>
         <p>{convertDate(post.dateModified)}</p>
         <p>{post.creator.firstName} {post.creator.name}</p>
         </div>
     ))}
    </div>
  )
}

export default UserProfile