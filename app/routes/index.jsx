import talks from '../data/talks.json';
import { Link, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import useFavorites from '~/hooks/useFavorites';
import { buttonStyles } from '../../styles/styles';

export const loader = () => {

    const talksByTime = talks.reduce((acc, value) => {
        // Group initialization
        if (!acc[value.time]) {
            acc[value.time] = [];
        }

        // Grouping
        acc[value.time].push(value);

        return acc;
    }, {});

    return {
        talksByTime,
    };
};

export default function Index({}) {
    const loaderData = useLoaderData();
    const { favorites, setFavorite, removeFavorite} = useFavorites();
    const [ onlyFavoritesAreShown, setOnlyFavoritesAreShown ] = useState(false)

    return (
        <div>
            <h1>Modern Frontends Schedule Maker</h1>

            <button
                style={{
                    ...buttonStyles,
                    position: 'fixed',
                    bottom: '12px',
                    right: '12px'
                }}
                onClick={() => {
                    setOnlyFavoritesAreShown(!onlyFavoritesAreShown)
                }}
            >
                {onlyFavoritesAreShown ? 'Show all' : 'Show Favorites'}
            </button>
            <ul>
                {Object.keys(loaderData.talksByTime).map((key) => {
                    if (onlyFavoritesAreShown && !loaderData.talksByTime[key].some((item) => favorites.includes(item.title))) {
                        return null
                    }

                    return (
                        <li key={key}>
                            <h3>{key}</h3>
                            <div className="talk-table-wrapper">
                                <table>
                                    <thead>
                                    <tr>
                                        {typeof window !== 'undefined' && <th></th>}
                                        <th>Title</th>
                                        <th>Speaker</th>
                                        <th>Room</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loaderData.talksByTime[key].map((item, i) => {

                                        if (onlyFavoritesAreShown && !favorites.includes(item.title)) return null;

                                        return (
                                            <tr key={i}>
                                                {typeof window !== 'undefined' && <td>
                                                    <button onClick={() => {
                                                        favorites.includes(item.title) ? removeFavorite(item.title) : setFavorite(item.title)
                                                    }}>
                                                        {favorites.includes(item.title) ? '❤️' : '🤍' }
                                                    </button>
                                                </td>}
                                                <td className='title' title={item.description}>
                                                    <Link to={`/talks/${item.title}`}>{item.title}</Link>
                                                </td>
                                                <td className='speaker'>{item.speaker}</td>
                                                <td className='room'>{item.room}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
