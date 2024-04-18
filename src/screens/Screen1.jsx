import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectInviteData } from '../redux/invite/inviteSelector'
import { fetchInvites } from '../redux/invite/inviteSlice'
import { selectPostData } from '../redux/post/postSelector'
import { fetchAllParticipatingProjects } from '../redux/post/postSlice'
import ButtonLoader from '../components/Loaders/ButtonLoader'
import { convertDate } from '../tools/miscelaneousTools'
import axios from 'axios'
import { apiUrl } from '../constants/apiConstants'

const Screen1 = () => {
  const { invites, loading } = useSelector(selectInviteData);
  const [isLoading, setIsLoading] = useState(false);
  const { allParticipatingProjects } = useSelector(selectPostData);
  const user = JSON.parse(localStorage.getItem('userInfos'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllParticipatingProjects(user.userId));
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
      <h2>Dashboard</h2>
      <h3>Projects en cours : </h3>
      {/* on y met tout les projets encore pas finis */}
      {/* on peut diviser en projets crée et autres */}
      {allParticipatingProjects && allParticipatingProjects.map((project) => (
        <div key={project.id}>
          <p>{project.post.titre}</p>
          <div><Link to={`/project/${project.id}`}>Voir le projet</Link></div>
        </div>
      ))}
      <h3>Demandes : </h3>
      {/* on y met tout les demandes de jointure de projets */}
      {/* il faut faire un bouton pour accepter ou refuser */}
      {/* mettre aussi les vieilles demandes en grisé peut-être ? Non, par contre il faudra faire attention à empécher le spam */}
      {invites && invites.map((invite) => (
        <div key={invite.id} className='bg-red-400 text-black flex'>
          <div>
            <p>{invite.userId.name} {invite.userId.firstName} : {invite.project.post.titre}</p>
            <p>{convertDate(invite.dateCreated)}</p>
          </div>
          <div className='flex flex-col ml-4'>
            <button onClick={() => handleAccept(invite.id, invite.project.id)}>Accepter</button>
            <button onClick={() => handleRefuse(invite.id)}>Refuser</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default Screen1