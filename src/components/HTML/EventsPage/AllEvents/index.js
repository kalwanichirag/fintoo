import { useCallback, useEffect, useState } from "react"
import { useEffectAfterInitialRender } from "../../../../Utils/Hooks/LifeCycleHooks"
import { useEventsContext } from "../service/EventsContext"
import EventListComponent from "./presentation/EventListComponent"
import EventsFilters from "./presentation/EventsFilters"
import EventsTypesHeader from "./presentation/EventTypesHeader"

function AllEvents() {

    const { eventsData } = useEventsContext()
    const [eventDataState, SetEventDataState] = useState(null)
    const [eventPeriod, SetEventPeriod] = useState(null)
    // const [searchString, SetSearchString] = useState('')
    const [filterOptions, SetFilterOptions] = useState({
        period: null,
        sort: null,
        searchString: '',
    })

    const defaultEventsData = () => {
        if (eventsData === null) return;
        const upcomingEvents = eventsData.filter(event => {
            return Date.parse(event.event_date) > new Date()
        })
        const pastEvents = eventsData.filter(event => {
            return Date.parse(event.event_date) < new Date()
        })

        const ongoingEvents = eventsData.filter(event => {
            return !(Date.parse(event.event_date) > new Date()) && !(Date.parse(event.event_date) < new Date())
        })

        if (upcomingEvents.length > 0) {
            SetEventPeriod(() => 'upcoming')
            return SetEventDataState(() => upcomingEvents)
        }
        if (pastEvents.length > 0) {
            SetEventPeriod(() => 'past')
            return SetEventDataState(() => pastEvents)
        }
        if (ongoingEvents.length > 0) {
            SetEventPeriod(() => 'ongoing')
            return SetEventDataState(() => ongoingEvents)
        }

    }


    const filterEventsData = useCallback(() => {

        let eventsDataCopy = [...eventsData]

        switch (filterOptions.period) {
            case 'upcoming':
                eventsDataCopy = eventsDataCopy.filter(event => {
                    return Date.parse(event.event_date) > new Date()
                })
                SetEventPeriod('upcoming')
                break;
            case 'past':
                eventsDataCopy = eventsDataCopy.filter(event => {
                    return Date.parse(event.event_date) < new Date()
                })
                SetEventPeriod('past')
                break;
            case 'ongoing':
                eventsDataCopy = eventsDataCopy.filter(event => {
                    return !(Date.parse(event.event_date) > new Date()) && !(Date.parse(event.event_date) < new Date())
                })
                SetEventPeriod('ongoing')
                break;
            default:
                break;
        }

        switch (filterOptions.sort) {
            case 'date':
                eventsDataCopy = eventsDataCopy.sort((a, b) => {
                    return Date.parse(a.event_date) > Date.parse(b.event_date)
                })
                break;
            case 'name':
                eventsDataCopy = eventsDataCopy.sort((a, b) => {
                    var nameA = a.event_name.toLowerCase(), nameB = b.event_name.toLowerCase();
                    if (nameA < nameB)
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0;
                })
                break;
            default:
                break;
        }
        if (filterOptions.searchString !== '') {
            eventsDataCopy = eventsDataCopy.filter((event) => {
                return event.event_name
                    .toLowerCase()
                    .includes(filterOptions.searchString.toLowerCase());
            });
        }

        return SetEventDataState(() => [...eventsDataCopy])

    }, [filterOptions])


    useEffectAfterInitialRender(() => {
        filterEventsData()
    }, [filterOptions])

    useEffect(() => {
        defaultEventsData()
    }, [eventsData])

    return (
        <div >
            <EventsTypesHeader eventPeriod={eventPeriod} SetFilterOptions={SetFilterOptions} />
            <EventsFilters SetFilterOptions={SetFilterOptions} />
            <EventListComponent eventList={eventDataState} />
        </div>
    )
}

export default AllEvents
