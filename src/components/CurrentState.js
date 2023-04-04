import Label from "./Label";

const CurrentState = (props) => {
    return (
        <div className="current state" style={{float:"left"}}>
            <Label>Current State</Label>
            <div style={{overflowX:"auto", width:"300px", fontFamily:"Courier New, monospace", textAlign:"center", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
                {props.currentState}
            </div>    
        </div>
    );
}

export default CurrentState;