import * as flSuperModule from "./FLNodeSuper";
import * as flExpModule from "./FLNodeExpression";

export class FLNodeAssignment extends flSuperModule.FLNode {
    static syntaxSymbols = {
        assignment: "=",
    }
    
    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {
            super(type, text);
            if (nodeLine) {
                this.nodeLine = nodeLine;
            }
            this.children = this.createChildren();
    };

    createChildren(): flSuperModule.FLNodeInterface[] {
        
        const childText: string = this.text.split(
            FLNodeAssignment.syntaxSymbols.assignment,
            2)[1]

        const onlyChild: flSuperModule.FLNodeInterface = new flExpModule.FLNodeExpression(
            flSuperModule.FLNodeTypeEnum.Expression,
            childText,
        )

        return [onlyChild]

    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: unknown[],
        inputCallStack: string[]) {

        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
                this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;

                let tempScopeEnv = inputScopeEnvironment;
                this.run(tempScopeEnv);

                return {
                    currentLine: this.nodeLine,
                    scopeEnvironment: tempScopeEnv,
                    callStack: inputCallStack,
                    output: null}

            } 

        const outputCallStack = flSuperModule.genericStateChange(
            this, inputCallStack)
            
        return {
            currentLine: this.nodeLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: outputCallStack,
            output: null}
    } 

    run(scopeEnvironment: object): [unknown, string] {
        
        const assignmentVar: string = this.text.split(
            FLNodeAssignment.syntaxSymbols.assignment,
            2)[0].trim()

        const onlyChildValue: unknown = this.children[0].run(scopeEnvironment)[0];
        
        scopeEnvironment[assignmentVar] = onlyChildValue;
        return [,""]
    }

}