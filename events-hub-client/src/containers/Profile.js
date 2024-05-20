import { connect } from "react-redux";
import { useNavigate, Navigate } from "react-router";
import UserProfile from '../components/UserProfile';
import OrganizationProfile from "../components/OrganizationProfile";
import { cleanAccount } from "../store/actionCreators/account";

function Profile({ account, cleanAccount }){
    const navigate = useNavigate();

    function signOut(){
        cleanAccount();
        navigate('../signin');
    }

    if (account != null){
        return (
            <div>
                { account.accountType === "user" ? <UserProfile data={account.data}/> : <OrganizationProfile data={account.data}/> } 
                <button onClick={() => navigate('../myEvents')}>My events</button>
                <button onClick={signOut}>SignOut</button>
            </div>
        );
    }
    else {
        return (
            <Navigate to={"../signin"} replace={true}/>
        );
    }
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
    cleanAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);