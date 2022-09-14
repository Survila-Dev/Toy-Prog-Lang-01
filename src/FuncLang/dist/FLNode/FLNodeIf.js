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
exports.FLNodeIf = void 0;
var flSuperModule = require("./FLNodeSuper");
var FLNodeConditional_1 = require("./FLNodeConditional");
var FLNodeBlock_1 = require("./FLNodeBlock");
var FLNodeIf = /** @class */ (function (_super) {
    __extends(FLNodeIf, _super);
    function FLNodeIf(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        _this.nodeLine = nodeLine;
        _this.children = _this.createChildren();
        return _this;
    }
    FLNodeIf.prototype.createChildren = function () {
        // Create children - ifConditional, ifCaseBlock, elseCaseBlock (not always)
        // Pass in text and the line position
        // console.log("this.text")
        // console.log(this.text)
        function findSubstringBetweenTags(text, startTag, endTag) {
            var stringCutStart;
            var stringCutEnd;
            var foundTheFirstTag = false;
            var foundTheSecondTag = false;
            for (var i = 0; i < text.length; i++) {
                if (text.substring(i, i + startTag.length) === startTag) {
                    stringCutStart = i + startTag.length;
                    foundTheFirstTag = true;
                }
                if (foundTheFirstTag && text.substring(i, i + endTag.length) === endTag) {
                    stringCutEnd = i + endTag.length;
                    foundTheSecondTag = true;
                }
                if (foundTheFirstTag && foundTheSecondTag) {
                    return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)]);
                }
            }
            throw "Not possible to find the start or end tags (start tag: ".concat(foundTheFirstTag, ", end tag: ").concat(foundTheSecondTag, ")");
        }
        // Find the text for conditional
        var _a = findSubstringBetweenTags(this.text, FLNodeIf.syntaxSymbols.ifStartTag, FLNodeIf.syntaxSymbols.enclosureStartTag), ifConditionalText = _a[0], rest1 = _a[1];
        // console.log("ifConditionalText");
        // console.log(ifConditionalText);
        var _b = findSubstringBetweenTags(rest1, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag), ifCaseChildText = _b[0], rest2 = _b[1];
        // console.log("ifCaseChildText");
        // console.log(ifCaseChildText);
        var _c = findSubstringBetweenTags(rest2, FLNodeIf.syntaxSymbols.enclosureEndTag, FLNodeIf.syntaxSymbols.enclosureStartTag), elseText = _c[0], rest3 = _c[1];
        // console.log("elseText");
        // console.log(elseText);
        if (elseText.trim() !== FLNodeIf.syntaxSymbols.ifElseTag) {
            throw "Invalid text close to the ELSE token";
        }
        var _d = findSubstringBetweenTags(rest3, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag), elseCaseText = _d[0], rest4 = _d[1];
        // console.log("elseCaseText");
        // console.log(elseCaseText);
        // Calc the line positions
        var ifCaseLine = this.nodeLine + ifConditionalText.split("\n").length;
        var elseCaseLine = ifCaseLine + elseText.split("\n").length + elseCaseText.split("\n").length;
        var children = ([
            new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
            new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
            new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, elseCaseText, elseCaseLine),
        ]);
        this.children = children;
        return children;
    };
    FLNodeIf.prototype.run = function (scopeEnvironment) {
        // Depending on the ifConditional result eval one of the remaining children
        var ifCondEvaluation = (0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(scopeEnvironment)[0]);
        var returnVal;
        if (ifCondEvaluation) {
            returnVal = this.children[1].run(scopeEnvironment);
        }
        else {
            returnVal = this.children[2].run(scopeEnvironment);
        }
        return returnVal;
    };
    FLNodeIf.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        var ifCondEvaluation = (0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(inputScopeEnvironment)[0]);
        if (ifCondEvaluation) {
            this.whichBlockChildToEval = 1;
        }
        else {
            this.whichBlockChildToEval = 2;
        }
        // Check if conditional was run? if not run it and set which child block will be eval
        if (this.children[0].status !== flSuperModule.GlobalStatusEnum.postRun) {
            var _a = this.children[0].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _a.currentLine, newScopeEnv = _a.scopeEnvironment, newCallStack = _a.callStack, newOutput = _a.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
        else {
            var _b = this.children[this.whichBlockChildToEval].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _b.currentLine, newScopeEnv = _b.scopeEnvironment, newCallStack = _b.callStack, newOutput = _b.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
        var curLine = inputCurrentLine;
        var curScopeEnvironment = inputScopeEnvironment;
        var curStack = inputCallStack;
        return ({
            currentLine: curLine,
            scopeEnvironment: curScopeEnvironment,
            callStack: curStack,
            output: null
        });
        this.status = flSuperModule.GlobalStatusEnum.postRun;
        return ({
            currentLine: inputCurrentLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: inputCallStack,
            output: null
        });
    };
    FLNodeIf.syntaxSymbols = {
        ifStartTag: "IF",
        ifElseTag: "ELSE",
        enclosureStartTag: "{",
        enclosureEndTag: "}"
    };
    return FLNodeIf;
}(flSuperModule.FLNode));
exports.FLNodeIf = FLNodeIf;
