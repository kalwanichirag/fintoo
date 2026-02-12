import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'

function AccordionWPContent(props) {

    const [accordionContainerHeight, SetAccordionContainerHeight] = useState('0')

    const contentEl = useRef();

    const updateHeight = () => {
        if (contentEl.current) {
            SetAccordionContainerHeight(contentEl.current.scrollHeight);
        }
    };

    useEffect(() => {
        updateHeight();

        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    return (
        <>

            <div ref={contentEl} className={`${style['accordian-content']}`} style={props.activeIndex
                ? { height: accordionContainerHeight, margin: '0 0 1rem 0' }
                : { height: "0px" }}> {props.children} </div>

        </>
    )
}

export default AccordionWPContent
