import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchProjectPost } from '../../redux/post/postSlice';
import ButtonLoader from '../../components/Loaders/ButtonLoader';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';

const ProjectDetail = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const { projectPost, loading } = useSelector(selectPostData);
    const [isLoading, setIsLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('userInfos'));
    const [message, setMessage] = useState('');
    useEffect(() => {
        dispatch(fetchProjectPost(params.id));
    }, [])

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
          dispatch(fetchProjectPost(params.id));
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
          dispatch(fetchProjectPost(params.id));
    
        } catch (error) {
          console.log("Erreur lors du refus de l'invitation : " + error);
          setIsLoading(false);
        }
      }

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

    return (
        isLoading ? <ButtonLoader /> :
        loading ? <ButtonLoader /> :
            <div>
                <h1>{projectPost.post ? projectPost.post.titre : 'nothing'}</h1>
                <p>{projectPost.post ? projectPost.post.content : 'nothing'}</p>
                <p>{projectPost.post ? projectPost.post.dateCreation : 'nothing'}</p>
                <p>{projectPost.post ? projectPost.post.dateModified : 'nothing'}</p>
                <p>{projectPost.post ? projectPost.post.creator.firstName : 'nothing'} {projectPost.post ? projectPost.post.creator.name : 'nothing'}</p>
                <p>{projectPost ? projectPost.isOpen ? 'Ouvert' : 'Ferme' : 'nothing'}</p>
                <p>{projectPost ? projectPost.isFinished ? 'Termine' : 'En cours' : 'nothing'}</p>
                <div>
                    {projectPost && projectPost.skills && projectPost.skills.map((skill) => (
                        <p key={`skill_${skill.id}`}>{skill.label}</p>
                    ))}
                </div>
                <div>
                    {projectPost && projectPost.filieres && projectPost.filieres.map((filiere) => (
                        <p key={`filliere_${filiere.id}`}>{filiere.label}</p>
                    ))}
                </div>
                <div>
                    {projectPost && projectPost.participants && projectPost.participants.map((participant) => (
                        <p key={participant.id}>{participant.firstName} {participant.name}</p>
                    ))
                    }
                </div>
                <div>
                    {projectPost && projectPost.invites && projectPost.post.creator.id === user.userId && projectPost.invites.map((invite) =>
                    (invite.isActive ?
                        <div key={invite.id} className='flex flex-col ml-4'>
                            <p key={invite.id}>{invite.userId.firstName} {invite.userId.name}</p>
                            <button onClick={() => handleAccept(invite.id, projectPost.id)}>Accepter</button>
                            <button onClick={() => handleRefuse(invite.id)}>Refuser</button>
                        </div>
                        : null
                    )
                    )
                    }
                </div>
                <h3>Messages</h3>
                <div>
                    {projectPost && projectPost.messages && projectPost.messages.map((message) => (
                        <p key={message.id}>{message.content}</p>
                    ))}
                    {projectPost && projectPost.post && projectPost.post.creator.id === user.userId ?
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} cols="30" rows="10"></textarea>
                        <button type='submit'>Envoyer</button>
                    </form>
                    : null
                }
                </div>

            </div>
    )
}

export default ProjectDetail