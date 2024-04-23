import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../../components/CustomInput';
import { apiRoot } from '../../constants/apiConstants';
import axios from 'axios';
import { useAuthContext } from '../../contexts/AuthContext';
import ButtonLoader from '../../components/Loaders/ButtonLoader';

const Register = () => {

  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //on récupère la méthode signIn du contexte d'authentification
  const { signIn } = useAuthContext();
  //on récupère le hook de navigation
  const navigate = useNavigate();

  const isAdmin = false;

  const handleSubmit = (event) => {
    event.preventDefault(); //empeche le fonctionnement par defaut du formulaire
    setIsLoading(true);
    axios.post(`${apiRoot}/register`, {
      name,
      firstName,
      email,
      password,
      isAdmin
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
      }else{
        setIsLoading(false);
        console.log('Erreur lors de la réponse serveur : ' + response );
      }
      
    }).catch((error) => {
      setIsLoading(false);
      console.log('Erreur lors de l\'enregistrement : ' + error);
    });
  }

  return (
    <div className='flex flex-1 flex-col h-screen justify-start items-center'>
        <img className="absolute top-0 z-[-1]" src={`background.svg`} alt='background'/>
        <img src={`${apiRoot}/images/logo.png`} alt="logo kigo" className='pt-12' />

      <form onSubmit={handleSubmit} className='max-w-md mx-auto'>

        <CustomInput state={name} label='Nom' type='text' callable={(event) => setName(event.target.value)} />
        <CustomInput state={firstName} label='Prénom' type='text' callable={(event) => setFirstName(event.target.value)} />

        <CustomInput state={email} label='Email' type='email' callable={(event) => setEmail(event.target.value)} />

        <CustomInput state={password} label='Mot de passe' type='password' callable={(event) => setPassword(event.target.value)} />

        <Link to='/' className='text-gray-400 hover:text-gray-300 hover:underline '>Vous avez déjà un compte ?</Link>
        <div className="flex items-center justify-center pt-5">
        {
							isLoading ? <ButtonLoader /> : 
              <button type='submit' className='mt-12 w-[300px]'><img src={`gobutton.svg`} alt="bouton go" /></button>
						}
        </div>
      </form>
    </div>
  )
}

export default Register