import "../css/input-group.css";
import { useRef } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { setAccount } from "../store/actionCreators/account";

function OrganizationSignIn({ setAccount, onSignIn }){
    const publicNamespaceInput = useRef(null);
    const passwordInput = useRef(null);

    const navigate = useNavigate();

    async function handleSignIn() {
        let result = await fetch(`http://localhost:5141/api/Organizer/Authorize?publicNamespace=${publicNamespaceInput.current.value}&password=${publicNamespaceInput.current.value}`, {
          method: "GET",
          credentials: "include"
        });
        console.log(result.status);
        console.log(result.statusText);
        if (result.status === 200) {
          let readUserResult = await fetch(`http://localhost:5141/api/Users/ReadByNamespace?publicNamespace=${publicNamespaceInput.current.value}`, {
            method: "GET",
            credentials: "include"
          });
          readUserResult.json().then(value => {
            setAccount({ accountType: "org", data: value });
          });
          onSignIn();
          navigate("../");
        }
      }

    return(
        <div className="input-group">
          <h1>Sign In as org</h1>
          <input type="text" placeholder="publicNamespace" ref={publicNamespaceInput}/>
          <input type="password" placeholder="password" ref={passwordInput}/>
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