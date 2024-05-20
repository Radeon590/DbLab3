import { useState, useEffect } from "react";
import '../css/text.css';

function EventUserJoin({eventId, userId}){
    const [isParticipant, setIsParticipant] = useState(false);

    function addUser(){
        fetch(`http://localhost:5141/api/Event/AddUser?eventId=${eventId}&userId=${userId}`, {
            method: 'PATCH',
            credentials: 'include'
        })
        .then(r => {
            console.log(`addUser statusCode: ${r.status}`);
            if (r.status === 200){
                setIsParticipant(true);
            }
        })
    }

    function checkIsUserParticipant(){
        fetch(`http://localhost:5141/api/Event/IsUserParticipant?eventId=${eventId}&userId=${userId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(r => r.text())
        .then(r => {
            if (r === 'true'){
                setIsParticipant(true);
            }
            else{
                setIsParticipant(false);
            }
        })
    }

    useEffect(
        checkIsUserParticipant,
        [eventId, userId]
    );

    return(
        <div>
            {isParticipant ? <p className="participant">Joined</p> : <button onClick={addUser}>Join</button>}
        </div>
    );
}

export default EventUserJoin;