
const StarRate = (props) => {
    return (
        <div className='d-flex align-items-center'>
            <div style={{ height: '1rem', lineHeight: '1rem' }}>{props.number}</div>
            <div style={{ height: '1rem', lineHeight: '.8rem', paddingRight: '5px' }}><img src={require('./star.png')} style={{ width: '.7rem', height: '.7rem' }} /></div>
        </div>
    );
}
export default StarRate;