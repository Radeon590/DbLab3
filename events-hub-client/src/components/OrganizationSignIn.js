import "../css/input-group.css";
import { useRef } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { setAccount } from "../store/actionCreators/account";

function OrganizationSignIn({ setAccount, onSignIn }) {
  const publicNamespaceInput = useRef(null);
  const passwordInput = useRef(null);

  const navigate = useNavigate();

  function handleSignIn() {
    fetch(`http://localhost:5141/api/Organizer/Authorize?publicNamespace=${publicNamespaceInput.current.value}&password=${passwordInput.current.value}`, {
      method: "GET",
      credentials: "include"
    }).then(
        result => {
          console.log(result.status);
          console.log(result.statusText);
          if (result.status === 200) {
            fetch(`http://localhost:5141/api/Organizer/ReadByNamespace?publicNamespace=${publicNamespaceInput.current.value}`, 
            {
              method: "GET",
              credentials: "include"
            }).then(
              r => {
                return r.json();
              }
            ).then(
              r => {
                console.log(r);
                  setAccount({ accountType: "org", data: r });
                  if (onSignIn != null && onSignIn !== undefined) {
                    onSignIn();
                  }
                  navigate("../");
              }
            );
          }
        }
      );
  }

  return (
    <div className="input-group">
      <h1>Sign In as org</h1>
      <input type="text" placeholder="publicNamespace" ref={publicNamespaceInput} />
      <input type="password" placeholder="password" ref={passwordInput} />
      <button onClick={handleSignIn}>Sign in</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSignIn);