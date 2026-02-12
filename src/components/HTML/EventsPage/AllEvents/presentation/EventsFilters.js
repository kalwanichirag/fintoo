import styles from '../style.module.css'
import commonStyles from "../../../../Layout/Fullpage/style.module.css";
import { BiSearchAlt2, BiSort } from 'react-icons/bi'
import { useRef, useState } from 'react';

function EventsFilters({ SetFilterOptions }) {
    const [showTooltip, SetShowTooltip] = useState(false);

    return (
        <div >
            <section className={`${styles['filters-section']} ${commonStyles['padding-class']}`}>
                <div className={`${styles['event-search-container']}`}>
                    <div className={`${styles['event-search-box']}`}>
                        <div className={`${styles['event-search-icon']}`}><BiSearchAlt2 /></div>
                        <input type="text" placeholder='Search for a Event' className={`${styles['event-search-input']}`} onChange={(e) => SetFilterOptions(prev => { return { ...prev, searchString: e.target.value } })} />
                    </div>
                </div>
                <div className={`${styles['events-filter-container']}`}>
                    <div className={`${styles['events-filter-text']}`}
                        onMouseEnter={() => SetShowTooltip(true)}
                    >
                        Sort By <span style={{ color: '#002385' }}><BiSort /></span>
                    </div>
                    {
                        showTooltip && <div className={`${styles['events-filter-sort-tooltip']}`} onMouseLeave={() => SetShowTooltip(false)}>
                            <div className={`${styles['events-filter-sort-tooltip-option']}`} onClick={() => SetFilterOptions(prev => { return { ...prev, sort: 'date' } })}>
                                By Date
                            </div>
                            <div className={`${styles['events-filter-sort-tooltip-option']}`} onClick={() => SetFilterOptions(prev => { return { ...prev, sort: 'name' } })}>
                                By Name
                            </div>
                        </div>
                    }

                </div>
            </section>
        </div>
    )
}

export default EventsFilters
