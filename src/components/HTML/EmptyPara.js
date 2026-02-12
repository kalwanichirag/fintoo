
const EmptyPara = () => {
    const style = {
        emptypara: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        },
        p: {
            textAlign: 'center'
        }
    };
    return (<div style={style.emptypara}><p style={style.p}>-</p></div>)
}
export default EmptyPara;