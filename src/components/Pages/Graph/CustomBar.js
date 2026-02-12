
const CustomBar = (props) => {
    return (
        <div>
            <div className="bar-box-container">
                <div className="bar_box">

                    {props.data.filter((v)=> v.value > 0).map((v)=> <div className="bar" style={{width: v.value + '%', background: v.color}}></div>)}

                </div>
                <div className="bar-bottom-sheet">
                    {props.data.filter((v)=> v.value > 0).map((v)=> (
                        <div className="bar-bottom-sheet-item">
                            <div>{(1 * v.value).toFixed(2)}%</div>
                            <div className="bar-scheme-container"><span className="bar-color-box" style={{background: v.color}}></span><span className="bar-color-scheme">{v.title}</span></div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );    
}
export default CustomBar;
