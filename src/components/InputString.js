import Label from "./Label";

const InputString = (props) => {
    return (
        <div className="input string" style={{margin: "0px 0px 0px 30px", float:"left"}}>
            <Label>Input String</Label>
            <textarea className="text box" rows="10" cols= "32" overflow="auto" name="input" disabled={props.disabled} style={{resize:"none", fontFamily:"Courier New, monospace", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
			</textarea>
        </div>
    );
}

export default InputString;