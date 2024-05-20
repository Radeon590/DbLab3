import "../css/input-group.css";
import { useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";

function EventCreate({ onCreate, account }) {
    const [isCreated, setIsCreated] = useState(false);

    const navigate = useNavigate();

    const namespaceInput = useRef(null);
    const descriptionInput = useRef(null);
    const addressInput = useRef(null);
    const dateInput = useRef(null);

    function handleCreate() {
        const eventData = {
            namespace: namespaceInput.current.value,
            description: descriptionInput.current.value,
            address: addressInput.current.value,
            date: dateInput.current.value,
            price: 0,
            organizerId: account.data.id
        }
        fetch(`http://localhost:5141/api/Event/Create`, {
            method: "POST",
            credentials: "include",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
        })
            .then(result => {
                console.log(result.status);
                if (result.status === 200) {
                    result.json().then(r => {
                        console.log("event created");
                        console.log(r);
                        if (onCreate != null && onCreate !== undefined) {
                            onCreate();
                        }
                        setIsCreated(true);
                    });
                }
            });

    }

    return (
        <div className="input-group">
            <h1>Create event</h1>
            <input type="text" placeholder="namespace" ref={namespaceInput} />
            <input type="email" placeholder="description" ref={descriptionInput} />
            <input type="text" placeholder="address" ref={addressInput} />
            <input type="date" placeholder="date" ref={dateInput} />
            <button onClick={handleCreate}>Create</button>
            {isCreated && <h2>test</h2>}
            {isCreated && <button onClick={() => navigate("")}>Back to profile</button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventCreate);