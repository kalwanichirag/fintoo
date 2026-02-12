const FormRadioComponent = (props) => {

    const horizontalStyle = { display: 'flex', gap: '1rem', marginTop: '1rem' }
    const verticalStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }



    return (
        <div style={props.isHorizontal ? horizontalStyle : verticalStyle}>
            {
                props.radioData.map((item, index) => <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'rgb(117, 117, 117)' }}><input type="radio" value={item.id} name={item.name} checked={item.id === props.checkedOpton} style={{ height: '20px', width: '20px', cursor: 'pointer' }} onChange={(e) => props.onChange(e)} /> {item.text}</div>)
            }
        </div>
    );
}

export default FormRadioComponent