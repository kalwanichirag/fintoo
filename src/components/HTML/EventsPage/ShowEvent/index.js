import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useEventsContext } from "../service/EventsContext"
import styles from '../AllEvents/style.module.css'
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import { BiArrowBack } from "react-icons/bi"
import { SlCalender, SlLocationPin } from "react-icons/sl";

function ShowEvent() {

    const [currentEvent, SurrentEvent] = useState(null)
    const { eventsData } = useEventsContext()
    let { eventId } = useParams();

    useEffect(() => {
        if (eventsData == null) return;
        const filterCurrentEvent = eventsData.filter(event => event.id === eventId)[0];
        if (filterCurrentEvent === undefined) return;
        SurrentEvent(() => eventsData.filter(event => event.id === eventId)[0]);
    }, [eventsData])


    useEffect(() => {
        //console.log(currentEvent)
    }, [currentEvent])

    return (
        <div className={`${styles['show-event-section-container']}`}>
            {
                currentEvent && <>
                    <section className={`${styles['show-event-section']} ${commonStyles['padding-class']}`}>
                        <Link to='../'>
                            <div className={`${styles['back-btn']}`}>
                                <BiArrowBack />
                            </div>
                        </Link>
                        <div className={`${styles['show-event-section-image-container']}`} style={{ backgroundImage: `${currentEvent.background_image === "" ? `url(https://www.fintoo.in/static/events/img/event-slider.jpg)` : `url(https://www.financialhospital.in/event/img/${currentEvent.background_image.replaceAll(' ', '%20')}`}` }}>
                        </div>
                        <div className={`${styles['show-event-section-title']}`}>{currentEvent.event_name}</div>
                        <div className={`${styles['event-meta-info-container']}`}>
                            <div className={`${styles['event-meta-info']}`}>
                                <SlCalender /><span>{currentEvent.event_date} | {currentEvent.timing}</span>
                            </div>
                            <div className={`${styles['event-meta-info']}`}>
                                <SlLocationPin /><span>{currentEvent.location}</span>
                            </div>
                        </div>
                        <br />
                        <div dangerouslySetInnerHTML={{ __html: currentEvent.event_overview_description }} />
                        <div className={`${styles['show-event-section-why-attend-text']}`}>{currentEvent.event_whyattend_heading}</div>
                        <div dangerouslySetInnerHTML={{ __html: currentEvent.event_whyattend_description }} />
                        <br /><br />
                    </section>
                </>
            }
        </div>
    )
}

export default ShowEvent
