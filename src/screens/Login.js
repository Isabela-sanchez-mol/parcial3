import React, { useState } from "react";
import firebaseApp from "../firebase/credenciales";
import "../estilos/styles.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Advertencias from "../componentes/Advertencias";

const auth = getAuth(firebaseApp);

function Login() {
  const firestore = getFirestore(firebaseApp);
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [advertencias, setAdvertencias] = useState({ rolIncorrecto: false, errorCredenciales: false, errorContraseña: false, camposIncompletos: false });
  const [feedback, setFeedback] = useState(""); // Nuevo estado para el feedback

  async function registrarUsuario(email, password, rol) {
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
    setDoc(docuRef, { correo: email, rol: rol, contraseña:password });
  }

  async function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = e.target.elements.rol ? e.target.elements.rol.value : null;

    if (!email || !password) {
      setFeedback("Por favor, complete todos los campos.");
      return;
    }

    if (rol && !["admin", "user"].includes(rol)) {
      setFeedback("Por favor, seleccione un rol válido.");
      return;
    }

    if (isRegistrando) {
      // Registro
      try {
        await registrarUsuario(email, password, rol);
        setFeedback("Usuario registrado exitosamente.");
      } catch (error) {
        console.error(error);
        setFeedback("Ocurrió un error al registrar el usuario.");
      }
    } else {
      // login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setFeedback("Inicio de sesión exitoso.");
      } catch (error) {
        console.error(error);
        if (error.code === "auth/wrong-password") {
          setFeedback("La contraseña es incorrecta.");
        } else if (error.code === "auth/user-not-found") {
          setFeedback("El usuario no existe.");
        } else {
          setFeedback("Rectifica los datos, correo o contraseña.");
        }
      }
    }
  }

  return (
    <div className="login-wrapper">
      <div className="card">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="card-inner">
          <h1>{isRegistrando ? <div className='texto-arriba'>
            <span className="destacado">TenisWebApp</span>
            <br />  ENTRA - REGISTRATE - COMPITE <br />TORNEOS DE TENIS </div> : <div className='texto-arriba'>
            <span className="destacado">TenisWebApp</span>

            <br /> INICIAR SESIÓN </div>}</h1>

          {feedback && <p>{feedback}</p>} { }

          <Advertencias {...advertencias} />

          <form onSubmit={submitHandler}>
            <label className="email">
              <input placeholder="Email" type="email" id="email" />
            </label>

            <label className="password">
              <input placeholder="Contraseña" type="password" id="password" />
            </label>

            {isRegistrando && (
              <label className="rol">
                <h2 className="texto">Rol:</h2>
                <select id="rol">
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </label>
            )}

            <input className="boton-enviar"
              type="submit"
              value={isRegistrando ? "Registrar" : "Iniciar sesión"}
            />
            <button className="boton" onClick={() => setIsRegistrando(!isRegistrando)}>
              {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
            </button>
          </form>
        </div>
      </div>
      <div className="banner-container">
        <div className="banner">
          <p>ENTRA - REGISTRATE - COMPITE</p>
          <p> - ENTRA - REGISTRATE - COMPITE</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
