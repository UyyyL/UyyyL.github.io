import {Stack, Queue, Tape, Tape2} from '@/lib/memory'
import {State} from '@/lib/state'

function createMemory(line) {
    let memory = line.split(" ");
    memory = memory.filter(part => part.trim().length > 0);
    if (memory[0] === "STACK")
        return new Stack(null, memory[1]);
    if (memory[0] === "QUEUE")
        return new Queue(null, memory[1]);
    if (memory[0] === "TAPE")
        return new Tape(null, memory[1], false);
    return -1;
}

function convertToInputTape(memory, input) {
    let inputTape = null

    for (let i = 0; i < Object.keys(memory).length; i++) {
        if (memory[i] instanceof Tape) {
            memory[i].isInput = true;
            memory[i].insertInput(input);
            inputTape = new Tape(memory[i]);
            delete memory[i];
            break;
        }
    }

    for (let i = 0; i < Object.keys(memory).length; i++) {
        let temp = memory[Object.keys(memory)[i]];
        delete memory[Object.keys(memory)[i]];
        memory[i] = temp;
    }

    return inputTape;
}

function createInputTape(input) {
    let inputTape = new Tape(null, "", true);
    inputTape.insertInput(input);
    return inputTape;
}

function getTransitions(line) {
    let transitions = [];
    for (let i in line) {
        line[i] = line[i].replace(/[\(\)]/g, '').replace(/[/,]/g, ' ').trim(); // remove (),/ from string
        let transition = line[i].split(" ");
        if (transition.length === 2) {
            transitions.push({symbol: transition[0], destination: transition[1]});
        } else if (transition.length === 3) {
            transitions.push({symbol: transition[0], replacement: transition[1], destination: transition[2]});
        }
    }
    return transitions;
}

function createState(line, isInitial) {
    let syntax = line.split(" ");
    syntax = syntax.filter(part => part.trim().length > 0);
    
    let stateID = syntax[0].replace("]","");
    
    let command = "";
    let commandTarget = "";
    if (typeof(syntax[1]) === typeof(String())) {
        if (syntax[1] === "SCAN" || 
        syntax[1] === "PRINT") {
            command = syntax[1];

            if (syntax[2] === "LEFT" || syntax[2] === "RIGHT")
                command += "_" + syntax[2];
        }

        else if (syntax[1].startsWith("READ") ||
                syntax[1].startsWith("WRITE") ||
                syntax[1].startsWith("RIGHT") ||
                syntax[1].startsWith("LEFT")) {
            let comm = syntax[1].split("(");
            command = comm[0]; 
            commandTarget = comm[1].replace(")","");
        }
    }

    let transitions = getTransitions(syntax);

    if (stateID.length == 0 || command.length == 0 || transitions.length == 0)
        return -1;

    return new State(stateID, isInitial, command, commandTarget, transitions);
}

export function parseCode(code, input) {
    let lines = code.split('\n');
    lines = lines.filter(line => line.trim().length > 0);
    
    let dataIndex = lines.indexOf(".DATA");
    let logicIndex = lines.indexOf(".LOGIC");

    let memory = {}
    let states = {}

    if (dataIndex != -1) {
        //create all aux memory
        let tapeCount = 0
        for (let i = dataIndex+1, index = 0; i < logicIndex && i < lines.length; i++) {
            
            let mem = createMemory(lines[i]);

            if (mem !== -1) {
                memory[index] = mem;
                index++;

                if (mem instanceof Tape)
                    tapeCount++;
            }
        }

        if (tapeCount >= 1)
            memory.inputTape = convertToInputTape(memory, input);
        else
            memory.inputTape = createInputTape(input);
            
    } else {
        memory.inputTape = createInputTape(input)
    }

    for (let i = logicIndex+1, index = 0; i < lines.length; i++) {
            let state = createState(lines[i], i===logicIndex+1);

            if (state !== -1) {
                states[index] = state;
                index++;
            }
    }

    return {memory, states};
}