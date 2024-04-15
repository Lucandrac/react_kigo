import React from 'react'
import { Link } from 'react-router-dom'

const Screen1 = () => {
  const user = JSON.parse(localStorage.getItem('userInfos'));

  return (
    <div className= 'bg-black text-white text-center'>
      <h1>Screen1</h1>
      {user && <Link to={`/profil/${user.userId}`}>Profil</Link>}
      {/* Link ajouter un projet */}
      <div>

      <Link to={`/addproject/${user.userId}`}>Ajouter un projet</Link>
      </div>
    </div>
  )
}

export default Screen1