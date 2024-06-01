import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminPanel from '../screens/AdminPanel';
import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../firebase/credenciales';
import { uploadFile } from '../firebase/credenciales'; // Asegúrate de tener esta función para subir archivos
import "../estilos/styles.css";
import tenisImage from "../img/tenis.png";

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function AdminView() {
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
  const [editarTorneoId, setEditarTorneoId] = useState(null);
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formularioEdicion, setFormularioEdicion] = useState({
    nombre: '',
    fechaLimite: '',
    imagenURL: '',
    maxParticipantes: 0,
    participantesRegistrados: 0
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosCollection = collection(firestore, 'torneos');
        const torneosSnapshot = await getDocs(torneosCollection);
        const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(torneosData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchTorneos();
  }, []);

  const handleEditarTorneo = (id, torneo) => {
    setEditarTorneoId(id);
    setFormularioEdicion(torneo);
  };

  const handleGuardarEdicion = async () => {
    try {
      const torneoDoc = doc(firestore, 'torneos', editarTorneoId);
  
      // Si hay una nueva imagen, sube la imagen y actualiza la URL
      if (nuevaImagen) {
        const imageUrl = await uploadFile(nuevaImagen, formularioEdicion.nombre);
        // Actualizar el estado del formulario de edición con la nueva URL de la imagen
        setFormularioEdicion(prevState => ({ ...prevState, imagenURL: imageUrl }));
  
        // También actualizar en Firestore
        await updateDoc(torneoDoc, { ...formularioEdicion, imagenURL: imageUrl });
      } else {
        await updateDoc(torneoDoc, formularioEdicion);
      }
  
      // Refrescar la lista de torneos después de actualizar
      const torneosSnapshot = await getDocs(collection(firestore, 'torneos'));
      const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTorneos(torneosData);
  
      // Limpiar el estado de edición
      setEditarTorneoId(null);
      setNuevaImagen(null); // Resetear la nueva imagen después de guardar
    } catch (error) {
      console.error('Error al editar el torneo:', error);
    }
  };
  

  const handleEliminarTorneo = async (id) => {
    try {
      const torneoDoc = doc(firestore, 'torneos', id);
      await deleteDoc(torneoDoc);
      const torneosFiltrados = torneos.filter(torneo => torneo.id !== id);
      setTorneos(torneosFiltrados);
    } catch (error) {
      console.error('Error al eliminar el torneo:', error);
    }
  };

  const handleFormularioEdicionChange = (e) => {
    const { name, value } = e.target;
    setFormularioEdicion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNuevaImagen(e.target.files[0]);
    }
  };

  const handleVolver = () => {
    setEditarTorneoId(null);
    setNuevaImagen(null);
  };

  return (
    <div className="container">
      <div className="navbar">
        <div className="title-and-image">
          <img className="simbol" src={tenisImage} alt="Tenis" />
        </div>
        <button>Home</button>
        <button onClick={() => setMostrarFormularioCrear(true)}>Crear Torneo</button>
        <button>Contactos</button>
        <button>Perfil</button>
        <button className="bye" onClick={() => signOut(auth)}>Cerrar sesión</button>
      </div>

      <div className="main-content">
        {mostrarFormularioCrear ? (
          <AdminPanel onVolver={() => setMostrarFormularioCrear(false)} />
        ) : (
          <div>
            <h3>Torneos Creados</h3>
            <div className="catalogo-torneos">
              {loading ? (
                <div>Cargando...</div>
              ) : (
                torneos.map(torneo => (
                  <div className="torneo-item" key={torneo.id}>
                    {editarTorneoId === torneo.id ? (
                      <div>
                        <input
                          type="text"
                          name="nombre"
                          value={formularioEdicion.nombre}
                          onChange={handleFormularioEdicionChange}
                        />
                        <input
                          type="date"
                          name="fechaLimite"
                          value={formularioEdicion.fechaLimite}
                          onChange={handleFormularioEdicionChange}
                        />
                        <input
                          type="number"
                          name="maxParticipantes"
                          value={formularioEdicion.maxParticipantes}
                          onChange={handleFormularioEdicionChange}
                        />
                        <input
                          type="number"
                          name="participantesRegistrados"
                          value={formularioEdicion.participantesRegistrados}
                          onChange={handleFormularioEdicionChange}
                        />
                        {formularioEdicion.imagenURL && (
                          <img src={formularioEdicion.imagenURL} alt="Imagen del torneo" />
                        )}
                        <input type="file" onChange={handleImageChange} />
                        <button className="boton" onClick={handleGuardarEdicion}>Guardar</button>
                        <button className="boton" onClick={handleVolver}>Volver</button>
                      </div>
                    ) : (
                      <div>
                        <div><strong>Nombre:</strong> {torneo.nombre}</div>
                        <div><strong>Fecha límite de inscripción:</strong> {torneo.fechaLimite}</div>
                        {torneo.imagenURL && <img src={torneo.imagenURL} alt="Imagen del torneo" />}
                        <div><strong>Cantidad máxima de participantes:</strong> {torneo.maxParticipantes}</div>
                        <div><strong>Participantes registrados:</strong> {torneo.participantesRegistrados}</div>
                        <button className="boton" onClick={() => handleEditarTorneo(torneo.id, torneo)}>Editar</button>
                        <button className="boton" onClick={() => handleEliminarTorneo(torneo.id)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminView;
