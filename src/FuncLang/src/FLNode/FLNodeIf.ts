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

export class FLNodeIf extends flSuperModule.FLNode {

    static syntaxSymbols = {
        ifStartTag: "IF",
        ifElseTag: "ELSE",
        enclosureStartTag: "{",
        enclosureEndTag: "}"
    }

    whichBlockChildToEval: number;

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);
            this.nodeLine = nodeLine;
            
            this.children = this.createChildren();
        }

    createChildren(): flSuperModule.FLNode[] {
        // Create children - ifConditional, ifCaseBlock, elseCaseBlock (not always)
        // Pass in text and the line position
        // console.log("this.text")
        // console.log(this.text)

        function findSubstringBetweenTags(text: string, startTag: string, endTag: string): [string, string] {
            let stringCutStart: number;
            let stringCutEnd: number;
            let foundTheFirstTag: boolean = false;
            let foundTheSecondTag: boolean = false;

            for (let i = 0; i < text.length; i++) {

                if (text.substring(i, i + startTag.length) === startTag) {
                    stringCutStart = i + startTag.length;
                    foundTheFirstTag = true;
                }

                if (foundTheFirstTag && text.substring(i, i + endTag.length) === endTag) {
                    stringCutEnd = i + endTag.length;
                    foundTheSecondTag = true;
                }

                if (foundTheFirstTag && foundTheSecondTag) {
                    return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)])
                }
            }

            throw `Not possible to find the start or end tags (start tag: ${foundTheFirstTag}, end tag: ${foundTheSecondTag})`
        }

        // Find the text for conditional
        const [ifConditionalText, rest1] = findSubstringBetweenTags(
            this.text, FLNodeIf.syntaxSymbols.ifStartTag, FLNodeIf.syntaxSymbols.enclosureStartTag
        )
        // console.log("ifConditionalText");
        // console.log(ifConditionalText);

        const [ifCaseChildText, rest2] = findSubstringBetweenTags(
            rest1, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag
        )
        // console.log("ifCaseChildText");
        // console.log(ifCaseChildText);

        const [elseText, rest3] = findSubstringBetweenTags(
            rest2, FLNodeIf.syntaxSymbols.enclosureEndTag, FLNodeIf.syntaxSymbols.enclosureStartTag
        )
        // console.log("elseText");
        // console.log(elseText);

        if (elseText.trim() !== FLNodeIf.syntaxSymbols.ifElseTag) {
            throw "Invalid text close to the ELSE token"
        }

        const [elseCaseText, rest4] = findSubstringBetweenTags(
            rest3, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag
        )
        // console.log("elseCaseText");
        // console.log(elseCaseText);

        // Calc the line positions

        const ifCaseLine = this.nodeLine + ifConditionalText.split("\n").length;
        const elseCaseLine = ifCaseLine + elseText.split("\n").length + elseCaseText.split("\n").length;

        const children = ([
            new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
            new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
            new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, elseCaseText, elseCaseLine),
        ])

        this.children = children;
        return children;
    }

    run(scopeEnvironment: object) : [unknown, string[] | null] {

        // Depending on the ifConditional result eval one of the remaining children
        const ifCondEvaluation = convertToBoolean(this.children[0].run(scopeEnvironment)[0]);
        let returnVal: [unknown, string[] | null];
        if (ifCondEvaluation) {
            returnVal = this.children[1].run(scopeEnvironment)
        } else {
            returnVal = this.children[2].run(scopeEnvironment)
        }
        return returnVal
    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]): {
            currentLine: number;
            scopeEnvironment: object;
            callStack: string[];
            output: string | null; } {

        const ifCondEvaluation = convertToBoolean(this.children[0].run(inputScopeEnvironment)[0]);

        if (ifCondEvaluation) {
            this.whichBlockChildToEval = 1;
        } else {
            this.whichBlockChildToEval = 2;
        }
        // Check if conditional was run? if not run it and set which child block will be eval

        if (this.children[0].status !== flSuperModule.GlobalStatusEnum.postRun) {

            const {
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput} =
                    this.children[0].runOneStep(
                    inputCurrentLine, inputScopeEnvironment, inputCallStack)

            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput})
                
        } else {
            const {
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput} =
                    this.children[this.whichBlockChildToEval].runOneStep(
                    inputCurrentLine, inputScopeEnvironment, inputCallStack)

            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput})
        }
        

        let curLine = inputCurrentLine;
        let curScopeEnvironment = inputScopeEnvironment;
        let curStack = inputCallStack;

        return ({
            currentLine: curLine,
            scopeEnvironment: curScopeEnvironment,
            callStack: curStack,
            output: null
        })

        this.status = flSuperModule.GlobalStatusEnum.postRun;
        return ({
            currentLine: inputCurrentLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: inputCallStack,
            output: null
        })
    }

}
