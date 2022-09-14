import { FLNodeBlock } from "./FLNode/FLNodeBlock";
import * as FLNode from "./FLNode/FLNodeSuper"

interface FLLangCodeInterface {
    executionInterval: number;
    executionContext: object;
    callStack: string[],
    currentOutput: string;
    
    currentLine: number;
    errorLine: number;
    breakPoints: number[];

    runOneStep: Function;
}

export class FLCode implements FLLangCodeInterface {

    // Public properties
    executionInterval: number;
    executionContext: object;
    callStack: string[];
    currentOutput: string;

    currentLine: number | null;
    errorLine: number | null;
    breakPoints: number[];
    internalText: string;

    // Static properties
    child: FLNodeBlock;
    private lineNo: number;

    constructor (inputText: string, executionInterval: number) {
        // Setting the variables
        this.internalText = inputText;
        this.executionInterval = executionInterval;
        this.currentLine = null;
        this.errorLine = null;
        this.breakPoints = [];
        this.currentOutput = null;
        // Parsing the inputText
        this.child = new FLNodeBlock(FLNode.FLNodeTypeEnum.Block, inputText)
        // console.log(this.child)
        this.callStack = [];
        this.executionContext = {};

    }

    runOneStep(
        inputCurrentLine: number,
        inputExecutionContext: object,
        inputCallStack: string[]
    ) {

        // Prepare the values for runOneStep
        // const altCallStack = inputCallStack.map((element) => element[0])
        // let altExecutionContext = {}
        // Object.keys(inputExecutionContext).forEach((key) => {
        //     altExecutionContext[key] = inputExecutionContext[key][0]
        // })

        const altInputCurLine = JSON.parse(JSON.stringify(inputCurrentLine));
        const altCallStack = JSON.parse(JSON.stringify(inputCallStack));
        const altExecutionContext = JSON.parse(JSON.stringify(inputExecutionContext));

        const outObj = this.child.runOneStep(altInputCurLine, altExecutionContext, altCallStack);
        this.currentLine = JSON.parse(JSON.stringify(outObj.currentLine));
        this.executionContext = JSON.parse(JSON.stringify(outObj.scopeEnvironment));
        this.callStack = JSON.parse(JSON.stringify(outObj.callStack));
        this.currentOutput = JSON.parse(JSON.stringify(outObj.output));

        return "";
    };
}