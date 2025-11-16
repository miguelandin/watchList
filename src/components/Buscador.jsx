import React, { useState } from 'react'
import Api from './Api.jsx'
import './Buscador.css'

export default function Buscador() {
    const [texto, setTexto] = useState('')

    const manejarCambio = (event) => {
        setTexto(event.target.value)
    }

    return (
        <>
            <div id="buscador">
                <input
                    type="text"
                    id="caja"
                    value={texto}
                    onChange={manejarCambio}
                    placeholder="Buscar..."
                />
            </div>
            {/* separa la barra de búsqueda */}
            <Api texto={texto} />
        </>
    )
}
