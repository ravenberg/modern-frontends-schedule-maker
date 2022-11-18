import talks from '../data/talks.json';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import useFavorites from '~/hooks/useFavorites';
import { buttonStyles } from '../../styles/styles';
import useTimeFormatting from '~/hooks/useTimeFormatting';
import { ClientOnly, useHydrated } from 'remix-utils';

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
    let isHydrated = useHydrated();
    const loaderData = useLoaderData();
    const { favorites, setFavorite, removeFavorite} = useFavorites();
    const [ onlyFavoritesAreShown, setOnlyFavoritesAreShown ] = useState(false)
    const [ onlyUpcomingTalksAreShown, setOnlyUpcomingTalksAreShown ] = useState(true)

    let isTalkDone = () => false;
    if (isHydrated) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        isTalkDone = useTimeFormatting(loaderData.talksByTime).isTalkDone
    }

    const App = () => {
        return (
            <>
                <h1>Modern Frontends Schedule Maker</h1>

                <button
                    style={{
                        ...buttonStyles,
                        position: 'fixed',
                        bottom: '12px',
                        left: '12px',
                        zIndex: '100'
                    }}
                    onClick={() => {
                        setOnlyUpcomingTalksAreShown(!onlyUpcomingTalksAreShown)
                    }}
                >
                    {onlyUpcomingTalksAreShown ? 'Show past talks' : 'Hide past talks'}
                </button>

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
                    {onlyFavoritesAreShown ? 'Hide favorites' : 'Show Favorites'}
                </button>
                <ul>
                    {Object.keys(loaderData.talksByTime).map((key) => {
                        if(onlyUpcomingTalksAreShown && isTalkDone(loaderData.talksByTime[key][0])) return null

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
                                            <th></th>
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
                                                    <td>
                                                        <button onClick={() => {
                                                            favorites.includes(item.title) ? removeFavorite(item.title) : setFavorite(item.title)
                                                        }}>
                                                            {favorites.includes(item.title) ? '❤️' : '🤍' }
                                                        </button>
                                                    </td>
                                                    <td className='title' title={item.description}>
                                                        <Link to={`/talks/${item.title}`}><span dangerouslySetInnerHTML={{__html: item.title}} /></Link>
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
            </>
        )
    }

    return (
        <ClientOnly fallback={() => <h1>Modern Frontends Schedule Maker</h1>}>
            {() => <App />}
        </ClientOnly>
    );
}
