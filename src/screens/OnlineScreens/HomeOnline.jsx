import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const HomeOnline = () => {

  const user = JSON.parse(localStorage.getItem('userInfos'));

  return (
    <>
    <div className= 'bg-black text-white text-center'>
      <h1>Screen1</h1>
      {user && <Link to={`/profil/${user.userId}`}>Profil</Link>}
      {/* Link ajouter un projet */}
      <div>

      <Link to={`/addproject/${user.userId}`}>Ajouter un projet</Link>
      </div>
    </div>
        <Outlet />
    </>
  )
}

export default HomeOnline