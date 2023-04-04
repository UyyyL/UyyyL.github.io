export class State {
    constructor(stateID="", isInitial=false, command="", commandTarget="", transitions=null, currState=false) {
        this.stateID = stateID;
        this.command = command;
        this.commandTarget = commandTarget;
        this.transitions = transitions;
        this.isInitial = isInitial;
        this.isCurrState = isInitial;
    }
}