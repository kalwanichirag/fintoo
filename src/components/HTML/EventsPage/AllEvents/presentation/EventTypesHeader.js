import styles from '../style.module.css'
import commonStyles from "../../../../Layout/Fullpage/style.module.css";

function EventsTypesHeader({ eventPeriod, SetFilterOptions }) {
    return (
        <div >
            <section className={`${styles['event-types-header-section']} ${commonStyles['padding-class']}`}>
                <div className={`${styles['event-section-heading']}`}>
                    Events
                </div>
                <div className={`${styles['event-types-Selection-container']}`}>
                    <div className={`${styles['event-type']} ${eventPeriod === 'past' ? styles['active-event'] : ''}`} onClick={() => SetFilterOptions(prev => { return { ...prev, period: 'past' } })}>Previous Event</div>
                    <div className={`${styles['event-type']} ${eventPeriod === 'ongoing' ? styles['active-event'] : ''}`} onClick={() => SetFilterOptions(prev => { return { ...prev, period: 'ongoing' } })}>Ongoing Event</div>
                    <div className={`${styles['event-type']} ${eventPeriod === 'upcoming' ? styles['active-event'] : ''}`} onClick={() => SetFilterOptions(prev => { return { ...prev, period: 'upcoming' } })}>Upcoming Event</div>
                </div>
            </section>
        </div>
    )
}

export default EventsTypesHeader
