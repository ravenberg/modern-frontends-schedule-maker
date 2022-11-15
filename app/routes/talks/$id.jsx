import talks from '../../data/talks.json';
import { Link, useLoaderData } from '@remix-run/react';
import useFavorites from '~/hooks/useFavorites';
import { buttonStyles } from '../../../styles/styles'

export const loader = ({ params }) => {
    const talk = talks.find((talk) => talk.title === params.id);
    return {
        talk
    };
};

export default function () {
    const { talk } = useLoaderData();
    const { favorites, setFavorite, removeFavorite} = useFavorites()

    return (
        <>
            <Link to="/">← Back to overview</Link>
            <h1>{talk.title}</h1>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'gray'
            }}>
                <h5>{talk.speaker}</h5>
                <h5>{talk.time}</h5>
                <h5>{talk.room}</h5>
            </div>
            <p style={{marginTop: 0}}>{talk.description}</p>
            {typeof window !== 'undefined' &&
                <button
                    style={{
                        ...buttonStyles,
                        width: '100%',
                    }}
                    onClick={() => {
                        favorites.includes(talk.title) ? removeFavorite(talk.title) : setFavorite(talk.title)
                    }}
                >
                    {favorites.includes(talk.title) ? 'Remove from favorites ❤️' : 'Add to favorites 🤍' }
                </button>
            }
        </>
    );
}
