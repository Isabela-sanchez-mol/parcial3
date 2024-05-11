import React, { useState } from "react";
import Home from "./srceens/Home";
import Login from "./srceens/Login";
import firebaseApp from "./firebase/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 

const auth = getAuth(firebaseApp);

function App() {
  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if (usuarioFirebase){
      setUser(usuarioFirebase);
    } else {
      setUser(null);
    }
  });

  return <> {user ? <Home/> : <Login />} </>
}

export default App;
