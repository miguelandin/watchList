import React, { useEffect, useState } from 'react'
import './Api.css'

export default function Api({ texto }) {
    const [resultados, setResultados] = useState([])
    const [serieExpandida, setSerieExpandida] = useState(null)
    const [favoritas, setFavoritas] = useState([])

    useEffect(() => {
        const favoritasGuardadas = localStorage.getItem('seriesFavoritas')
        if (favoritasGuardadas) {
            try {
                setFavoritas(JSON.parse(favoritasGuardadas))
            } catch (error) {
                console.error('Error al cargar favoritas:', error)
                localStorage.removeItem('seriesFavoritas')
            }
        }
    }, [])

    // Guardar en localStorage cuando cambien las favoritas
    useEffect(() => {
        localStorage.setItem('seriesFavoritas', JSON.stringify(favoritas))
    }, [favoritas])

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
        setSerieExpandida(serieExpandida && serieExpandida.id === item.show.id ? null : item.show);
    }

    function handleStar(item) {
        return (e) => {
            e.stopPropagation(); // Importante: evitar que el click se propague
            if (esFavorita(item.id)) {
                eliminarSerieFavorita(item.id);
            } else {
                setFavoritas(prev => [...prev, item]);
            }
        };
    }

    function eliminarSerieFavorita(serieId) {
        setFavoritas(prev => prev.filter(fav => fav.id !== serieId));
    }

    function esFavorita(serieId) {
        return favoritas.some(fav => fav.id === serieId);
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
        ));
    }

    return <div className="shows">{resultados.length > 0 ? mostrarSerie() : null}</div>;
}
