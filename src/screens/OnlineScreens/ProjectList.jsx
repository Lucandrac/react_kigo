import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPostData } from '../../redux/post/postSelector';
import { fetchAllProjectPosts } from '../../redux/post/postSlice';
import { Link } from 'react-router-dom';
import ButtonLoader from '../../components/Loaders/ButtonLoader';

const ProjectList = () => {

    const dispatch = useDispatch();
    const { allProjectPosts, loading } = useSelector(selectPostData); 

    useEffect(() => {
        dispatch(fetchAllProjectPosts());
    }, [])
  return (
    loading ? <ButtonLoader /> :
    <div className='flex flex-col'>
        <h1>Liste des projets</h1>
        {allProjectPosts && allProjectPosts.map((post) => (
            <div key={post.id} className='bg-green-400 text-black mt-1'>
                <Link to={`/project/${post.project.id}`}>{post.titre}</Link>
                <p>{post.content}</p>
                <p>{post.dateCreation}</p>
                <p>{post.dateModified}</p>
                <p>{post.creator.firstName} {post.creator.name}</p>
            </div>
        ))}
    </div>
  )
}

export default ProjectList