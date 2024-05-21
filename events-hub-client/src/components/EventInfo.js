function EventInfo({ data, account }){
    

    return (
        <div>
            <h1>{data.namespace}</h1>
            <p>{data.description}</p>
            <p>{data.address}</p>
            <p>{data.date}</p>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);