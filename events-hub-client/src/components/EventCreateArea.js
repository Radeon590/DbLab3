import { useState } from "react";
import EventCreate from "./EventCreate";

function EventCreateArea({ onEventCreate }){
    const [isCreateEvent, setIsCreateEvent] = useState(false)

    function handleEventCreate(){
        setIsCreateEvent(false);
        onEventCreate();
    }

    return(
        <div className='input-group'>
            {isCreateEvent ? <EventCreate onCreate={handleEventCreate} /> : <button onClick={() => setIsCreateEvent(true)}>Create new event</button>}
        </div>
    )
}

export default EventCreateArea;