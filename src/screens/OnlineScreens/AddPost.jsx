import React, { useState } from 'react'
import CustomInput from '../../components/CustomInput';
import { FileInput, Label } from 'flowbite-react';
import axios from 'axios';
import { apiUrl } from '../../constants/apiConstants';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {

    const user = JSON.parse(localStorage.getItem('userInfos'));

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //TODO: Résoudre le bug de l'upload de l'image
        // problème de format multipart/form-data accepter par l'api
        // ApiPlatform\Metadata\ApiResource::__construct(): Argument #31 ($openapi) must be of type ApiPlatform\OpenApi\Model\Operation|bool|null, array given, called in /app/src/Entity/Media.php on line 13
        // ensuite Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://api-kigo.lndo.site/api/posts. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 500.
        try {
            setIsLoading(true);
            axios.defaults.headers.post['Content-Type'] = 'application/ld+json';
            const response = await axios.post(`${apiUrl}/posts`, {
                titre: title,
                content: text,
                dateCreation: new Date(),
                dateModified: new Date(),
                creator: `/api/users/${user.userId}`,
                genre: '/api/genres/2',
            });

            const formData = new FormData();
            formData.append('file', image);
            formData.append('post', `/api/posts/${response.data.id}`);
            formData.append('postId', response.data.id);

            const response2 = await axios.post(`${apiUrl}/medias`, formData);

            navigate(`/profil/${user.userId}`)
            setIsLoading(false);
        } catch (error) {
            console.log('Erreur lors de la création du post : ' + error);
        }
    }

    return (
        <div>
            <h2 className="text-3xl text-purple-900 font-bold m-3 lg:text-center">Ajouter un post</h2>

            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                <CustomInput label={'Titre'} type={'text'} state={title} callable={(event) => setTitle(event.target.value)} />
                <div className="flex flex-col">
                    <h2 className="text-xl text-purple-700 m-2">Texte</h2>
                    <textarea cols="30" rows="10" value={text} onChange={(event) => setText(event.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'></textarea>
                </div>
                {/* image file */}
                <h2 className="text-xl text-purple-700 m-2">Ajouter une image</h2>
                <input type="file" id="file-upload" onChange={(event) => setImage(event.target.files[0])} className='shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'/>
                <button type='submit' className='mt-12 w-[300px]'><img src={`gobutton.svg`} alt="bouton go" /></button>
            </form>
        </div>
    )
}

export default AddPost