import moment from 'moment';
import PropTypes from 'prop-types';

export default function RenderPost({id, content, created, onClick}) {
    return (
      <div className="post" onClick={() => { onClick(id) }}>
        <div style={{fontSize: 'x-large'}}>{content}</div>
        <div style={{marginTop: '5px', fontSize: 'small'}}>{moment(created).format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
      </div>
    )
}

RenderPost.propTypes = {
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    created: PropTypes.number,
    onClick: PropTypes.func,
}

RenderPost.defaultProps = {
    created: 0,
    onClick: () => console.log('Тут должна быть какая-нибудь функция дальнейшей обработки...')
}