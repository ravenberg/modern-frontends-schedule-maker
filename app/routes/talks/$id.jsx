import talks from '../../data/talks.json';
import speakers from '../../data/speakers.json'
import { useLoaderData, useNavigate } from '@remix-run/react';
import useFavorites from '~/hooks/useFavorites';
import { buttonStyles } from '../../../styles/styles'

export const loader = ({ params }) => {
    const talk = talks.find((talk) => talk.title === params.id);
    const speaker = speakers.find((speaker) => speaker.speaker === talk.speaker);
    talk.speakerTagline = speaker.tagline
    talk.speakerPhoto = speaker.photo
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
            <button style={{ fontSize: '14px', display: 'block' }} onClick={() => navigate(-1)}>← Back to overview</button>
            <h1 dangerouslySetInnerHTML={{__html: talk.title}} />
            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                <img
                    style={{
                        borderRadius: '50%',
                        width: '30%',
                        height: '30%',
                        paddingRight: '8px'
                    }}
                    src={talk.speakerPhoto}
                    alt={talk.speaker}
                />
                <div>
                    <h4 style={{ margin: '0 0 4px 0'}}>{talk.speaker}</h4>
                    <h5 style={{ margin: '0', opacity: '0.7'}}>{talk.speakerTagline}</h5>
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                opacity: '0.7'
            }}>
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
