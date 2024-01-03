import PropTypes from 'prop-types'

interface CardProps {
    label: string;
    title: string;
    picture: string; // Remplacez string par le type approprié pour votre application
}

function Card({ label, title, picture }: CardProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
            <span>{label}</span>
            <h3>{title}</h3>
            <img src={picture} alt={title} />
        </div>
    );
}

Card.defaultProps = {
    title: 'Mon titre par défaut',
}
 
export default Card