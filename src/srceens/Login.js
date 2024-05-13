import React, {useState} from 'react';
import firebaseApp from "../firebase/credenciales";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore,doc,setDoc } from 'firebase/firestore'; 

const auth = getAuth (firebaseApp);

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const firestore=getFirestore(firebaseApp);

async function registrarUsuario(email,password,rol){
  try {
    const usuarioFirebase = await createUserWithEmailAndPassword(auth, email, password);
    console.log(usuarioFirebase.user.uid);
    const docuRef = doc(firestore, `usuarios/${usuarioFirebase.user.uid}`);
    await setDoc(docuRef, { correo: email, rol: rol });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}

  function submitHandler(e){
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = e.target.elements.rol.value;
    

    console.log("submit",email,password,rol);


    if(isRegistrando){
      registrarUsuario(email,password,rol);
    } else {
      signInWithEmailAndPassword(auth,email,password);
    }

  }

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia Sesión"}</h1>

      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico: <input type="email" id='email'/>
        </label>
        <label>
          Contraseña: <input type="password" id='password'/>
        </label>
        <label>
          Rol: <select id='rol'>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          </select>
        </label>
        <input 
          type="submit"
          value={isRegistrando ? "Registrar" : "Iniciar sesión"}
        />
      </form>
      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo cuenta" : "Quiero registrarme"}
      </button>
    </div>
  );
}

export default Login;
