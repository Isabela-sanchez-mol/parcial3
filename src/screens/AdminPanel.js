import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '../firebase/credenciales';
import { uploadFile } from '../firebase/credenciales';

const firestore = getFirestore(firebaseApp);

function AdminPanel({ onVolver }) {
  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: '',
    fechaLimite: '',
    maxParticipantes: 0,
    participantesRegistrados: 0
  });

  const [image, setImage] = useState(null);

  const handleCrearTorneo = async (event) => {
    event.preventDefault();
    try {
      //let imageUrl = '';
      if (image) {
        // Subir la imagen 
        await uploadFile(image, nuevoTorneo.nombre);
      }
      
      const docRef = await addDoc(collection(firestore, 'torneos'), {
        ...nuevoTorneo,
        //imagenURL: imageUrl
      });
      console.log("Torneo creado con ID: ", docRef.id);

      // Limpiar el formulario después de la creación exitosa
      setNuevoTorneo({
        nombre: '',
        fechaLimite: '',
        maxParticipantes: 0,
        participantesRegistrados: 0
      });
      setImage(null);
    } catch (error) {
      console.error("Error al crear el torneo: ", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className='crear-torneo'>
      <form onSubmit={handleCrearTorneo}>
        <h3>Crear Torneo</h3>
        <label>
          Nombre:
          <input placeholder="Nombre del torneo" type="text" value={nuevoTorneo.nombre} onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })} />
        </label>
        <label>
          Fecha límite de inscripción:
          <input type="date" value={nuevoTorneo.fechaLimite} onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, fechaLimite: e.target.value })} />
        </label>
        <label>
          Subir imagen:
          <input type="file" onChange={handleImageChange} />
        </label>
        <label>
          Cantidad máxima de participantes:
          <input type="number" value={nuevoTorneo.maxParticipantes} onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, maxParticipantes: parseInt(e.target.value) })} />
        </label>
        <label>
          Participantes registrados:
          <input type="number" value={nuevoTorneo.participantesRegistrados} onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, participantesRegistrados: parseInt(e.target.value) })} />
        </label>
        <button className="boton" type="submit">Crear Torneo</button>
        <button className="boton" onClick={onVolver}>Volver</button>
      </form>
    </div>
  );
}

export default AdminPanel;
