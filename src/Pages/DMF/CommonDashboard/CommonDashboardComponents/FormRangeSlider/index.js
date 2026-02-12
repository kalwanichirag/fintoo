import Slider from 'react-input-slider';

const FormRangeSlider = (props) => {

    const { min = 0, max = 100, step = 1, x = 1, onChange = null } = props

    return (
        <div style={{ position: 'relative', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ position: 'absolute', left: '0px', top: '24px' }}>{min ?? 0}</div>
            <Slider
                axis="x"
                x={x}
                onChange={({ x }) => onChange(x)}
                xmin={min}
                xmax={max}
                xstep={step}
                styles={{
                    track: {
                        backgroundColor: '#f1f1f1',
                        width: '100%',
                        height: "3px",
                    },
                    active: {
                        backgroundColor: "#042b62",
                        height: "3px",
                    },
                    thumb: {
                        borderColor: "#042b62",
                        backgroundColor: "#042b62",
                        width: "22px",
                        height: "22px",
                        top: "0%",
                        ":before": {
                            content: `"${x == min || x == max ? "" : x}"`,
                            position: "absolute",
                            bottom: "22px",
                        }
                    }
                }}
            />
            <div style={{ position: 'absolute', right: '0px', top: '24px' }}>{max}</div>
        </div>
    );
};
export default FormRangeSlider;
