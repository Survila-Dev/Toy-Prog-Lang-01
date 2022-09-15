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

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);

            let stringUntilWhile: string = "";
            
            const whileTag = FLNodeWhile.syntaxSymbols.whileStart;
            for (let i = 0; i < this.text.length; i++) {
                if (this.text.substring(i, i + whileTag.length) === whileTag) {

                    const stringUntilWhile = this.text.substring(0, i + 1);
                }
            }
            this.nodeLine = nodeLine + stringUntilWhile.split("\n").length - this.text.split("\n").length;
            
            this.children = this.createChildren();
        }

    createChildren(): flSuperModule.FLNode[] {
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

        const children = ([
            new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText),
            new FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText)
        ]);
        this.children = children;

        return children;
    }

    run(scopeEnvironment: object) : [unknown, string[] | null] {

        let returnVal: [unknown, string[] | null]
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

        this.status = flSuperModule.GlobalStatusEnum.postRun;
        return ({
            currentLine: inputCurrentLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: inputCallStack,
            output: null
        })
    }
}
