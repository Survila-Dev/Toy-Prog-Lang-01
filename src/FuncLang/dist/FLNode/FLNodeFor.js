"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.FLNodeFor = void 0;
var flSuperModule = require("./FLNodeSuper");
var flNodeWhile = require("./FLNodeWhile");
var FLNodeIf_1 = require("./FLNodeIf");
// export function separateStringInTwo(text: string, tag: string) {
//     for (let i = 0; i < text.length; i++) {
//         if (text.substring(i, i + tag.length) === tag) {
//             return [text.substring(0, i-1), text.substring(i, text.length)]
//         }
//     }
// }
var FLNodeFor = /** @class */ (function (_super) {
    __extends(FLNodeFor, _super);
    function FLNodeFor(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        _this.nodeLine = nodeLine;
        // console.log("OK1")
        var _a = (0, FLNodeIf_1.findSubstringBetweenTags)(_this.text, FLNodeFor.syntaxSymbols.forStart, FLNodeFor.syntaxSymbols.forDeclSep), initText = _a[0], rest1 = _a[1];
        // console.log("InitText")
        // console.log(initText)
        // console.log("rest1")
        // console.log(rest1)
        // console.log("OK2")
        var _b = (0, FLNodeIf_1.findSubstringBetweenTags)(rest1, FLNodeFor.syntaxSymbols.forDeclSep, FLNodeFor.syntaxSymbols.forDeclSep), forCondition = _b[0], rest2 = _b[1];
        // console.log("rest2")
        // console.log(rest2)
        // console.log("forCondition")
        // console.log(forCondition)
        // console.log("OK3")
        var _c = (0, FLNodeIf_1.findSubstringBetweenTags)(rest2, FLNodeFor.syntaxSymbols.forDeclSep, FLNodeFor.syntaxSymbols.forDeclEnd), iterText = _c[0], rest3 = _c[1];
        // console.log("rest3")
        // console.log(rest3)
        // console.log("iterText")
        // console.log(iterText)
        // console.log("OK4")
        // get text for forInit, forIter; and change this.text to while format
        _this.forInitString = initText;
        _this.forIterString = iterText;
        _this.textInWhileFormat = "WHILE (".concat(forCondition, " ").concat(rest3);
        // console.log("textInWhileFormat")
        // console.log(this.textInWhileFormat)
        _this.children = _this.createChildren();
        return _this;
    }
    FLNodeFor.prototype.createChildren = function () {
        var child = new flNodeWhile.FLNodeWhile(flSuperModule.FLNodeTypeEnum.WhileControl, this.textInWhileFormat, this.nodeLine, this.forInitString, this.forIterString);
        this.children = [child];
        return this.children;
    };
    FLNodeFor.prototype.run = function (scopeEnvironment) {
        return this.children[0].run(scopeEnvironment);
    };
    FLNodeFor.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        if (this.children[0].status === flSuperModule.GlobalStatusEnum.postRun) {
            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return ({
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            });
        }
        else {
            var _a = this.children[0].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _a.currentLine, newScopeEnv = _a.scopeEnvironment, newCallStack = _a.callStack, newOutput = _a.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
    };
    FLNodeFor.syntaxSymbols = {
        forStart: "FOR (",
        forDeclSep: "|",
        forDeclEnd: ")",
        enclosureStartTag: "{",
        enclosureEndTag: "}",
        declEnclosureStartTag: "(",
        declEnclosureEndTag: ")"
    };
    return FLNodeFor;
}(flSuperModule.FLNode));
exports.FLNodeFor = FLNodeFor;
