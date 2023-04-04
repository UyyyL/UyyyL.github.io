export class Stack {
    constructor(stack=null, memoryID="") {
        //existing data
        if (stack) {
            this.elements = deepcopy(stack.elements);
            this.top = stack.top;
            this.memoryID = stack.memoryID;
        }
        //new memory 
        else {
            this.elements = {};
            this.top = 0;
            this.memoryID = memoryID;
        }
    }

    push(elem) {
        this.elements[this.top] = elem;
        this.top++;
    }

    pop() {
        this.top--;
        const elem = this.elements[this.top];
        delete this.elements[this.top];
        return elem;
    }

    peek() {
        return this.elements[this.top - 1];
    }

    get length() {
        return this.top;
    }

    get isEmpty() {
        return this.length === 0;
    }

    toString() {
        let string = '';
        for (let i = this.top - 1; i >= 0; i--) {
            string += String(this.elements[i]);
        }
        return string.split('').reverse().join('');
    }
}

export class Queue {
    constructor(queue=null, memoryID="") {
        //existing data
        if (queue) {
            this.elements = deepcopy(queue.elements);
            this.head = queue.head;
            this.tail = queue.tail;
            this.memoryID = queue.memoryID;
        }
        //new memory 
        else {
            this.elements = {};
            this.head = 0;
            this.tail = 0;
            this.memoryID = memoryID;
        }
    }

    enqueue(elem) {
        this.elements[this.tail] = elem;
        this.tail++;
    }

    dequeue() {
        const elem = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return elem;
    }

    peek() {
        return this.elements[this.head];
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    toString() {
        let string = '';
        for (let i = this.head; i < this.tail; i++) {
            string += String(this.elements[i]);
        }
        return string;
    }
}

export class Tape {
    constructor(tape=null, memoryID="", isInput=false){
        //existing data
        if (tape) {
            this.elements = deepcopy(tape.elements);
            this.pointer = tape.pointer;
            this.memoryID = tape.memoryID;
            this.isInput = tape.isInput;
        }
        //new memory 
        else {
            this.elements = {0: "#"};
            this.pointer = 0;
            this.memoryID = memoryID;
            this.isInput = isInput;
        }
    }

    insertInput(input) {
        let symbols = input.split("");
        for (let i = 0; i < symbols.length; i++) {
            this.elements[i+1] = symbols[i];
        }
    }

    moveLeft() {
        this.pointer--;
    }

    moveRight() {
        this.pointer++;
    }

    currSymbol() {
        return this.elements[this.pointer] ? this.elements[this.pointer] : "#";
    }

    peekLeft(){
        return this.elements[this.pointer - 1];
    }

    peekRight(){
        return this.elements[this.pointer + 1] ? this.elements[this.pointer + 1] : "#";
    }

    replaceLeft(symbol){
        this.pointer--;
        this.elements[this.pointer] = symbol;
    }

    replaceRight(symbol){
        this.pointer++;
        this.elements[this.pointer] = symbol;
    }

    toString() {
        let string = '';
        let i = 0;
        while(this.elements[i]) {
            string += String(this.elements[i]);
            i++;
        }
        return string + "#";
    }

    //for input string only
    firstHalfToString() {
        let string = '';
        let i = 0;
        while(i < this.pointer && this.elements[i]) {
            string += String(this.elements[i]);
            i++;
        }
        return string;
    }

    secondHalfToString() {
        let string = '';
        let i = this.pointer + 1;
        while(this.elements[i]) {
            string += String(this.elements[i]);
            i++;
        }
        return string + "#";
    }
}

export class Tape2 {

}

function deepcopy (object) {
    return Object.assign (
        Object.create(Object.getPrototypeOf(object)),
        JSON.parse(JSON.stringify(object)));
}