import * as flSuperModule from "./FLNodeSuper";

export class FLNodeFor extends flSuperModule.FLNode {

    static syntaxSymbols = {
        startTag: "FOR",
        endTag: "END",
    }
}