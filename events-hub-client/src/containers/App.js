import { Routes, Route } from "react-router-dom"
import { connect } from 'react-redux';
import SignIn from "./signin";
import Home from './home';
import Profile from "./Profile";
import MyEvents from "./MyEvents";

function App(props){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="signin" element={<SignIn/>}/>
            <Route path="profile" element={ <Profile/> }/>
            <Route path="myEvents" element={ <MyEvents/> }/>
        </Routes>
    );
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(App);