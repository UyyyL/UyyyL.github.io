import Label from "./Label";

const Memory = (props) => {
    const IDs = props.memoryIDs.map((memory) => {
        return <div><b>{memory}</b>:</div>
    });

    const elements = props.memoryElements.map((memory) => {
        if (memory === "")
            return <br></br>
        return <div>{memory}</div>
    });

    return (
        <div className="memory" style={{float:"left"}}>
            <Label>Memory</Label>
            <div style={{overflow:"auto", width:"900px", fontFamily:"Courier New, monospace", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
                <div style={{float:"left", textAlign:"right", textIndent: "10px"}}>{IDs}</div>
                <div style={{float:"left", textAlign:"left", textIndent: "10px"}}>{elements}</div>
            </div>    
        </div>
    );
}

export default Memory;