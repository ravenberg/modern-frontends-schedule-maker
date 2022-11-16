import talks from '../../data/talks.json';
import { useLoaderData, useNavigate } from '@remix-run/react';
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
    const navigate = useNavigate()

    return (
        <>
            <button style={{ fontSize: '14px' }} onClick={() => navigate(-1)}>← Back to overview</button>
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
