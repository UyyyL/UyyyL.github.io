import Label from "./Label";

const CodeEditor = (props) => {
    return (
        <div className="code editor" style={{float: "left"}}>
            <Label>Machine Definition</Label>
            <textarea className="text box" rows="25" cols= "100" overflow="auto" name="code" disabled={props.disabled} style={{resize:"none", fontFamily:"Courier New, monospace", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
			</textarea>
        </div>
    );
}

export default CodeEditor;