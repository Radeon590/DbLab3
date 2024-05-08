import { Routes, Route } from "react-router-dom"
import { connect } from 'react-redux';
import action_1 from '../store/actionCreators/action_1'
import action_2 from '../store/actionCreators/action_2'
import Home from "./home";
import SignIn from "./signin";

function App(props){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="signin" element={<SignIn/>}/>
        </Routes>
    );
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
    action_1,
    action_2
};

export default connect(mapStateToProps, mapDispatchToProps)(App);