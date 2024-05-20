import '../css/input-group.css';
import { connect } from 'react-redux';
import { useState } from 'react';

function MyEvents({account}){


    return(
        <div className='input-group'>

        </div>
    );
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
    cleanAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);