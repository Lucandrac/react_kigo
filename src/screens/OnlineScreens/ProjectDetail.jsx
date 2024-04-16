import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchProjectPost } from '../../redux/post/postSlice';
import ButtonLoader from '../../components/Loaders/ButtonLoader';

const ProjectDetail = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const { projectPost, loading } = useSelector(selectPostData);
    useEffect(() => {
        dispatch(fetchProjectPost(params.id));
    }, [])
    
    return (
     loading ? <ButtonLoader /> :
    <div>
        <h1>{ projectPost.post ? projectPost.post.titre : 'nothing'}</h1>
        <p>{ projectPost.post ? projectPost.post.content : 'nothing'}</p>
        <p>{ projectPost.post ? projectPost.post.dateCreation : 'nothing'}</p>
        <p>{ projectPost.post ? projectPost.post.dateModified : 'nothing'}</p>
        <p>{ projectPost.post ? projectPost.post.creator.firstName : 'nothing'} { projectPost.post ? projectPost.post.creator.name : 'nothing'}</p>
        <p>{ projectPost ? projectPost.isOpen ? 'Ouvert' : 'Ferme' : 'nothing'}</p>
        <p>{ projectPost ? projectPost.isFinished ? 'Termine' : 'En cours' : 'nothing'}</p>
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
                <p key={participant.id}>{participant.firstName} {participant.lastName}</p>
            ))
            }
        </div>
    </div>
  )
}

export default ProjectDetail