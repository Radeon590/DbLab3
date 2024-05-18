export default function OrganizationProfile({ data }){
    return (
        <div>
            <h1>{data.publicNamespace}</h1>
            <p>{data.fullNamespace}</p>
            <p>{data.description}</p>
        </div>
    );
}