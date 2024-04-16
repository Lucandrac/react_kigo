import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const HomeOnline = () => {

  const user = JSON.parse(localStorage.getItem('userInfos'));

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