import { connect } from "react-redux";
import "../css/input-group.css";
import { useState, useEffect } from "react";
import EventUserJoin from "../components/EventUserJoin";
import EventInfo from "../components/EventInfo";
import '../css/text.css';
import { useNavigate } from "react-router";

function Events({account}){
    const [eventsList, setEventsList] = useState(null);
    const navigate = useNavigate();

    function loadEventsList(){
        function cancelEvent(eventId){
            fetch(`http://localhost:5141/api/Event/Cancel?eventId=${eventId}`, {
                method: 'PATCH',
                credentials: 'include'
            })
            .then(
                r => {
                    loadEventsList();
                }
            )
        }

        fetch(`http://localhost:5141/api/Event/ReadAll`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(
                r => {
                    console.log('read all events');
                    console.log(r.status);
                    return r.json();
                }
            )
            .then(
                events => {
                    console.log("map events");
                    if(account.accountType === 'org'){
                        events = events.filter(function(e) {
                            if (e.isCancelled === true) {
                              return false; // skip
                            }
                            return true;
                          })
                    }
                    events = events.map(e => <li key={e.id} className="input-group">
                        <EventInfo data={e}/>
                        {account.accountType === 'org' & account.data.id === e.organizerId && <button onClick={() => cancelEvent(e.id)}></button>}
                        {account.accountType === 'user' && <EventUserJoin eventId={e.id} userId={account.data.id}/>}
                        {account.accountType === 'org' & account.data.id === e.organizerId && <p className="org">Your event</p>}
                    </li>)
                    setEventsList(events);
                }
            )
    }

    useEffect(
        loadEventsList,
        [account]
    );

    return(
        <div className="input-group">
            <h1>Events</h1>
            <button onClick={() => navigate('../')}>Back</button>
            <ul>{eventsList}</ul>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);