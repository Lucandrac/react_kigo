import React, { useState } from 'react'
import CustomInput from '../../components/CustomInput'
import { apiRoot } from '../../constants/apiConstants'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import ButtonLoader from '../../components/Loaders/ButtonLoader';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    //on récupère la méthode signIn du contexte d'authentification
    const { signIn } = useAuthContext();
    //on récupère le hook de navigation
    const navigate = useNavigate();
  

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    axios.post(`${apiRoot}/login`, {
      email,
      password
    }).then((response) => {
      if (response.data.email) {
        const user = {
          userId: response.data.id,
          email: response.data.email,
          name: response.data.name,
          firstName: response.data.firstName
        }

        try {
          signIn(user);
          setIsLoading(false);
          navigate('/'); //redirection

        } catch (error) {
          setIsLoading(false);
          console.log('Erreur lors de la création de la session : ' + error);
        }
      } else {
        setIsLoading(false);
        console.log('Erreur lors de la réponse serveur : ' + response);
      }

    }).catch((error) => {
      setIsLoading(false);
      console.log('Erreur lors de l\'enregistrement : ' + error);
    });
    }

  return (
    <div className='flex justify-center items-center flex-col'>
      <img className="absolute top-0 z-[-1]" src={`background.svg`} alt='background'/>
        <img src={`${apiRoot}/images/logo.png`} alt="logo kigo" className='pt-12'/>
        <form onSubmit={handleSubmit} className='w-1/3 flex justify-center items-center flex-col'>
            <CustomInput label={'Email'} type={'email'} state={email} callable={(event) => setEmail(event.target.value)}/>
            <CustomInput label={'Mot de passe'} type={'password'} state={password} callable={(event) => setPassword(event.target.value)} />
            <Link to='/register' className='text-gray-400 hover:text-gray-300 hover:underline w-[300px]'>Mot de passe oublié ?</Link>
						{
							isLoading ? <ButtonLoader /> : 
            <button type='submit' className='mt-12 w-[300px]'><img src={`gobutton.svg`} alt="bouton go" /></button>
						}
        </form>
    </div>
  )
}

export default LoginScreen