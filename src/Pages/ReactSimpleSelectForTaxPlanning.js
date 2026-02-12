import * as React from 'react';
import style from './style.module.css';
import { useRef, useState } from 'react';
import Item from '../components/ReactSimpleSelect/Item';

const ReactSimpleSelectForTaxPlanning = ({ options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef();

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={selectRef} className={style.selectBox} style={{ position: 'relative' }}>
            <div className={style.SelectTitleBox} onClick={() => setOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <p className={style.selectTitle} style={{ margin: 0 }}>{value ? (options.find((opt) => opt.value === value)?.title || 'Select Document Type') : 'Select Document Type'}</p>
            {/* <p className={style.selectTitle} style={{ margin: 0 }}>
            {options?.[0]?.title || 'Select Document Type'}
            </p> */}

                {/* Custom caret icon */}
                <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid black', marginLeft: '10px', marginRight: '10px'}}></div>
            </div>
            {open && <div className={style.optionsPanel} style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1, backgroundColor: '#ffffff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {options.map((opt, index) => (
                    <div key={'rss-' + opt.value} onClick={() => {
                        setOpen(false);
                        onChange(opt.value);
                    }} style={{ padding: '8px 16px', cursor: 'pointer', transition: 'background-color 0.3s ease', backgroundColor: '#fff' }} onMouseOver={e => e.target.style.backgroundColor = '#f0f0f0'} onMouseOut={e => e.target.style.backgroundColor = '#fff'}>
                        {opt.title}
                    </div>
                ))}
            </div>}
        </div>
    );
}



export default ReactSimpleSelectForTaxPlanning;