import talks from '../../data/talks.json';
import speakers from '../../data/speakers.json';
import { useLoaderData, useNavigate } from '@remix-run/react';
import useFavorites from '~/hooks/useFavorites';
import { buttonStyles } from '../../../styles/styles';

export const loader = ({ params }) => {
    const talk = talks.find((talk) => talk.title === params.id);

    let speaker;
    if (talk.title === 'Building Complex Web Applications on Low Code Platforms: Myths and Reality') {
        speaker = [];
        speaker.push(speakers.find((speaker) => speaker.speaker === 'Amanda Martin'));
        speaker.push(speakers.find((speaker) => speaker.speaker === 'Emmy Cao'));
    } else if(talk.title === 'Google AI for JS developers with TensorFlow.js Keynote') {
        speaker = [];
        speaker.push(speakers.find((speaker) => speaker.speaker === 'Jason Mayes'));
        speaker.push(speakers.find((speaker) => speaker.speaker === 'Laurence Moroney'));
    } else {
        speaker = speakers.find((speaker) => speaker.speaker === talk.speaker);
    }

    talk.speakerDetails = speaker;

    return {
        talk
    };
};

export default function () {
    const { talk } = useLoaderData();
    const { favorites, setFavorite, removeFavorite } = useFavorites();
    const navigate = useNavigate();

    const Speaker = ({talk, speakerDetails}) => {
        console.log(speakerDetails);
        return <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: '4px'
        }}>
            <img
                style={{
                    borderRadius: '50%',
                    width: '110px',
                    height: '110px',
                    paddingRight: '8px'
                }}
                src={speakerDetails?.photo}
                alt={speakerDetails?.speaker || talk.speaker}
            />
            <div>
                <h4 style={{ margin: '0 0 4px 0' }}>{speakerDetails?.speaker || talk.speaker}</h4>
                <h5 style={{ margin: '0', opacity: '0.7' }}>{speakerDetails?.tagline}</h5>
            </div>
        </div>;
    };

    return (
        <>
            <button style={{ fontSize: '14px', display: 'block' }} onClick={() => navigate(-1)}>← Back to overview
            </button>
            <h1 dangerouslySetInnerHTML={{ __html: talk.title }}/>
            {Array.isArray(talk.speakerDetails) ? (
                talk.speakerDetails.map((speakerDetails) => <Speaker key={speakerDetails.speaker} talk={talk} speakerDetails={speakerDetails} /> )
            ) : (
                <Speaker talk={talk} speakerDetails={talk.speakerDetails} />
            )}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                opacity: '0.7'
            }}>
                <h5>{talk.time}</h5>
                <h5>{talk.room}</h5>
            </div>
            <p style={{ marginTop: 0 }}>{talk.description}</p>
            {typeof window !== 'undefined' &&
                <button
                    style={{
                        ...buttonStyles,
                        width: '100%',
                    }}
                    onClick={() => {
                        favorites.includes(talk.title) ? removeFavorite(talk.title) : setFavorite(talk.title);
                    }}
                >
                    {favorites.includes(talk.title) ? 'Remove from favorites ❤️' : 'Add to favorites 🤍'}
                </button>
            }
        </>
    );
}
