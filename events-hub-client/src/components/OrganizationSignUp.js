import "../css/input-group.css";
import { setAccount } from "../store/actionCreators/account";
import { connect } from "react-redux";
import { useRef, useState } from "react";

function OrganizationSignUp({ onSignUp, setAccount }) {
    const [isOrgExists, setIsOrgExists] = useState(false);

    const publicNamespaceInput = useRef(null);
    const passwordInput = useRef(null);
    const fullNamespaceInput = useRef(null);
    const descriptionInput = useRef(null);

    function handleSignUp() {
        const orgData = {
            publicNamespace: publicNamespaceInput.current.value,
            password: passwordInput.current.value,
            fullNamespace: fullNamespaceInput.current.value,
            description: descriptionInput.current.value,
        }
        fetch(`http://localhost:5141/api/Organizer/Create`, {
            method: "POST",
            credentials: "include",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(orgData)
        })
            .then(result => {
                if (result.status === 200) {
                    result.json().then(r => {
                        orgData.id = r;
                        console.log(orgData.id);
                        const newAccount = {
                            accountType: "org",
                            data: orgData
                        }
                        setAccount(newAccount);
                        if (isOrgExists === true) {
                            setIsOrgExists(false);
                        }
                        if (onSignUp != null && onSignUp !== undefined) {
                            onSignUp();
                        }
                    });
                }
                else if (result.status === 409) {
                    setIsOrgExists(true);
                }
                else {
                    throw new Error("Error while creating user. Status code: " + result.statusText);
                }
            });

    }

    return (
        <div className="input-group">
            <h1>Sign Up as org</h1>
            {isOrgExists && <p>Org is already exist. try another username or password</p>}
            <input type="text" placeholder="publicNamespace" ref={publicNamespaceInput} />
            <input type="password" placeholder="password" ref={passwordInput} />
            <input type="text" placeholder="fullNamespace" ref={fullNamespaceInput} />
            <input type="text" placeholder="description" ref={descriptionInput} />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = {
    setAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSignUp);