import React, { useEffect, useState } from 'react'
import './Api.css'

export default function Api({ texto }) {
    const [resultados, setResultados] = useState([])
    const [serieExpandida, setSerieExpandida] = useState(null)
    const [favoritosUpdated, setFavoritosUpdated] = useState(0) // Para forzar el re-render

    //funciones para el localStorage (las series favoritas)
    function agregarAlLocalStorage(serie) {
        // Obtener el array actual del localStorage o crear uno nuevo
        const listaLocal = JSON.parse(localStorage.getItem('favoritas')) || []

        // Agregar el nuevo objeto al array
        listaLocal.push(serie)

        // Guardar el array actualizado en el localStorage
        localStorage.setItem('favoritas', JSON.stringify(listaLocal))
    }

    function eliminarAlLocalStorage(id) {
        // Obtener el array del localStorage
        const seriesGuardadas = JSON.parse(localStorage.getItem('favoritas')) || []

        // Filtrar el array para excluir la serie con el ID especificado
        const seriesActualizadas = seriesGuardadas.filter(serie => serie.id !== id)

        // Guardar el array actualizado en el localStorage
        localStorage.setItem('favoritas', JSON.stringify(seriesActualizadas))
    }

    function obtenerSerieDelLocalStorage(id) {
        // Obtener el array del localStorage
        const seriesGuardadas = JSON.parse(localStorage.getItem('favoritas')) || []

        // Buscar la serie con el ID especificado
        const serieEncontrada = seriesGuardadas.find(serie => serie.id === id)

        // Retornar el objeto si se encuentra, o null si no existe
        return serieEncontrada || null
    }

    function esFavorita(id) {
        // Obtener el array del localStorage
        const seriesGuardadas = JSON.parse(localStorage.getItem('favoritas')) || []

        // Verificar si existe alguna serie con el ID especificado
        return seriesGuardadas.some(serie => serie.id === id)
    }

    // fetch a la API
    useEffect(() => {
        if (texto) {
            fetch(`https://api.tvmaze.com/search/shows?q=${texto}`)
                .then(result => {
                    if (!result.ok) {
                        throw new Error('No se encontró la url (︶︹︶)')
                    }
                    return result.json()
                })
                .then(data => setResultados(data))
                .catch(error => console.error(error))
        } else {
            setResultados([])
        }
    }, [texto])

    function handleClick(item) {
        setSerieExpandida(serieExpandida && serieExpandida.id === item.show.id ? null : item.show)
    }

    function handleStar(item) {
        return (e) => {
            e.stopPropagation() // evitar que el click se propague
            if (esFavorita(item.id)) {
                eliminarAlLocalStorage(item.id)
            } else {
                agregarAlLocalStorage(item)
            }

            setFavoritosUpdated(prev => prev + 1) // forzar re-render
        }
    }

    function mostrarSerie() {
        return resultados.slice(0, 3).map((item, index) => (
            <div className="todo" key={item.show.id || index}>
                <div className="show" onClick={() => handleClick(item)}>
                    <img
                        className="image"
                        src={item.show.image?.medium || '/placeholder-image.png'}
                        alt={"(▰˘︹˘▰)✿...."}
                    />
                    <div className="info">
                        <h2 className="title">{item.show.name}</h2>
                        {item.show.premiered != null && (
                            <h4 className="year">{item.show.premiered.slice(0, 4)}</h4>
                        )}
                    </div>
                </div>
                {serieExpandida && serieExpandida.id === item.show.id && (
                    <div className="expanded-info">
                        <p>Géneros: {item.show.genres?.join(', ') || 'No disponible'}</p>
                        <p>Puntuación: {item.show.rating?.average || 'N/A'}</p>
                        {item.show.webChannel && (<p>Disponible en <strong>{item.show.webChannel.name}</strong></p>)}
                        <img
                            className="star"
                            src={esFavorita(item.show.id) ? '/star(1).png' : '/star.png'}
                            onClick={handleStar(item.show)}
                        />
                    </div>
                )}
            </div>
        ))
    }

    return <div className="shows">{resultados.length > 0 ? mostrarSerie() : null}</div>
}
