import Label from "./Label";

const OutputTape = (props) => {
    return (
        <div className="output tape" style={{float:"left"}}>
            <Label>Output Tape</Label>
            <div style={{overflowX:"auto", width:"300px", fontFamily:"Courier New, monospace", textAlign:"center", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
                {props.output}
            </div>    
        </div>
    );
}

export default OutputTape;