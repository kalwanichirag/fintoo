import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'

function FaqAccordianContent(props) {

    const [accordionContainerHeight, SetAccordionContainerHeight] = useState('0')

    const contentEl = useRef();

    useEffect(() => {
        SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        window.addEventListener("resize", () => {
            SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        });

        return (() => {
            SetAccordionContainerHeight(() => '0')
            window.removeEventListener("resize", SetAccordionContainerHeight);
        })
    }, [])

    return (
        <>

            <div ref={contentEl} className={`${style['accordian-content']}`} style={props.activeIndex
                ? { height: accordionContainerHeight, margin: '1.5rem 0 0.5rem 0' }
                : { height: "0px" }}> {props.children} </div>

        </>
    )
}

export default FaqAccordianContent
