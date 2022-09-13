export enum FLNodeTypeEnum {
    Block = "Block",
    Line = "Line",
    VariableAssignment = "VariableAssignment",
    Expression = "Expression",
    PlusExp = "PlusExp",
    MinusExp = "MinusExp",
    MultipleExp = "MultipleExt",
    DivisionExp = "DivisionExp",
    Condition = "Condition",
    IfConditional = "IfConditional",
    WhileControl = "WhileControl",
    ForControl = "ForControl",
    Print = "Print",
    Read = "Read",
}

export enum GlobalStatusEnum {
    noRun = "noRun",
    inRun = "inRun",
    postRun = "postRun"
}

export enum RunCycleStatusEnum {
    beforeRun = "beforeRun",
    selectLine = "selectLine",
    pushToStack = "pushToStack",
    evaluate = "evaluate",
    popOffStack = "popOffStack",
    afterRun = "afterRun"
}

export type BlockTextInterface = string;

export interface FLNodeInterface {
    startTag?: string,
    endTag?: string,
    type: FLNodeTypeEnum,
    reCheckType?: Function,
    expressionSymbol?: string,
    text: BlockTextInterface,
    children: FLNodeInterface[],
    createChildren: Function,
    run: Function,
    runOneStep: Function,

    status: GlobalStatusEnum;
    runCycleStatus: RunCycleStatusEnum;
}

export class FLNode implements FLNodeInterface {
    type: FLNodeTypeEnum;
    text: BlockTextInterface;
    children: FLNodeInterface[];
    status: GlobalStatusEnum;
    runCycleStatus: RunCycleStatusEnum;
    nodeLine?: number;

    constructor(
        type: FLNodeTypeEnum,
        text: BlockTextInterface,
        nodeLine?: number) {

            this.type = type;
            this.text = text.trim();
            this.status = GlobalStatusEnum.noRun;
            this.runCycleStatus = RunCycleStatusEnum.beforeRun;

           // this.children = this.createChildren();
        };

    createChildren(): FLNodeInterface[] {
        // Create children depending on type
        return []
    };

    run(scopeEnvironment: unknown[]): [unknown, string | string[]] {
        // Run the FLNode depending on type
        return ["",""];
    };

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]) {

            // This function should do nothing, because all the logic
            // is handled not at the lowest level of the node tree
            throw "runOneStep not implemented at this node."

            return {
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null}
        }  
};

export function genericStateChange(
    inputNode: FLNode,
    inputCallStack: string[]) {

    let outputCycleStatus: RunCycleStatusEnum;
    let outputCallStack = inputCallStack;

    switch(inputNode.runCycleStatus) {
        case RunCycleStatusEnum.beforeRun:
            inputNode.runCycleStatus = RunCycleStatusEnum.pushToStack;
            inputNode.status = GlobalStatusEnum.inRun;
            break;
        // case RunCycleStatusEnum.selectLine:
        //     inputNode.runCycleStatus = RunCycleStatusEnum.pushToStack;
        //     break;
        case RunCycleStatusEnum.pushToStack:
            outputCallStack.push(inputNode.text);
            inputNode.runCycleStatus = RunCycleStatusEnum.evaluate;
            break;
        case RunCycleStatusEnum.popOffStack:
            outputCallStack.pop();
            inputNode.runCycleStatus = RunCycleStatusEnum.afterRun;
            inputNode.status = GlobalStatusEnum.postRun;
            break;
    }
    
    return outputCallStack;
}