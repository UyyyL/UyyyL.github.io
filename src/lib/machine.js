import {Stack, Queue, Tape, Tape2} from '@/lib/memory'
import {parseCode} from '@/lib/parser'

export class Machine {
    constructor (code=null, input=null) {
        let {memory, states, inputTape} = initializeMachine(code, input);
        this.memory = memory;
        this.states = states;
        this.inputTape = inputTape;
        this.output = "";
        this.currState = states[0] ? states[0] : "reject";
    }

    getMemory() {
        return Object.values(this.memory);
    }

    getMemoryID() {
        let memoryIDs = [];
        this.getMemory().map((memory)=>{
            memoryIDs.push(memory.memoryID);
        })
        return memoryIDs;
    }

    getMemoryElements() {
        let memoryElements = [];
        this.getMemory().map((memory)=>{
            memoryElements.push(memory.toString());
        })
        return memoryElements;
    }

    step() {
        let state = this.currState;
        switch (state.command) {
            case "SCAN": 
            case "SCAN_RIGHT":
                this.scan();
                break;

            case "SCAN_LEFT":
                this.scanleft();
                break;

            case "PRINT":
                this.print();
                break;
            
            case "READ":
                this.read();
                break;

            case "WRITE":
                this.write();
                break;
            
            case "RIGHT":
                this.right();
                break;
            
            case "LEFT":
                this.left();
                break;
            default: console.log("Command not recognized");
        }
    }

    scan() {
        this.inputTape.moveRight();
        const symbol = this.inputTape.currSymbol();
        let transitions = this.currState.transitions;
        let found = false;
        for (let i = 0; i < transitions.length; i++) {
            if (transitions[i].symbol === symbol) {
                this.currState = findState(this.states, transitions[i].destination);
                found = true;
                break;
            }
        }

        if (!found)
            this.currState = "reject";
    }

    scanleft() {
        this.inputTape.moveLeft();
        const symbol = this.inputTape.currSymbol();
        let transitions = this.currState.transitions;
        let found = false;
        for (let i = 0; i < transitions.length; i++) {
            if (transitions[i].symbol === symbol) {
                this.currState = findState(this.states, transitions[i].destination);
                found = true;
                break;
            }
        }

        if (!found)
            this.currState = "reject";
    }

    print() {
        let transitions = this.currState.transitions;
        for (let i = 0; i < transitions.length; i++) {
            let tempState = findState(this.states, transitions[i].destination);
            
            if (tempState !== "not_found") {
                this.output += transitions[i].symbol;
            }

            this.currState = tempState;
            break;
        }
    }

    read() {
        const target = this.currState.commandTarget;
        let symbol = "";
        let memory = this.memory;
        let found = false;
        for (let i = 0; i < Object.keys(memory).length; i++) {
            if (memory[i].memoryID === target) {
                found = true;
                if (memory[i] instanceof Stack) {
                    symbol = memory[i].pop();
                } else if (memory[i] instanceof Queue) {
                    symbol = memory[i].dequeue();
                }
                break;
            }
        }

        if (!found)
            this.currState = "reject";

        found = false;
        let transitions = this.currState.transitions;
        for (let i = 0; i < transitions.length; i++) {
            if (transitions[i].symbol === symbol) {
                this.currState = findState(this.states, transitions[i].destination);
                found = true;
                break;
            }
        }

        if (!found)
            this.currState = "reject";
    }

    write() {
        const target = this.currState.commandTarget;
        let mem;
        let memory = this.memory;
        let found = false;
        for (let i = 0; i < Object.keys(memory).length; i++) {
            if (memory[i].memoryID === target) {
                found = true;
                mem = memory[i];
                break;
            }
        }

        if (!found)
            this.currState = "reject";

        let transitions = this.currState.transitions;
        console.log(this.currState)
        found = false;
        for (let i = 0; i < transitions.length; i++) {
            let tempState = findState(this.states, transitions[i].destination);
            
            if (tempState !== "not_found") {
                found = true;
                if (mem instanceof Stack) {
                    mem.push(transitions[i].symbol);
                } else if (mem instanceof Queue) {
                    mem.enqueue(transitions[i].symbol);
                }
            }

            this.currState = tempState;
            // console.log(this.currState);
            break;
        }

        if (!found)
            this.currState = "reject";
    }

    right() {
        const target = this.currState.commandTarget;
        let mem;
        let memory = this.memory;
        let found = false;

        if (this.inputTape.memoryID === target) {
            mem = this.inputTape;
            found = true;
        }
            
        for (let i = 0; i < Object.keys(memory).length && !found; i++) {
            if (memory[i].memoryID === target) {
                mem = memory[i];
                found = true;
                // console.log(mem);
                break;
            }
        }

        if (!found)
            this.currState = "reject";

        found = false;
        if (mem instanceof Tape) {
            const symbol = mem.peekRight();
            let transitions = this.currState.transitions;
            for (let i = 0; i < transitions.length; i++) {
                if (transitions[i].symbol === symbol) {
                    this.currState = findState(this.states, transitions[i].destination);
                    found = true;
                    if (this.currState !== "not_found")
                        mem.replaceRight(transitions[i].replacement);
                    
                    // console.log(this.currState);
                    break;
                }
            }
        }
        
        if (!found)
            this.currState = "reject";

    }

    left() {
        const target = this.currState.commandTarget;
        let mem;
        let memory = this.memory;
        let found = false;

        if (this.inputTape.memoryID === target) {
            mem = this.inputTape;
            found = true;
        }

        for (let i = 0; i < Object.keys(memory).length; i++) {
            if (memory[i].memoryID === target) {
                found = true;
                mem = memory[i];
                // console.log(mem);
                break;
            }
        }

        if (!found)
            this.currState = "reject";

        found = false;
        if (mem instanceof Tape) {
            const symbol = mem.peekLeft();
            let transitions = this.currState.transitions;
            for (let i = 0; i < transitions.length; i++) {
                if (transitions[i].symbol === symbol) {
                    this.currState = findState(this.states, transitions[i].destination);
                    found = true;

                    if (this.currState !== "not_found") 
                        mem.replaceLeft(transitions[i].replacement);
                    
                    // console.log(this.currState);
                    break;
                }
            }
        }
        
    }

}

function findState(states, stateID) {
    if (stateID === "accept" || stateID === "reject")
        return stateID;

    for (let i = 0; i < Object.keys(states).length; i++) {
        if (states[i].stateID === stateID)
            return states[i];
    }

    return "not_found";
}

function initializeMachine(code, input) {
    let {memory, states} = parseCode(code, input);

    let inputTape = memory.inputTape;
    delete memory.inputTape;

    return {memory, states, inputTape};
}