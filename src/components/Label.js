const Label = ({children}) => {
    return (
        <p className="label" style={{textAlign:"center", fontFamily:"Courier New, monospace", fontSize:"110%", maxWidth:"250px", transform:"translate(10%,50%)", backgroundColor:"#e5e8ea", border:"2px solid #d5d9d9", borderRadius:"10px", margin:"2px", padding:"2px"}}>{children}</p>
    );
}

export default Label;