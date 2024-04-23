import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchProjectPost } from '../../redux/post/postSlice';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { apiRoot, apiUrl } from '../../constants/apiConstants';
import { convertDate } from '../../tools/miscelaneousTools';

const ProjectDetail = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('userInfos'));
    const { projectPost, loading } = useSelector(selectPostData);

    //on initialise les states
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    //on récupère le bon projet en fonction des params
    useEffect(() => {
        dispatch(fetchProjectPost(params.id));
    }, [params])

    const [isSent, setIsSent] = useState([]);

    useEffect(() => {
        setIsSent(JSON.parse(localStorage.getItem('isSent')) || []);
    }, [])

    //envoyer une invitation
    const handleClick = async (e, id) => {
        e.preventDefault();
     
        setIsLoading(true);
        //on créer une invitation
        try {
             axios.defaults.headers.post['Content-Type'] = 'application/ld+json';
            //on envoie une demande de rejoindre ce projet avec l'utilisateur connecté
        await axios.post(`${apiUrl}/invites`, {
            userId: `/api/users/${user.userId}`,
            project: `/api/projects/${id}`,
            isActive: true,
            dateCreated: new Date(),
        });
        setIsLoading(false);
        //on enregistre l'id dans le localStorage pour que l'utilisateur ne spam pas d'invitations
        setIsSent([...isSent, id]);
        localStorage.setItem('isSent', JSON.stringify([...isSent, id]));

        } catch (error) {
            console.log("Erreur lors de l'envoi de l'invitation : " + error);
            setIsLoading(false);

        }
    }

    //accepter la demande de rejoindre le projet
    const handleAccept = async (id, projectId) => {
        setIsLoading(true);
        try {
          axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
          //on désactive l'invitation
          await axios.patch(`${apiUrl}/invites/${id}`, {
            isActive: false,
          })
          //on ajoute l'utilisateur à la liste de participant
          const project = allParticipatingProjects.find((project) => project.id === projectId);
          await axios.patch(`${apiUrl}/projects/${projectId}`, {
            participant: [...project.participant, `/api/users/${user.userId}`],

          })
          setIsLoading(false);
          dispatch(fetchProjectPost(params.id));
        } catch (error) {
          console.log("Erreur lors de l'acceptation de l'invitation : " + error);
          setIsLoading(false);
        }
      }
      //refuser la demande
      const handleRefuse = async (id) => {
        setIsLoading(true);
        try {
          axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
          //on désactive l'invitation et c'est tout
          await axios.patch(`${apiUrl}/invites/${id}`, {
            isActive: false,
          })
          setIsLoading(false);
          dispatch(fetchProjectPost(params.id));
    
        } catch (error) {
          console.log("Erreur lors du refus de l'invitation : " + error);
          setIsLoading(false);
        }
      }

      //envoyer un message
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            axios.defaults.headers.post['Content-Type'] = 'application/ld+json';
            await axios.post(`${apiUrl}/messages`, {
                project: `/api/projects/${params.id}`,
                content: message,
                dateCreated: new Date(),
            })
            setIsLoading(false);
            setMessage('');
            dispatch(fetchProjectPost(params.id));
        } catch (error) {
            console.log("Erreur lors de l'envoi du message : " + error);
        }
        
      }

      //fermer le projet
      const handleClose = async () => {
        setIsLoading(true);
        try {
          axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
          await axios.patch(`${apiUrl}/projects/${projectPost.id}`, {
            isOpen: false,
          })
          setIsLoading(false);
          dispatch(fetchProjectPost(params.id));
        } catch (error) {
          console.log("Erreur lors de la fermeture du message : " + error);
          setIsLoading(false);
        }
      }

      //ouvrir le projet
      const handleOpen = async () => {
        setIsLoading(true);
        try {
          axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
          await axios.patch(`${apiUrl}/projects/${projectPost.id}`, {
            isOpen: true,
          })
          setIsLoading(false);
          dispatch(fetchProjectPost(params.id));
        } catch (error) {
          console.log("Erreur lors de la fermeture du message : " + error);
          setIsLoading(false);
        }
      }

      //le projet est fini
      const handleFinish = async () => {
        setIsLoading(true);
        try {
          axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
          await axios.patch(`${apiUrl}/projects/${projectPost.id}`, {
            isFinished: false,
          })
          setIsLoading(false);
          dispatch(fetchProjectPost(params.id));
        } catch (error) {
          console.log("Erreur lors de la fermeture du message : " + error);
          setIsLoading(false);
        }
      }

    return (
        console.log(projectPost),
        isLoading ? <ButtonLoader /> :
        loading ? <ButtonLoader /> :
            <div className='lg:flex lg:flex-col lg:justify-center lg:items-center'>
              {/* envoyer une invitation, seulement possible si le projet est ouvert, et que l'utilisateur n'est pas le createur, et que l'invitation n'est pas été déjà envoyée */}
        {!(projectPost.post.isOpen || projectPost.post.creator.id !== user.userId) ? <p></p> :
              isLoading ? <ButtonLoader />
                : (isSent.includes(projectPost.id)
                  ? <button disabled className='text-purple-800 text-sm ml-3 float-right'>Invitation envoyé</button>
                  : <button onClick={(e) => handleClick(e, projectPost.id)} className='text-purple-800 text-sm m-3 bg-purple-300 rounded px-2 float-right'>Participer</button>)
                  }
                <h1 className='text-3xl font-bold text-purple-900 m-3 lg:text-5xl lg:text-center'>
                  {projectPost.post ? projectPost.post.titre : 'nothing'}
                </h1>
                {projectPost.post && projectPost.post.media[0] && 
                <div className="flex justify-center"><img src={`${apiRoot}/upload/${projectPost.post.media[0].url}`} alt="image" className='rounded-2xl w-3/4 lg:w-1/3'/></div>
                }
                <p className='text-center text-lg text-purple-600'>{projectPost.post ? projectPost.post.content : 'nothing'}</p>
                {/* <p>{projectPost.post ? projectPost.post.dateCreation : 'nothing'}</p>
                <p>{projectPost.post ? projectPost.post.dateModified : 'nothing'}</p> */}
                <p className='text-lg text-purple-600 ml-3'>Créateur : 
                 <Link to={projectPost.post ? `/profil/${projectPost.post.creator.id}` : '/'} className='underline'>
                   {projectPost.post ? projectPost.post.creator.firstName : 'Créateur inconnu'} 
                  {projectPost.post ? projectPost.post.creator.name : 'Créateur inconnu'}</Link>
                  </p>
                {projectPost ? projectPost.isOpen ?
                    <p className='text-lg ml-3 text-green-700'>Ouvert</p> : <p className='text-lg ml-3 text-red-800'>Fermé</p> 
                    : 'nothing'
                 }
                 {projectPost ? projectPost.isFinished ?
                    <p className='text-lg ml-3 text-red-800'>Terminé</p> : <p className='text-lg ml-3 text-green-700'>En cours</p> 
                    : 'nothing'
                 }
                  <h2 className='text-lg text-purple-600 text-center'>Compétences souhaitées</h2>
                <div className='flex ml-2 flex-wrap'>
                    {projectPost && projectPost.skills && projectPost.skills.map((skill) => (
                        <p key={`skill_${skill.id}`} className='bg-purple-700 text-white rounded-lg px-2'>{skill.label}</p>
                    ))}
                </div>
                <h2 className='text-lg text-purple-600 text-center'>Filières souhaitées</h2>
                <div className='flex ml-2 flex-wrap'>
                    {projectPost && projectPost.filieres && projectPost.filieres.map((filiere) => (
                        <p key={`filliere_${filiere.id}`} className='bg-purple-700 text-white rounded-lg px-2'>{filiere.label}</p>
                    ))}
                </div>
                <h2 className='text-lg text-purple-600 text-center'>Participants</h2>
                <div>
                    {projectPost && projectPost.participant && projectPost.participant.map((participant) => (
                        <p key={participant.id} className='ml-4 text-purple-800'><Link to={`/profil/${participant.id}`} className='underline'>{participant.firstName} {participant.name}</Link></p>
                    ))
                    }
                </div>
                <div>
                    {projectPost && projectPost.invites && projectPost.post.creator.id === user.userId && projectPost.invites.map((invite) =>
                    (invite.isActive ?
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
                        : null
                    )
                    )
                    }
                </div>
                <h3 className='text-lg text-purple-600 text-center'>Messages</h3>
                <div>
                    {projectPost && projectPost.messages && projectPost.messages.map((message) => (
                        <p key={message.id} className='ml-4 text-white bg-gray-400 rounded-lg px-3'>{message.content} <span className='text-sm text-gray-600 float-right'>{convertDate(message.dateCreated)}</span></p>
                    ))}
                    {projectPost && projectPost.post && projectPost.post.creator.id === user.userId ?
                    <div>
                      <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col justify-center items-center'>
                          <textarea value={message} onChange={(e) => setMessage(e.target.value)} cols="30" rows="5" className='text-black w-3/4 border border-purple-700 m-1'></textarea>
                          <button type='submit' className='bg-purple-700 text-white rounded-lg px-3'>Envoyer</button>
                      </form>
                      <div className="flex my-3 justify-center">
                      {projectPost ? projectPost.isOpen ?
                    <button onClick={handleClose} className='bg-purple-700 text-white rounded-lg px-3 mr-2'>Fermer le projet</button>
                     : <button onClick={handleOpen} className='bg-purple-700 text-white rounded-lg px-3 mr-2'>Rouvrir le projet</button>
                    : 'nothing'
                 }
                 {projectPost ? projectPost.isFinished ?
                    <p className='text-lg ml-3 text-red-800'>Terminé</p> : <button onClick={handleFinish} className='bg-purple-700 text-white rounded-lg px-3'>Terminer le projet</button>
                    : 'nothing'
                 }
                      </div>
                    </div>
                    : null
                }
                </div>

            </div>
    )
}

export default ProjectDetail