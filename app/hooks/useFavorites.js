import { useEffect, useState } from 'react';

export default function() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    },[])

    const setFavorite = (title) => {
        const updatedFavorites = [...favorites, title]
        setFavorites(updatedFavorites)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }
    const removeFavorite = (title) => {
        const updatedFavorites = favorites.filter(favorite => favorite !== title)
        setFavorites(updatedFavorites)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }

    return {
        favorites,
        setFavorite,
        removeFavorite
    }
}
