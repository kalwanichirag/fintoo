import styles from '../style.module.css'
import commonStyles from "../../../../Layout/Fullpage/style.module.css";
import { MdShare } from 'react-icons/md'
import { SlCalender, SlLocationPin } from 'react-icons/sl'
import { Link } from 'react-router-dom'

function EventListComponent({ eventList }) {

    return (
        <div >
            {
                eventList ? <div className={`${styles['event-list-container']} ${commonStyles['padding-class']}`}>
                    {
                        eventList.map((event, key) => <div key={key} className={`${styles['event-card']}`}>
                            <Link to={event.id}>
                                <div className={`${styles['event-card-image-container']}`} style={{ backgroundImage: `${event.background_image === "" ? `url(https://www.fintoo.in/static/events/img/event-slider.jpg)` : `url(https://www.financialhospital.in/event/img/${event.background_image.replaceAll(' ', '%20')}`}` }}>
                                </div>
                            </Link>
                            <div className={`${styles['event-card-content-container']}`}>
                                <div className={`${styles['event-name-share']}`}>
                                    <Link to={event.id}>
                                        <span>{event.event_name}</span>
                                    </Link>
                                    <span className={`${styles['event-share-icon']}`}><MdShare /></span>
                                </div>
                                <div className={`${styles['event-meta-info-container']}`}>
                                    <div className={`${styles['event-meta-info']}`}>
                                        <SlCalender /><span>{event.event_date} | {event.timing}</span>
                                    </div>
                                    <div className={`${styles['event-meta-info']}`}>
                                        <SlLocationPin /><span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }
                </div> : <h1>no data</h1>
            }
        </div>
    )
}

export default EventListComponent
