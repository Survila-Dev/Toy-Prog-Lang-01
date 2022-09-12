import * as flSuperModule from "./FLNodeSuper";

export class FLNodeWhile extends flSuperModule.FLNode {
    static syntaxSymbols = {
        startTag: "WHILE",
        endTag: "END",
    }
}
