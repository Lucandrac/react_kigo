import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { checkUser } from '../../services/userServices';
import { useAuthContext } from '../../contexts/AuthContext';
import { IoMdAddCircle, IoMdHome } from 'react-icons/io';
import { AiFillProject } from 'react-icons/ai';
import { MdOutlinePostAdd } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

const HomeOnline = () => {

  const user = JSON.parse(localStorage.getItem('userInfos'));

  const { signOut } = useAuthContext();
  const navigate = useNavigate();


  const fetchUser = async () => {
    const res = await checkUser(user);
    if (user) {
      return;
    } else {
      signOut();
      navigate('/');
    }
  }

  useEffect(() => {
    fetchUser();
  }, [user])

  return (
    <>
      <img className="absolute top-0 z-[-1] w-full" src={`background.svg`} alt='background' />
      <div className='navbar_color text-white text-center fixed bottom-0 w-full flex justify-center'>
        <div className='m-2'>
          <Link to={'/'} ><IoMdHome className='w-9 h-9' /></Link>
        </div>
        {user && <Link className='m-2' to={`/profil/${user.userId}`}><FaRegUserCircle className='w-9 h-9' /></Link>}
        {/* Link ajouter un projet */}
        <div className='m-2'>
          <Link to={`/addproject`}><IoMdAddCircle className='w-10 h-10' /></Link>
        </div>
        <div className='m-2'>
          <Link to={`/addpost`}><MdOutlinePostAdd className='w-9 h-9' /></Link>
        </div>
        <div className='m-2'>
          <Link to={`/projects`}><AiFillProject className='w-9 h-9' /></Link>
        </div>
        <div className='m-2'>
          <button onClick={() => { signOut(); navigate('/') }}><BiLogOut className='w-9 h-9' /></button>
        </div>
      </div>
      <Outlet />
      <div className="h-[75px]"></div>
    </>

  )
}

export default HomeOnline