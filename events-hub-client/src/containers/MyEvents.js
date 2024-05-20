import '../css/input-group.css';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import EventInfo from '../components/EventInfo';
import EventCreateArea from '../components/EventCreateArea';
import { useNavigate } from 'react-router';

function MyEvents({account}){
    const [eventsList, setEventsList] = useState(null);
    const navigate = useNavigate();

    function loadEventsList(){
        if (account.accountType === 'org'){
            fetch(`http://localhost:5141/api/Organizer/ReadEvents?organizerId=${account.data.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(
                r => r.json()
            )
            .then(
                events => {
                    events = events.map(e => <li><EventInfo data={e}/></li>)
                    setEventsList(events);
                }
            )
        }
        else{
            fetch(`http://localhost:5141/api/Users/ReadEvents?id=${account.data.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(
                r => r.json()
            )
            .then(
                events => {
                    events = events.map(e => <li><EventInfo data={e}/></li>)
                    setEventsList(events);
                }
            )
        }
    }

    useEffect(loadEventsList, [account]);

    return(
        <div className='input-group'>
            <h1>My events</h1>
            <button onClick={() => navigate('../')}>Back</button>
            { account.accountType === 'org' && <EventCreateArea onEventCreate={loadEventsList}/>}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyEvents);