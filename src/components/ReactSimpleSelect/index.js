import * as React from 'react';

import { options } from 'toastr';
import style from './style.module.css';
import { useRef, useState } from 'react';
import Item from './Item';

const ReactSimpleSelect = ({options, value, onChange, ...props}) => {
    // const [value1, setValue] = useState(false)
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
        <>
            <div ref={selectRef} className={style.selectBox}>
                <div className={style.SelectTitleBox} onClick={()=> setOpen((v)=> !v)}>
                    <p className={style.selectTitle}>{value ? (options.filter((v)=> v.value == value))[0]['title'] : 'Select Document Type'}</p>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
                {open && <div className={style.optionsPanel}>
                    {options.map((v)=> (
                        <div key={'rss-' + v.value} onClick={()=> {
                            setOpen(false);
                            // setValue(v.dt_id);
                            onChange(v.value);
                        }}>
                            <Item title={v.title} selected={value == v.value} />
                        </div>
                    ))}
                </div>}
            </div>
        </>
    );
}
export default ReactSimpleSelect;