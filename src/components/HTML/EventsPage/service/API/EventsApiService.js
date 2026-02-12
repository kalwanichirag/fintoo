import axios from "axios";

const eventsDataGetUrl = ' https://www.financialhospital.in/adminpanel/events/event_ws.php/GetPrevEvents/all/3'

export const getEventsData = async () => {
    try {

        const res = await axios.get(eventsDataGetUrl);

        return res.data
    } catch (error) {
        console.log(error)
    }

}