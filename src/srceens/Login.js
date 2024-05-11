import React, {useState} from 'react';

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);

  function submitHandler(e){
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = e.target.elements.rol.value;
    

    console.log("submit",email,password,rol);
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
