import * as flSuperModule from "./FLNodeSuper";
import * as flNodeWhile from "./FLNodeWhile"
import { findSubstringBetweenTags } from "./FLNodeIf"

// export function separateStringInTwo(text: string, tag: string) {
//     for (let i = 0; i < text.length; i++) {
//         if (text.substring(i, i + tag.length) === tag) {
//             return [text.substring(0, i-1), text.substring(i, text.length)]
//         }
//     }
// }

export class FLNodeFor extends flSuperModule.FLNode {

    forInitString: string;
    forIterString: string;
    textInWhileFormat: string;

    static syntaxSymbols = {
        forStart: "FOR (",
        forDeclSep: "|",
        forDeclEnd: ")",
        enclosureStartTag: "{",
        enclosureEndTag: "}",
        declEnclosureStartTag: "(",
        declEnclosureEndTag: ")"
    }

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

            super(type, text);
            this.nodeLine = nodeLine;

            // console.log("OK1")
            const [initText, rest1] = findSubstringBetweenTags(
                this.text, FLNodeFor.syntaxSymbols.forStart, FLNodeFor.syntaxSymbols.forDeclSep);

            // console.log("InitText")
            // console.log(initText)
            // console.log("rest1")
            // console.log(rest1)
            // console.log("OK2")

            const [forCondition, rest2] = findSubstringBetweenTags(
                rest1, FLNodeFor.syntaxSymbols.forDeclSep, FLNodeFor.syntaxSymbols.forDeclSep);

            // console.log("rest2")
            // console.log(rest2)
            // console.log("forCondition")
            // console.log(forCondition)

            // console.log("OK3")
            const [iterText, rest3] = findSubstringBetweenTags(
                rest2, FLNodeFor.syntaxSymbols.forDeclSep, FLNodeFor.syntaxSymbols.forDeclEnd);

            // console.log("rest3")
            // console.log(rest3)
            // console.log("iterText")
            // console.log(iterText)

            // console.log("OK4")
            // get text for forInit, forIter; and change this.text to while format
            this.forInitString = initText;
            
            this.forIterString = iterText;
            
            this.textInWhileFormat = `WHILE (${forCondition} ${rest3}`;
            // console.log("textInWhileFormat")
            // console.log(this.textInWhileFormat)

            this.children = this.createChildren();
        }

    createChildren() {

        const child = new flNodeWhile.FLNodeWhile(
            flSuperModule.FLNodeTypeEnum.WhileControl,
            this.textInWhileFormat,
            this.nodeLine,
            this.forInitString,
            this.forIterString
        )
        this.children = [child];
        return this.children;
    }

    run(scopeEnvironment: object) {
        return this.children[0].run(scopeEnvironment);
    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]): {
            currentLine: number;
            scopeEnvironment: object;
            callStack: string[];
            output: string | null; } {

        if (this.children[0].status === flSuperModule.GlobalStatusEnum.postRun) {
            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return ({
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            })
        } else {
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

    }
}