import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import Screen1 from './Screen1'
import Screen2 from './Screen2'

const App = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<Screen1 />} />
    //   <Route path="/toto" element={<Screen2 />} />
    // </Routes>
    <Outlet />
  )
}

export default App


















// import React from 'react'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import FirstComponent from './FirstComponent'
// import SecondComponent from './SecondComponent'

// const App = () => {

//   //cycle de vie d'un composant
//   useEffect(() => {
//     //ce qu'il se passe quand le composant est monté = constructor
//     setToto('toto');
//     return () => {
//       //ce qu'il se passe quand le composant est démonté
//     }
//   }, [/*on y met des states qui vont mettre a jour le composant (le remonter)*/])


//   // Créer un state "toto" et une fonction qui va le modifier
//   // les fonctions avec les use au début sont des hooks (mécanique de React)
//   const [toto, setToto] = useState('');
//   const [isToto, setIsToto] = useState(true);

//   //créer une fonction qui va modifier le state
//   const changeToto = () => {

//     setToto('titi');

//   }
//   // un toggle pour changer la valeur isToto
//   const toggleToto = () => {
//     setIsToto(!isToto);
//     if (!isToto) {
//       setToto('titi');
//     }
//     else {
//       setToto('toto');
//     }
//   }



//   return (
//     // cette balise est neutre, elle n'apparaitra pas dans le DOM
//     // on pourrait aussi faire une ternaire dans le h1 qui vérifie si isToto est true ou false
//     <>
//       <h1>App de {toto}</h1>
//       <div onClick={() => { toggleToto() }}>Click</div>
//       <FirstComponent data={{name: toto}} />
//       <SecondComponent />
//     </>
//   )
// }

// export default App