import { createContext, useContext, useEffect, useState } from "react";
import { getEventsData } from "./API/EventsApiService";

const dummyEventsData = [
    {
        id: "540",
        event_name: "reddit",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2021-10-04",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "530",
        event_name: "Box Cricket League",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2021-10-18",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "531",
        event_name: "Cricket",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2021-12-10",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "532",
        event_name: "League",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2022-01-26",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "533",
        event_name: "xkskxsa",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2023-09-11",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "534",
        event_name: "oooo",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2023-10-06",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "535",
        event_name: "nmnmb",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2023-10-13",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "536",
        event_name: "noob",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2023-12-26",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "537",
        event_name: "fintoo",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2024-01-09",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "538",
        event_name: "fedx",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2024-02-15",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    },
    {
        id: "539",
        event_name: "flipkart",
        event_summary: "",
        event_url: "https://www.fintoo.in/event-details/event_un20221204-530",
        location: "Gurgaon",
        timing: "8:00 AM",
        event_date: "2024-02-15",
        event_whyattend_heading: "Why Attend",
        event_whyattend_description: "<p><strong>We are excited to announce that Fintoo is organizing a box cricket match. Your participation would make the event even more memorable.&nbsp;</strong></p><p><strong>So be prepared to put on a good game on 3rd December. We look forward to seeing you all there.</strong></p>",
        event_rsvp_description: "<p>Anil Verma</p><p>+91 8655100185</p><p>Anil.verma@fintoo.in</p>",
        background_image: "box cricket league  1440 -650-01.jpg",
    }
]

const EventsContext = createContext({
    eventsData: null,
})

export function EventsContextProvider(props) {

    const [eventsData, SetEventsData] = useState(null)

    useEffect(() => {
        getEvents()
    }, [])

    const getEvents = async () => {
        const result = await getEventsData()
        SetEventsData(() => result)
        // SetEventsData(() => dummyEventsData)
    }

    return (
        <EventsContext.Provider value={{ eventsData }}>{props.children}</EventsContext.Provider>
    )
}

export function useEventsContext() {
    return useContext(EventsContext)
}