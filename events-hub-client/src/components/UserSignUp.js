import "../css/input-group.css";
import { setAccount } from "../store/actionCreators/account";
import { connect } from "react-redux";
import { useRef, useState } from "react";

function UserSignUp({ onSignUp, setAccount }) {
    const [isUserExist, setIsUserExist] = useState(false);

    const usernameInput = useRef(null);
    const useremailInput = useRef(null);
    const passwordInput = useRef(null);
    const firstnameInput = useRef(null);
    const secondnameInput = useRef(null);
    const patronymicInput = useRef(null);
    const ageInput = useRef(null);

    function handleSignUp() {
        const userData = {
            username: usernameInput.current.value,
            userEmail: useremailInput.current.value,
            password: passwordInput.current.value,
            firstName: firstnameInput.current.value,
            secondName: secondnameInput.current.value,
            patronymic: patronymicInput.current.value,
            age: ageInput.current.value
        }
        fetch(`http://localhost:5141/api/Users/CreateFromJson`, {
            method: "POST",
            credentials: "include",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
            .then(result => {
                if (result.status === 200) {
                    result.json().then(r => {
                        userData.id = r;
                        console.log(userData.id);
                        const newAccount = {
                            accountType: "user",
                            data: userData
                        }
                        //auth
                        fetch(`http://localhost:5141/api/Users/Authorize?username=${userData.username}&password=${userData.password}`,{
                            method: 'GET',
                            credentials: 'include'
                        })
                        .then(
                            r => {
                                if (r.status === 200){
                                    setAccount(newAccount);
                                    if (isUserExist === true) {
                                        setIsUserExist(false);
                                    }
                                    if (onSignUp != null && onSignUp !== undefined) {
                                        onSignUp();
                                    }
                                }
                            }
                        );
                    });
                }
                else if (result.status === 409) {
                    setIsUserExist(true);
                }
                else {
                    throw new Error("Error while creating user. Status code: " + result.statusText);
                }
            });

    }

    return (
        <div className="input-group">
            <h1>Sign Up as user</h1>
            {isUserExist && <p>user is already exist. try another username or password</p>}
            <input type="text" placeholder="username" ref={usernameInput} />
            <input type="email" placeholder="useremail" ref={useremailInput} />
            <input type="password" placeholder="password" ref={passwordInput} />
            <input type="text" placeholder="firstname" ref={firstnameInput} />
            <input type="text" placeholder="secondname" ref={secondnameInput} />
            <input type="text" placeholder="patronymic" ref={patronymicInput} />
            <input type="number" placeholder="age" ref={ageInput} />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserSignUp);