
const CustomBar = (props) => {
    return (
        <div className="bar-box-container">
            <div className="bar_box">
                <div className="bar" style={{width: props.percent+'%', background: '#9ac349'}}></div>
            </div>
            
        </div>
    );    
}
export default CustomBar;
