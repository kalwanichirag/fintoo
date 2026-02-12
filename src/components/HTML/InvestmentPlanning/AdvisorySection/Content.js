import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'

function Content(props) {

    const [accordionContainerHeight, SetAccordionContainerHeight] = useState('0')

    const contentEl = useRef();
    
    useEffect(() => {
        // if(contentEl){
        //     SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        //     window.addEventListener("resize", () => {
        //         SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        //     });
    
        //     return (() => {
        //         SetAccordionContainerHeight(() => '0')
        //         window.removeEventListener("resize", SetAccordionContainerHeight);
        //     })
        // }

        // SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        // window.addEventListener("resize", () => {
        //     SetAccordionContainerHeight(() => contentEl.current.scrollHeight)
        // });

        // return (() => {
        //     SetAccordionContainerHeight(() => '0')
        //     window.removeEventListener("resize", SetAccordionContainerHeight);
        // })
    }, [])

    return (
        <>
{/* {
    props.activeIndex ?  <div ref={contentEl} className={`${style['accordian-content']}`} style={props.activeIndex
        ? { height: accordionContainerHeight,  }
        : { height: "0px" }}> {props.children} </div> : null
} */}
      {
    props.activeIndex ?  <div ref={contentEl} className={`${style['accordian-content']}`} > {props.children} </div> : null
}     
        </>
    )
}

export default Content
