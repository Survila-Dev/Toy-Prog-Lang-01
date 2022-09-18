import * as flSuperModule from "./FLNodeSuper";
import * as flNodePrint from "./FLNodePrint";
import * as flNodeAssignment from "./FLNodeAssignment";
import { stringIgnoringTags, stringSplitIgnoringTags } from "../splitString";
import * as flNodeIf from "./FLNodeIf";
import * as flNodeFor from "./FLNodeFor";
import * as flNodeWhile from "./FLNodeWhile";
import * as flNodeFunction from "./FLNodeFunction";

export class FLNodeBlock extends flSuperModule.FLNode {

    childrenTextPublic: string[];
    nodeLine: number | undefined;

    static syntaxSymbols = {
        lineBreak: ";"
    }

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);
            this.nodeLine = nodeLine;
            
            this.children = this.createChildren();
        };

    createChildren() : flSuperModule.FLNode[]{

        const allTagsForBlock: [string, string][] = [
            [flNodeIf.FLNodeIf.syntaxSymbols.enclosureStartTag, flNodeIf.FLNodeIf.syntaxSymbols.enclosureEndTag],
            [flNodeWhile.FLNodeWhile.syntaxSymbols.enclosureStartTag, flNodeWhile.FLNodeWhile.syntaxSymbols.enclosureEndTag],
            [flNodeFor.FLNodeFor.syntaxSymbols.enclosureStartTag, flNodeFor.FLNodeFor.syntaxSymbols.enclosureEndTag],
            // [flNodeFor.FLNodeFor.syntaxSymbols.declEnclosureStartTag, flNodeFor.FLNodeFor.syntaxSymbols.declEnclosureEndTag],
            [flNodeFunction.FLNodeFunction.syntaxSymbols.startTag, flNodeFunction.FLNodeFunction.syntaxSymbols.endTag],
        ]

        const childrenText: string[] = stringSplitIgnoringTags(
            this.text,
            FLNodeBlock.syntaxSymbols.lineBreak,
            allTagsForBlock);

        this.childrenTextPublic = childrenText;

        let noOfLineBreaks = 0;
        if (this.nodeLine) {
            noOfLineBreaks = this.nodeLine - 1;
        }
        
        const children: (
            flNodeAssignment.FLNodeAssignment
            | flNodePrint.FLNodePrint
            | flNodeIf.FLNodeIf
            | flNodeWhile.FLNodeWhile
            | flNodeFor.FLNodeFor )[] = childrenText.map((childText, i) => {
            
            if (childText.includes("\n")) {
                noOfLineBreaks += childText.split("\n").length - 1;
            }

            if (childText.includes(flNodeFor.FLNodeFor.syntaxSymbols.forStart)) {

                return new flNodeFor.FLNodeFor(
                    flSuperModule.FLNodeTypeEnum.ForControl,
                    childText,
                    noOfLineBreaks + 1
                )

            } else if (childText.includes(flNodeWhile.FLNodeWhile.syntaxSymbols.whileStart)) {

                return new flNodeWhile.FLNodeWhile(
                    flSuperModule.FLNodeTypeEnum.WhileControl,
                    childText,
                    noOfLineBreaks + 1
                )
            
            // Search for IF
            } else if (childText.includes(flNodeIf.FLNodeIf.syntaxSymbols.ifStartTag)) {

                return new flNodeIf.FLNodeIf(
                    flSuperModule.FLNodeTypeEnum.IfConditional,
                    childText,
                    noOfLineBreaks + 1
                )

            } else if (childText.includes(flNodeAssignment.FLNodeAssignment.syntaxSymbols.assignment)) {
                
                return new flNodeAssignment.FLNodeAssignment(
                    flSuperModule.FLNodeTypeEnum.VariableAssignment,
                    childText,
                    noOfLineBreaks + 1
                )

            } else if (childText.includes(flNodePrint.FLNodePrint.syntaxSymbols.printStart)) {
                
                return new flNodePrint.FLNodePrint(
                    flSuperModule.FLNodeTypeEnum.Print,
                    childText,
                    noOfLineBreaks + 1
                )

            }

        })
        
        children.pop()
        this.children = children;
        return children;
    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]) {
            
            for (let i = 0; i < this.children.length; i++) {

                if (!(this.children[i].status === flSuperModule.GlobalStatusEnum.postRun)) {

                    const {
                        currentLine: newCurLine,
                        scopeEnvironment: newScopeEnv,
                        callStack: newCallStack,
                        output: newOutput} =
                            this.children[i].runOneStep(
                            inputCurrentLine, inputScopeEnvironment, inputCallStack)

                    return {
                        currentLine: newCurLine,
                        scopeEnvironment: newScopeEnv,
                        callStack: newCallStack,
                        output: newOutput}
                }
            }

            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return {
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null}
        }  

    run(scopeEnvironment: object): [unknown, string[] | null] {

        let consOut: string[];
        let singleConsOut: string | null;
        consOut = [];
        for (let i = 0; i < this.children.length; i++) {
            const outTemp = this.children[i].run(scopeEnvironment);
            // console.log(this.children[i])
            // console.log(outTemp);
            singleConsOut = outTemp[1];

            if (singleConsOut) {
                consOut.push(singleConsOut)
            }
        }

        if (consOut.length > 0) {
            // console.log(consOut);
            return ([null, consOut]);
        }
        return ([null, null]);
    }
}