export default function EventInfo({ data }){
    return (
        <div>
            <h1>{data.namespace}</h1>
            <p>{data.description}</p>
            <p>{data.address}</p>
            <p>{data.date}</p>
        </div>
    );
}