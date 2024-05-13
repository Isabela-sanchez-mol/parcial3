import React from 'react';
import firebaseApp from '../firebase/credenciales';
import { getAuth,signOut } from 'firebase/auth';
import AdminView from "../componentes/AdminView"
import UserView from "../componentes/UserView"

const auth = getAuth(firebaseApp);

function Home({user}) {
  return (
    <div>Home
      <button onClick={()=> signOut(auth)}>Cerrar Sesión</button>

      {user.rol=== "admin"?<AdminView/>:<UserView/>}

    </div>
  );
}

export default Home;
