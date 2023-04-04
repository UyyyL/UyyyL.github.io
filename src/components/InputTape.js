import Label from "./Label";

const InputTape = (props) => {
    return (
        <div className="input tape">
            <Label>Input Tape {props.inputTapeName}</Label>
            <div style={{overflowX:"auto", width:"900px", textAlign:"center", fontFamily:"Courier New, monospace", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
                <span>{props.firstHalf}</span>
                <span style={{backgroundColor:"#98b1eb"}}>{props.currSymbol}</span>
                <span>{props.secondHalf}</span>
            </div>    
        </div>
    );
}

export default InputTape;