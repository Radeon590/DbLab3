import "../css/input-group.css";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import "../css/input-group.css";
import { setAccount } from "../store/actionCreators/account";

function UserSignIn({ onSignIn, setAccount }) {
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);
  const navigate = useNavigate();

  async function signInAsUser() {
    let result = await fetch(`http://localhost:5141/api/Users/Authorize?username=${usernameInput.current.value}&password=${passwordInput.current.value}`, {
      method: "GET",
      credentials: "include"
    });
    console.log(result.status);
    console.log(result.statusText);
    if (result.status === 200) {
      let readUserResult = await fetch(`http://localhost:5141/api/Users/ReadByUsername?username=${usernameInput.current.value}`, {
        method: "GET",
        credentials: "include"
      });
      readUserResult.json().then(value => {
        setAccount({ accountType: "user", data: value });
      });
      onSignIn();
      navigate("../");
    }
  }

  return (
    <div className="input-group">
      <h1>Sign In as user</h1>
      <input type="text" placeholder="username" ref={usernameInput} />
      <input type="password" placeholder="password" ref={passwordInput} />
      <button onClick={signInAsUser}>Sign in</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserSignIn);