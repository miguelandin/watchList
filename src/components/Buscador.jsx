import React, { useState } from 'react';
import Api from './Api.jsx'
import './Buscador.css';

export default function Buscador() {
    const [texto, setTexto] = useState(''); // Recuerda la variable

    const manejarCambio = (event) => {
        setTexto(event.target.value); // Actualiza el texto
    };

    return (
        <div id="buscador">
            <input
                type="text"
                id="caja"
                value={texto}
                onChange={manejarCambio} // Cada vez que hay un cambio
                placeholder="Buscar..." // Texto indicativo
            />
            <Api texto={texto} />
        </div>
    );
}
