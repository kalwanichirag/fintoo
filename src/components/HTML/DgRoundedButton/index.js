import Style from './style.module.css';

const DgRoundedButton = (props) => {
    const classes = props.className;
    
    return (<button type="button" onClick={()=> props.onClick()} className={`${props.active ? Style.active : ''} ${Style.button}`}>{props.title}</button>);
}
export default DgRoundedButton;