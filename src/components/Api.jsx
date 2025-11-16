
import React, { useEffect, useState } from 'react'
import './Api.css'

export default function Api({ texto }) { // hace el fetch y muestra las series
    const [resultados, setResultados] = useState([])

    useEffect(() => {
        if (texto) {
            fetch(`https://api.tvmaze.com/search/shows?q=${texto}`)
                .then(result => {
                    if (!result.ok) {
                        throw new Error('No se encontró la url (︶︹︶)')
                    }
                    return result.json()
                })
                .then(data => cargarDatos(data))
                .catch(error => console.error(error))
        }
    }, [texto])

    function cargarDatos(data) {
        console.log(data)
        setResultados(data) // Almacena los resultados de la búsqueda
    }

    function mostrarSerie() {
        return resultados.slice(0, 3).map((item, index) => (
            <div key={index} className="show">
                <img className="image" src={item.show.image?.medium} alt="(▰˘︹˘▰)✿...." />
                <div className="info">
                    <h2 className="title">{item.show.name}</h2>
                    {item.show.premiered != null && ( // se asegura de que no sea null para evitar errores
                        <h4 className="year">{item.show.premiered.slice(0, 4)}</h4>
                    )}
                </div>
            </div>
        ))
    }

    return <div className="shows">{resultados.length > 0 ? mostrarSerie() : <></>}</div>
}

