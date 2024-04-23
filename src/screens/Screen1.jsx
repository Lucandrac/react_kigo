import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectInviteData } from '../redux/invite/inviteSelector'
import { fetchInvites } from '../redux/invite/inviteSlice'
import { selectPostData } from '../redux/post/postSelector'
import { fetchAllParticipatingProjects, fetchProjectPosts } from '../redux/post/postSlice'
import ButtonLoader from '../components/Loaders/ButtonLoader'
import { convertDate } from '../tools/miscelaneousTools'
import axios from 'axios'
import { apiRoot, apiUrl } from '../constants/apiConstants'
import { AiFillDashboard } from 'react-icons/ai'
import { MdOutlineCheckCircleOutline } from 'react-icons/md'
import { RxCrossCircled } from 'react-icons/rx'

const Screen1 = () => {
  const { invites, loading } = useSelector(selectInviteData);
  const [isLoading, setIsLoading] = useState(false);
  const { allParticipatingProjects, posts } = useSelector(selectPostData);
  const user = JSON.parse(localStorage.getItem('userInfos'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllParticipatingProjects(user.userId));
    dispatch(fetchProjectPosts(user.userId));
  }, [dispatch, user.userId])

  useEffect(() => {
    setIsLoading(true);
    const fetchInvitePromises = allParticipatingProjects.map(project => dispatch(fetchInvites(project.id)));

    Promise.all(fetchInvitePromises)
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        console.log("Error fetching invites: " + error);
        setIsLoading(false);
      });
  }, [dispatch, allParticipatingProjects])
  
  const handleAccept = async (id, projectId) => {
    setIsLoading(true);
    try {
      axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';

      await axios.patch(`${apiUrl}/invites/${id}`, {
        isActive: false,
      })
      const project = allParticipatingProjects.find((project) => project.id === projectId);
      await axios.patch(`${apiUrl}/projects/${projectId}`, {
        participant: [...project.participant, `/api/users/${user.userId}`],
      })
      setIsLoading(false);
      dispatch(fetchAllParticipatingProjects(user.userId));
    } catch (error) {
      console.log("Erreur lors de l'acceptation de l'invitation : " + error);
      setIsLoading(false);
    }
  }
  const handleRefuse = async (id) => {
    setIsLoading(true);
    try {
      axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';

      await axios.patch(`${apiUrl}/invites/${id}`, {
        isActive: false,
      })
      setIsLoading(false);
      dispatch(fetchAllParticipatingProjects(user.userId));

    } catch (error) {
      console.log("Erreur lors du refus de l'invitation : " + error);
      setIsLoading(false);
    }
  }

  return (
    isLoading ? <ButtonLoader /> :
    loading ? <ButtonLoader /> :
    <>
      <h2 className='text-4xl font-bold text-purple-800'><AiFillDashboard  className='w-5 h-5'/></h2>
      <h3 className='mt-3 text-purple-800 text-center'>Projects en cours : </h3>
      <h4 className='mt-3 text-purple-800 text-center'>Crées : </h4>
      {posts && posts.length > 0 && posts.map((post) => (
        <div key={post.id} className='mb-3'>
          <div className="flex">
            {post.creator.avatar &&
            <img src={`${apiRoot}/images/avatars/${post.creator.avatar.imagePath}`} alt="profil" className='w-8 h-8'/>
            }
            <div className="flex flex-col">
              <Link to={`/profil/${post.creator.id}`}>
                <p className="font-bold text-purple-700 underline">{post.creator.firstName}</p>
              </Link>
              <p className='text-sm'>{post.creator.profil.filiere.label}</p>
            </div>
          </div>
          { post.media && post.media.length > 0 &&
          <div className="flex justify-center"><img src={`${apiRoot}/upload/${post.media[0].url}`} alt="image projet" className='rounded-2xl w-3/4'/></div>
          }
          {post.project && 
          <Link to={`/project/${post.project.id}`}><p className='ml-4 text-purple-900 font-bold'>{post.titre}</p></Link>
          }
        </div>
      ))}
      <h4 className='mt-3 text-purple-800 text-center'>Participant : </h4>
      {allParticipatingProjects && allParticipatingProjects.map((project) => (
        <div key={project.id} className='mb-3'>
        <div className="flex">
          <img src={`${apiRoot}/images/avatars/${project.creator.avatar.imagePath}`} alt="profil" className='w-8 h-8'/>
          <div className="flex flex-col">
            <Link to={`/profil/${project.creator.id}`}>
              <p className="font-bold text-purple-700 underline">{project.creator.firstName}</p>
            </Link>
            <p className='text-sm'>{project.creator.profil.filiere.label}</p>
          </div>
        </div>
        { project.media && project.media.length > 0 &&
        <div className="flex justify-center"><img src={`${apiRoot}/upload/${project.media[0].url}`} alt="image projet" className='rounded-2xl w-3/4'/></div>
        }
        <Link to={`/project/${project.project.id}`}><p className='ml-4 text-purple-900 font-bold'>{project.titre}</p></Link>
      </div>
      ))}
      <h3 className='mt-3 text-purple-800 text-center' >Demandes : </h3>
      {invites && invites.map((invite) => (
        <div key={invite.id} className='bg-purple-300 text-black flex rounded-lg px-3 mx-3'>
          <div>
            <Link to={`/profil/${invite.userId.id}`}>
              <span className='font-bold text-purple-700 underline'>{invite.userId.name} {invite.userId.firstName} :</span>   </Link>
              <Link to={`/project/${invite.project.id}`}><span className='font-bold text-purple-700 underline'>{invite.project.post.titre}</span> </Link>
          
            <p className='text-sm text-gray-600'>{convertDate(invite.dateCreated)}</p>
          </div>
          <div className='flex flex-col ml-4'>
            <button onClick={() => handleAccept(invite.id, invite.project.id)}><MdOutlineCheckCircleOutline className='w-5 h-5 text-green-700 text-bold mx-2 my-1'/></button>
            <button onClick={() => handleRefuse(invite.id)}><RxCrossCircled className='w-5 h-5 text-red-700 text-bold mx-2 my-1'/></button>
          </div>
        </div>
      ))}
    </>
  )
}

export default Screen1