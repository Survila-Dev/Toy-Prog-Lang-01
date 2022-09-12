import * as flSuperModule from "./FLNodeSuper";

export class FLNodeFunction extends flSuperModule.FLNode {
    static syntaxSymbols = {
        startTag: "FUNCTION",
        endTag: "END",
    }
}