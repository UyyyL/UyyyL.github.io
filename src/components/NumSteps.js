import Label from "./Label";

const NumSteps = (props) => {
    return (
        <div className="num steps" style={{float:"left"}}>
            <Label>Steps</Label>
            <div style={{overflowX:"auto", width:"300px", fontFamily:"Courier New, monospace", textAlign:"center", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
                {props.steps}
            </div>    
        </div>
    );
}

export default NumSteps;