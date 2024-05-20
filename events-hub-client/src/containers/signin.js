import { useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import "../css/input-group.css";
import { setAccount } from "../store/actionCreators/account";
import UserSignIn from '../components/UserSignIn';
import UserSignUp from "../components/UserSignUp";
import OrganizationSignUp from "../components/OrganizationSignUp";
import OrganizationSignIn from "../components/OrganizationSignIn";

function SignIn({ account, setAccount }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isUser, setIsUser] = useState(true);

  if (account != null) {
    console.log("signin.account is not null. go to profile");
    return (
      <Navigate to="../profile" replace={true} />
    )
  }

  let MainArea = null;

  if (isUser) {
    if (isSignIn) {
      MainArea = UserSignIn;
    }
    else {
      MainArea = UserSignUp;
    }
  }
  else{
    if(isSignIn) {
      MainArea = OrganizationSignIn;
    }
    else {
      MainArea = OrganizationSignUp;
    }
  }

  return (
    <div className="input-group">
      <MainArea />
      <button onClick={() => setIsSignIn(!isSignIn)}>{isSignIn ? "SignUp" : "SignIn"}</button>
      <button onClick={() => setIsUser(!isUser)}>{isUser ? "sign as org" : "sign as user"}</button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    account: state.account
  }
};

const mapDispatchToProps = {
  setAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);