import * as flSuperModule from "./FLNodeSuper";
import * as flExpModule from "./FLNodeExpression";
import { FLNodeConditional } from "../../dist/FLNode/FLNodeConditional";
// import * as flCondModule from "./FLNodeConditional";

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
        
        const splitToken = FLNodeAssignment.syntaxSymbols.assignment

        let whereToCutString = 0;
        for (let i = 0; i < this.text.length; i++) {
            if (this.text.substring(i, i + splitToken.length) == splitToken) {
                whereToCutString = i + 1;
                break;
            }
        }
        const childText = this.text.substring(whereToCutString, this.text.length);

        let conditionalChild = false;
        let onlyChild: flSuperModule.FLNode;

        // If the conditional tokens are found in the string create in other case FLNodeExpression
        const keys = Object.keys(FLNodeConditional.syntaxSymbols)

        for (let i = 0; i < keys.length; i++) {

            if (childText.includes(FLNodeConditional.syntaxSymbols[keys[i]])) {
                
                conditionalChild = true;
            }
        }

        if (conditionalChild) {

            onlyChild = new FLNodeConditional(
                flSuperModule.FLNodeTypeEnum.Conditional,
                childText,
            )

        } else {
        
            onlyChild = new flExpModule.FLNodeExpression(
                flSuperModule.FLNodeTypeEnum.Expression,
                childText,
            )
        }

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
        return ([,""]);
    }

}