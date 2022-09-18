import * as flSuperModule from "./FLNodeSuper";
import * as flNodePrint from "./FLNodePrint";
import * as flNodeAssignment from "./FLNodeAssignment";
import { stringIgnoringTags, stringSplitIgnoringTags } from "../splitString";
import * as flNodeIf from "./FLNodeIf";
import * as flNodeFor from "./FLNodeFor";
import * as flNodeWhile from "./FLNodeWhile";
import * as flNodeFunction from "./FLNodeFunction";
import { convertToBoolean, FLNodeConditional } from "./FLNodeConditional";
import { FLNodeBlock } from "./FLNodeBlock";

export class FLNodeWhile extends flSuperModule.FLNode {

    static syntaxSymbols = {
        whileStart: "WHILE",
        enclosureStartTag: "{",
        enclosureEndTag: "}"
    }

    shouldConditionalChildBeRun: boolean;
    executeBlockChild: boolean;

    forInitString: string;
    forIterString: string;

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number,
        forInitString: string = "",
        forIterString: string = "",) {

            super(type, text);

            this.forInitString = forInitString;
            this.forIterString = forIterString;
            if (this.forInitString.length !== 0) this.forInitString += ";"
            if (this.forIterString.length !== 0) this.forIterString += ";"

            let stringUntilWhile: string = "";
            
            const whileTag = FLNodeWhile.syntaxSymbols.whileStart;
            for (let i = 0; i < this.text.length; i++) {
                if (this.text.substring(i, i + whileTag.length) === whileTag) {

                    const stringUntilWhile = this.text.substring(0, i + 1);
                }
            }
            this.nodeLine = nodeLine + stringUntilWhile.split("\n").length - this.text.split("\n").length;
            
            this.shouldConditionalChildBeRun = true;
            this.children = this.createChildren();
        }

    createChildren(onlyFirstTwo = false): flSuperModule.FLNode[] {
        // Create child for whileCondition, whileCase
        const [whileConditionalText, rest1] = flNodeIf.findSubstringBetweenTags(
            this.text, FLNodeWhile.syntaxSymbols.whileStart, FLNodeWhile.syntaxSymbols.enclosureStartTag
        )

        const [whileCaseText, rest2] = flNodeIf.findSubstringBetweenTags(
            rest1, FLNodeWhile.syntaxSymbols.enclosureStartTag,  FLNodeWhile.syntaxSymbols.enclosureEndTag
        )

        // Calc the nodeLine arguments for the children
        let whileConditionalLine = this.nodeLine;
        if (whileConditionalText.trimStart().split("\n").length
        !== whileConditionalText.split("\n").length) {

            whileConditionalLine += whileConditionalText.split("\n").length
                - whileConditionalText.trimStart().split("\n").length;
        }

        let whileCaseLine = whileConditionalLine + whileConditionalText.split("\n").length - 1;
        if (whileCaseText.trimStart().split("\n").length
        !== whileCaseText.split("\n").length) {

            whileCaseLine += whileCaseText.split("\n").length
                - whileCaseText.trimStart().split("\n").length;
        }

        let children: flSuperModule.FLNode[];
        if (this.forInitString.length === 0) {
            children = ([
                new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine)
            ]);
        } else {
            if (onlyFirstTwo) {
                children = ([
                    new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                    new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine),
                    this.children[2] as FLNodeBlock,
                ]);

            } else {
                children = ([
                    new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                    new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine),
                    new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, this.forInitString, whileConditionalLine),
                ]);
            }
        }
        
        this.children = children;

        return children;
    }

    run(scopeEnvironment: object) : [unknown, string[] | null] {

        let returnVal: [unknown, string[] | null]
        returnVal = [, []];
        if (this.children.length === 3) { // Running for init command
            const returnValNew = this.children[2].run(scopeEnvironment);
            // console.log("scopeEnvironment");
            // console.log(scopeEnvironment);
            returnVal[1] = returnVal[1].concat([returnValNew[1]])
        }
        while(convertToBoolean(this.children[0].run(scopeEnvironment)[0])) {
            const returnValNew = this.children[1].run(scopeEnvironment);
            returnVal[1] = returnVal[1].concat([returnValNew[1]])

            // ! Implement the breaking from the while loop which is triggered by some event from React
        }
        return returnVal;
    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]): {
            currentLine: number;
            scopeEnvironment: object;
            callStack: string[];
            output: string | null; } {

        // console.log(this.shouldConditionalChildBeRun)
        if (this.children.length === 3
            && this.children[2].status !== flSuperModule.GlobalStatusEnum.postRun) { // Run for init
            const {
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput} =
                    this.children[2].runOneStep(
                    inputCurrentLine, inputScopeEnvironment, inputCallStack);

            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput})
        }

        // check if conditional node should be run
        if (this.shouldConditionalChildBeRun) {
            // console.log("Conditional child starts running")

            // if conditional child is postrun when let this node execute the block and stop executing
            if (this.children[0].status === flSuperModule.GlobalStatusEnum.postRun) {

                this.shouldConditionalChildBeRun = false;
                const conditionalChildValue = convertToBoolean(this.children[0].run(inputScopeEnvironment)[0]);
                this.executeBlockChild = conditionalChildValue;

                if (!conditionalChildValue) {
                    this.status = flSuperModule.GlobalStatusEnum.postRun;
                }

                return ({
                    currentLine: inputCurrentLine,
                    scopeEnvironment: inputScopeEnvironment,
                    callStack: inputCallStack,
                    output: null
                })

            } else { // runs conditional child
                // console.log("Conditional child runs a step")
                // console.log(this.children[0])
                const {
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput} =
                        this.children[0].runOneStep(
                        inputCurrentLine, inputScopeEnvironment, inputCallStack);

                return ({
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput})
            }

        } else { // block child will be run, if block child is postrun run the conditional again
            if (this.children[1].status === flSuperModule.GlobalStatusEnum.postRun) {

                // Both childs are redeclared
                this.createChildren(true);

                this.shouldConditionalChildBeRun = true;
                return ({
                    currentLine: inputCurrentLine,
                    scopeEnvironment: inputScopeEnvironment,
                    callStack: inputCallStack,
                    output: null
                })

            } else { // Block child is evaluted
                // console.log("Block child with in while is evaluated");
                const {
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput} =
                        this.children[1].runOneStep(
                        inputCurrentLine, inputScopeEnvironment, inputCallStack);

                return ({
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput})
            }

        }
    }
}
