import * as flSuperModule from "./FLNodeSuper";
import * as flExpModule from "./FLNodeExpression";

export class FLNodePrint extends flSuperModule.FLNode {

    static readonly syntaxSymbols: {
        printStart: string,
        printEnd: string
    } = {
        printStart: "PRINT(",
        printEnd: ")"
    };

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);
            this.nodeLine = nodeLine;
            this.children = this.createChildren();
        };

    createChildren() {
        const childText = this.text.substring(
            FLNodePrint.syntaxSymbols.printStart.length,
            this.text.length - FLNodePrint.syntaxSymbols.printEnd.length
        )

        const child = new flExpModule.FLNodeExpression(
            flSuperModule.FLNodeTypeEnum.Expression,
            childText);
        
        this.children = [child]
        return [child]
    }

    run(scopeEnvironment): [unknown, string] {
        return [null, this.children[0].run(scopeEnvironment)[0].toString()]
    }

    runOneStep(
            inputCurrentLine: number,
            inputScopeEnvironment: object,
            inputCallStack: string[]) {

        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
                this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;

                return {
                    currentLine: inputCurrentLine,
                    scopeEnvironment: inputScopeEnvironment,
                    callStack: inputCallStack,
                    output: this.run(inputScopeEnvironment)[1]
                }
            } 

        const outputCallStack = flSuperModule.genericStateChange(
            this, inputCallStack)
            
        return {
            currentLine: this.nodeLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: outputCallStack,
            output: null}
    } 
}