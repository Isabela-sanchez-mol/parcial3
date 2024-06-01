import React, { useState } from 'react';
import { uploadFile, deleteFile } from '../firebase/firebase';

const ImageManager = () => {
    const [image, setImage] = useState(null);
    const [txt, setTxt] = useState("");
    const [mode, setMode] = useState("add"); // Puede ser "add", "update" o "delete"

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === "add" || mode === "update") {
            await uploadFile(image, txt);
        } else if (mode === "delete") {
            await deleteFile(txt);
        }
        alert(`Operación ${mode === "add" ? "Subir" : mode === "update" ? "Actualizar" : "Borrar"} completada para la imagen: ${txt}`);
        setTxt("");
        setImage(null);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input type="radio" value="add" checked={mode === "add"} onChange={() => setMode("add")} />
                        Subir Imagen
                    </label>
                    <label>
                        <input type="radio" value="update" checked={mode === "update"} onChange={() => setMode("update")} />
                        Actualizar Imagen
                    </label>
                    <label>
                        <input type="radio" value="delete" checked={mode === "delete"} onChange={() => setMode("delete")} />
                        Borrar Imagen
                    </label>
                </div>

                {(mode === "add" || mode === "update") && (
                    <input type="file" onChange={handleChange} />
                )}
                <input type="text" placeholder={mode === "delete" ? 'Nombre de la imagen para borrar' : 'Nombre para la imagen'} value={txt} onChange={(e) => setTxt(e.target.value)} />
                <button type="submit">
                    {mode === "add" ? "Subir Imagen" : mode === "update" ? "Actualizar Imagen" : "Borrar Imagen"}
                </button>
            </form>
        </div>
    );
};

export default ImageManager;
