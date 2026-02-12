import style from './style.module.css';

const Item = ({title, selected}) => {
    return (
        <div className={`${style.option} `}>
            <div className='d-flex justify-content-between'>
                <div>{title}</div>
                {selected ? <i className="fa fa-check-circle" style={{
                    fontSize: 18,
                    color: 'green'
                }}></i> : <></>}
            </div>
        </div>
    );
}
export default Item;