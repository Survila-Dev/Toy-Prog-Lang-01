import * as flSuperModule from "./FLNodeSuper";

export class FLNodeIf extends flSuperModule.FLNode {
    static syntaxSymbols = {
        startTag: "IF",
        endTag: "END",
    }
}