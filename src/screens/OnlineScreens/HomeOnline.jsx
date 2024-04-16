import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { checkUser } from '../../services/userServices';
import { useAuthContext } from '../../contexts/AuthContext';

const HomeOnline = () => {

  const user = JSON.parse(localStorage.getItem('userInfos'));

  const {signOut} = useAuthContext();
  const navigate = useNavigate();


  const fetchUser = async () => {
    const res = await checkUser(user);
    if(user){
      return;
    }else {
      signOut();
      navigate('/login');
    }
  }

  useEffect(() => {
    fetchUser();
  },[user])

  return (
    <>
    <div className= 'bg-black text-white text-center'>
      <div>
        <Link to={'/'}>Kigo</Link>
      </div>
      {user && <Link to={`/profil/${user.userId}`}>Profil</Link>}
      {/* Link ajouter un projet */}
      <div>
      <Link to={`/addproject/${user.userId}`}>Ajouter un projet</Link>
      </div>
      <div>
        {/* TODO: */}
        <Link to={`/addpost/${user.userId}`}>Ajouter un post</Link> 
      </div>
      <div>
        <Link to={`/projects`}>Liste des projets</Link>
      </div>
    </div>
        <Outlet />
    </>
  )
}

export default HomeOnline