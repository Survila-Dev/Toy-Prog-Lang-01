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
    elseCaseExists: boolean;

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);

            let stringUntilIf: string = "";
            const ifTag = FLNodeIf.syntaxSymbols.ifStartTag;
            for (let i = 0; i < this.text.length; i++) {
                if (this.text.substring(i, i + ifTag.length) === ifTag) {
                    console.log("If tag length: ")
                    console.log(ifTag.length)
                    const stringUntilIf = this.text.substring(0, i + 1);
                }
            }
            this.nodeLine = nodeLine + stringUntilIf.split("\n").length - this.text.split("\n").length;
            
            this.children = this.createChildren();
        }

    createChildren(): flSuperModule.FLNode[] {
        
        this.elseCaseExists = this.text.includes(FLNodeIf.syntaxSymbols.ifElseTag);

        // Find the text for conditional
        const [ifConditionalText, rest1] = findSubstringBetweenTags(
            this.text, FLNodeIf.syntaxSymbols.ifStartTag, FLNodeIf.syntaxSymbols.enclosureStartTag
        )

        const [ifCaseChildText, rest2] = findSubstringBetweenTags(
            rest1, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag
        )

        let ifCaseLine = this.nodeLine + ifConditionalText.split("\n").length - 1;
        if (ifCaseChildText.trimStart().split("\n").length
        !== ifCaseChildText.split("\n").length) {

            ifCaseLine += ifCaseChildText.split("\n").length - ifCaseChildText.trimStart().split("\n").length;
        }

        if (this.elseCaseExists) {
            const [elseText, rest3] = findSubstringBetweenTags(
                rest2, FLNodeIf.syntaxSymbols.enclosureEndTag, FLNodeIf.syntaxSymbols.enclosureStartTag
            )

            if (elseText.trim() !== FLNodeIf.syntaxSymbols.ifElseTag) {
                throw "Invalid text close to the ELSE token"
            }

            const [elseCaseText, rest4] = findSubstringBetweenTags(
                rest3, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag
            )

            let elseCaseLine = this.nodeLine 
                + ifConditionalText.split("\n").length - 1
                + ifCaseChildText.split("\n").length - 1; // + elseText.split("\n").length;

            if (elseCaseText.trimStart().split("\n").length
                !== elseCaseText.split("\n").length) {

                elseCaseLine += elseCaseText.split("\n").length - elseCaseText.trimStart().split("\n").length;
            }
            const children = ([
                new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
                new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
                new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, elseCaseText, elseCaseLine),
        ])
            this.children = children;
            return children;
        } else {
            const children = ([
                new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
                new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
            ])
            this.children = children;
            return children;
        }
    }

    run(scopeEnvironment: object) : [unknown, string[] | null] {

        // Depending on the ifConditional result eval one of the remaining children
        const ifCondEvaluation = convertToBoolean(this.children[0].run(scopeEnvironment)[0]);
        let returnVal: [unknown, string[] | null];
        if (ifCondEvaluation) {
            returnVal = this.children[1].run(scopeEnvironment)
        } else if (this.children.length == 3) {
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

        
        // Check if conditional was run? if not run it and set which child block will be eval

        if (this.children[0].status !== flSuperModule.GlobalStatusEnum.postRun) {

            const ifCondEvaluation = convertToBoolean(this.children[0].run(inputScopeEnvironment)[0]);

            if (ifCondEvaluation) {
                this.whichBlockChildToEval = 1;
            } else {
                this.whichBlockChildToEval = 2;
            }

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

        } else if (this.whichBlockChildToEval === 2 && !this.elseCaseExists) {
            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return ({
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            })
        
        } else if (this.children[this.whichBlockChildToEval].status !== flSuperModule.GlobalStatusEnum.postRun){
            
            
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
        
            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return ({
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            })
        
    }

}

export function findSubstringBetweenTags(text: string, startTag: string, endTag: string): [string, string] {
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