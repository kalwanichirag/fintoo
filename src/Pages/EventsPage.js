import { Route, Routes } from "react-router-dom"
import AllEvents from "../components/HTML/EventsPage/AllEvents"
import { EventsContextProvider } from "../components/HTML/EventsPage/service/EventsContext"
import ShowEvent from "../components/HTML/EventsPage/ShowEvent"
import Fullpage from "../components/Layout/Fullpage"

function EventsPage() {

    return (
        <Fullpage>
            <div style={{ backgroundColor: '#f0f4f3' }}>
                <EventsContextProvider>
                    <Routes>
                        <Route path={`/`} element={<AllEvents />} />
                        <Route path={`/:eventId`} element={<ShowEvent />} />
                    </Routes>
                </EventsContextProvider>
            </div>
        </Fullpage>
    )
}

export default EventsPage

