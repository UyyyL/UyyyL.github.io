import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { useState, useEffect } from 'react'

import Label from '@/components/Label'
import CodeEditor from '@/components/CodeEditor'
import InputString from '@/components/InputString'
import InputTape from '@/components/InputTape'
import {Machine} from '@/lib/machine'
import OutputTape from '@/components/OutputTape'
import CurrentState from '@/components/CurrentState'
import NumSteps from '@/components/NumSteps'
import Memory from '@/components/Memory'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [isDisabledInit, setDisabledInit] = useState(false);
  const [isDisabledStepRun, setDisabledStepRun] = useState(true);
  const [isDisabledText, setDisabledText] = useState(false);
  const [machine, setMachine] = useState({});
  const [firstHalf, setFirstHalf] = useState("#");
  const [secondHalf, setSecondHalf] = useState("#");
  const [currSymbol, setCurrSymbol] = useState("");
  const [outputTape, setOutputTape] = useState("-");
  const [currentState, setCurrentState] = useState("-");
  const [numSteps, setNumSteps] = useState("-");
  const [memoryIDs, setMemoryIDs] = useState([]);
  const [memoryElements, setMemoryElements] = useState([]);

  useEffect(()=> {
    console.log(machine);
    console.log(machine.currState);
  }, [machine,currSymbol]);

  function handleClick (e) {
    e.preventDefault();
    //get code and initial input string
    const code = new Object(document.querySelector('textarea[name="code"]').value);
    const input = new Object(document.querySelector('textarea[name="input"]').value);

    //get value of button pressed
    const button = e.target.value;

    console.log("clicked " + button + " at " + Date.now()); //log
    if (button == "init") {
      const abstractmachine = new Machine(code, input);
      setMachine(abstractmachine);
      setFirstHalf(abstractmachine.inputTape.firstHalfToString());
      setSecondHalf(abstractmachine.inputTape.secondHalfToString());
      setCurrSymbol(abstractmachine.inputTape.currSymbol());
      setCurrentState(abstractmachine.currState.stateID ? abstractmachine.currState.stateID : "");
      setMemoryIDs(abstractmachine.getMemoryID());
      setMemoryElements(abstractmachine.getMemoryElements());
      setNumSteps(0);

      //enable step and run
      setDisabledInit(!isDisabledInit);
      setDisabledStepRun(false);

      //disable text editing
      setDisabledText(!isDisabledText);
    } else if (button == "step") {
      machine.step();
      setFirstHalf(machine.inputTape.firstHalfToString())
      setSecondHalf(machine.inputTape.secondHalfToString())
      setCurrSymbol(machine.inputTape.currSymbol())
      setOutputTape(machine.output !== "" ? machine.output : "-")
      setNumSteps(numSteps + 1);
      setCurrentState(machine.currState.stateID ? machine.currState.stateID : machine.currState);
      setMemoryIDs(machine.getMemoryID());
      setMemoryElements(machine.getMemoryElements());

      if (machine.currState === "accept" || machine.currState === "reject" || machine.currState === "not_found") {
        setDisabledStepRun(true);
        if (machine.currState === "not_found")
          setCurrentState("reject");
      }
        
    }
    else if (button == "reset") {
      setFirstHalf("#");
      setSecondHalf("#");
      setCurrSymbol("");
      setOutputTape("-");
      setCurrentState("-");
      setNumSteps("-");
      setMemoryIDs([]);
      setMemoryElements([]);
      setMachine({});

      //disable step and run
      setDisabledInit(!isDisabledInit);
      setDisabledStepRun(true);

      //enable text editing
      setDisabledText(!isDisabledText);
    }
  }

  return (
    <>
      <Head>
        <title>CSC615M MP</title>
        <meta name="description" content="Abstract Machine Interpreter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            <code className={styles.code}>Abstract Machine Interpreter</code>
          </p>
        </div>

        <InputTape inputTapeName={machine.inputTape?.memoryID ? machine.inputTape.memoryID : ""} firstHalf={firstHalf} currSymbol={currSymbol} secondHalf={secondHalf}/>

        <div>
          <CurrentState currentState={currentState}/>
          <OutputTape output={outputTape}/>
          <NumSteps steps={numSteps}/>
        </div>

        <Memory memoryIDs={memoryIDs} memoryElements={memoryElements}/>

        <div style={{marginLeft:"10%"}}>
          <CodeEditor disabled={isDisabledText}/>
          <InputString disabled={isDisabledText}/>
          <button value="init" onClick={handleClick} disabled={isDisabledInit} style={{"textAlign":"center", "fontFamily":"Courier New, monospace", "fontSize":"110%", "width":"20%", "maxWidth":"300px","float":"left", "backgroundColor":"#98b1eb","border":"2px solid #5b73ab","borderRadius":"10px","margin":"20px 0 0 3%","padding":"2px"}}> Initialize</button>
          <button value="step" onClick={handleClick} disabled={isDisabledStepRun} style={{"textAlign":"center", "fontFamily":"Courier New, monospace", "fontSize":"110%", "width":"20%", "maxWidth":"300px","float":"left", "backgroundColor":"#98b1eb","border":"2px solid #5b73ab","borderRadius":"10px","margin":"20px 0 0 3%","padding":"2px"}}>Step</button>
          <button value="reset" onClick={handleClick} disabled={!isDisabledInit} style={{"textAlign":"center", "fontFamily":"Courier New, monospace", "fontSize":"110%", "width":"20%", "maxWidth":"300px","float":"left", "backgroundColor":"#98b1eb","border":"2px solid #5b73ab","borderRadius":"10px","margin":"20px 0 0 3%","padding":"2px"}}>Reset</button>
        </div>

        <div>
          <Label>Syntax</Label>
          <div style={{fontFamily:"Courier New, monospace", backgroundColor:"#ffffff", border:"2px solid #dbddde", paddingTop:"20px", paddingLeft:"10px", paddingBottom:"20px", paddingRight:"10px"}}>
            <ul style={{"fontSize":"105%"}}><b>Data Section</b></ul>
            In the DATA section, any auxiliary memory is declared. The section begins with a line containing <b>.DATA</b> 
            <br></br>
            The following are the types of memory that should be supported:
            <li><b>STACK &lt;stack_name&gt;</b> - declares a stack with the given identifier. For example STACK S1 declares a stack named S1. The stack accesses memory in a Last-In-First-Out (LIFO) order.</li>
            <li><b>QUEUE &lt;queue_name&gt;</b> - declares a queue with the given identifier. For example QUEUE Q1 declares a queue named Q1. The queue accesses memory in a First-In-First-Out (FIFO) order.</li>
            <li><b>TAPE &lt;tape_name&gt;</b> - declares tape memory with the given identifier. For example TAPE T1 declares a tape named T1. The tape can be accessed freely by scanning it left and right, ala Turing Machine. For machines with at least one tape, the first tape declared is also designated as the input tape. </li> 
            {/* <li><b>2D_TAPE &lt;2D_tape_name&gt;</b> - declares tape memory with the given identifier. For example 2d_TAPE P1 declares a 2D tape named P1. The tape can be accessed freely by scanning it left and right, ala Turing Machine, or up and down. For machines with at least one tape or 2D tape, the first tape-type memory declared is also designated as the input tape. If the first tape-type memory is a 2D Tape, the input is on the first/topmost row.</li> */}
            <br></br>


            <ul style={{"fontSize":"105%"}}><b>Logic Section</b></ul>
            In the LOGIC section, each line defines a state’s behavior using the following syntax: 
            <br></br>
            &lt;SOURCE_STATE_NAME&gt;] COMMAND (&lt;SYMBOL_1&gt;,&lt;DESTINATION_STATE_NAME_1&gt;), (&lt;SYMBOL_2&gt;,&lt;DESTINATION_STATE_NAME_2&gt;), ..., (&lt;SYMBOL_N&gt;,&lt;DESTINATION_STATE_NAME_N&gt;) 
            <br></br>
            The commands LEFT and RIGHT follow this syntax:
            <br></br>
            &lt;SOURCE_STATE_NAME&gt;] COMMAND(&lt;tape_name&gt;) (&lt;SYMBOL_1&gt;/&lt;REPLACEMENT_SYMBOL_1&gt;,&lt;DESTINATION_STATE_NAME_1&gt;), (&lt;SYMBOL_2&gt;/&lt;REPLACEMENT_SYMBOL_2&gt;,&lt;DESTINATION_STATE_NAME_2&gt;), ..., (&lt;SYMBOL_N&gt;/&lt;REPLACEMENT_SYMBOL_N&gt;,&lt;DESTINATION_STATE_NAME_N&gt;)
            <br></br>
            The section begins with a line containing <b>.LOGIC</b> 
            <br></br>
            The following commands are supported by the machine definition language:
            <li><b>SCAN</b> - reads one symbol from the input</li>
            <li><b>PRINT</b> - produces one output symbol</li>
            <li><b>SCAN RIGHT</b> - reads one symbol from the input to the right of the tape head. The tape head then moves to that location.</li>
            <li><b>SCAN LEFT</b> - reads one symbol from the input to the left of the tape head. The tape head then moves to that location.</li>
            <li><b>READ(&lt;memory_object&gt;)</b> - reads one symbol from a given stack or queue. For example, if a STACK S1 was declared in the DATA section, a valid LOGIC definition is 1] READ(S1) (X,1), (Y,2). This means if X is “popped” from the stack, the machine stays in state 1, but if Y is popped, the machine moves to state 2.</li>
            <li><b>WRITE(&lt;memory_object&gt;)</b> - writes one symbol from a given stack or queue. For example, if a QUEUE Q1 was declared in the DATA section, a valid LOGIC definition is 1] WRITE(Q1) (X,1), (Y,2). This is an example of nondeterminism in the machine. If the machine enqueues X in Q1, it will stay in state 1, but if it nondeterministically decides to enqueue Y instead, it will move to state 2.</li>
            <li><b>RIGHT(&lt;tape_name&gt;)</b> - reads one symbol on an input tape to the right of the tape head and moves to that location. It also changes the state and overwrites that symbol with a new symbol. This instruction only applies to tapes or 2D tapes.</li>
            <li><b>LEFT(&lt;tape_name&gt;)</b> - reads one symbol on an input tape to the left of the tape head and moves to that location. It also changes the state and overwrites that symbol with a new symbol. This instruction only applies to tapes or 2D tapes.</li>
            {/* <li><b>UP (&lt;tape_name&gt;)</b> - reads one symbol on an input tape to the north of the tape head and moves to that location. It also changes the state and overwrites that symbol with a new symbol.</li>
            <li><b>DOWN (&lt;tape_name&gt;)</b> - reads one symbol on an input tape to the south of the tape head and moves to that location. It also changes the state and overwrites that symbol with a new symbol. This instruction only applies to 2D tapes.</li> */}
            <br></br>
            Note that each state’s behavior is completely defined in a single line. This means only one command can be associated with any of the states. The first line in the .LOGIC section defines the initial state. 
            <br></br>
            There are two special reserved words for state names. <b>accept</b> as a state name means that when the machine enters that state, the string is accepted, and the machine halts execution. <b>reject</b> as a state name means that when the machine enters that state, the string is rejected, and the machine halts execution.
          </div>
        </div>

      </main>
    </>
  )
}
