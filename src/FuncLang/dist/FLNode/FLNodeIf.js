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
exports.findSubstringBetweenTags = exports.FLNodeIf = void 0;
var flSuperModule = require("./FLNodeSuper");
var FLNodeConditional_1 = require("./FLNodeConditional");
var FLNodeBlock_1 = require("./FLNodeBlock");
var FLNodeIf = /** @class */ (function (_super) {
    __extends(FLNodeIf, _super);
    function FLNodeIf(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        var stringUntilIf = "";
        var ifTag = FLNodeIf.syntaxSymbols.ifStartTag;
        for (var i = 0; i < _this.text.length; i++) {
            if (_this.text.substring(i, i + ifTag.length) === ifTag) {
                var stringUntilIf_1 = _this.text.substring(0, i + 1);
            }
        }
        _this.nodeLine = nodeLine + stringUntilIf.split("\n").length - _this.text.split("\n").length;
        _this.children = _this.createChildren();
        return _this;
    }
    FLNodeIf.prototype.createChildren = function () {
        this.elseCaseExists = this.text.includes(FLNodeIf.syntaxSymbols.ifElseTag);
        // Find the text for conditional
        var _a = findSubstringBetweenTags(this.text, FLNodeIf.syntaxSymbols.ifStartTag, FLNodeIf.syntaxSymbols.enclosureStartTag), ifConditionalText = _a[0], rest1 = _a[1];
        var _b = findSubstringBetweenTags(rest1, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag), ifCaseChildText = _b[0], rest2 = _b[1];
        var ifCaseLine = this.nodeLine + ifConditionalText.split("\n").length - 1;
        if (ifCaseChildText.trimStart().split("\n").length
            !== ifCaseChildText.split("\n").length) {
            ifCaseLine += ifCaseChildText.split("\n").length - ifCaseChildText.trimStart().split("\n").length;
        }
        if (this.elseCaseExists) {
            var _c = findSubstringBetweenTags(rest2, FLNodeIf.syntaxSymbols.enclosureEndTag, FLNodeIf.syntaxSymbols.enclosureStartTag), elseText = _c[0], rest3 = _c[1];
            if (elseText.trim() !== FLNodeIf.syntaxSymbols.ifElseTag) {
                throw "Invalid text close to the ELSE token";
            }
            var _d = findSubstringBetweenTags(rest3, FLNodeIf.syntaxSymbols.enclosureStartTag, FLNodeIf.syntaxSymbols.enclosureEndTag), elseCaseText = _d[0], rest4 = _d[1];
            var elseCaseLine = this.nodeLine
                + ifConditionalText.split("\n").length - 1
                + ifCaseChildText.split("\n").length - 1; // + elseText.split("\n").length;
            if (elseCaseText.trimStart().split("\n").length
                !== elseCaseText.split("\n").length) {
                elseCaseLine += elseCaseText.split("\n").length - elseCaseText.trimStart().split("\n").length;
            }
            var children = ([
                new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
                new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
                new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, elseCaseText, elseCaseLine),
            ]);
            this.children = children;
            return children;
        }
        else {
            var children = ([
                new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, ifConditionalText, this.nodeLine),
                new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, ifCaseChildText, ifCaseLine),
            ]);
            this.children = children;
            return children;
        }
    };
    FLNodeIf.prototype.run = function (scopeEnvironment) {
        // Depending on the ifConditional result eval one of the remaining children
        var ifCondEvaluation = (0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(scopeEnvironment)[0]);
        var returnVal = [, []];
        if (ifCondEvaluation) {
            returnVal = this.children[1].run(scopeEnvironment);
        }
        else if (this.children.length == 3) {
            returnVal = this.children[2].run(scopeEnvironment);
        }
        return returnVal;
    };
    FLNodeIf.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        // Check if conditional was run? if not run it and set which child block will be eval
        if (this.children[0].status !== flSuperModule.GlobalStatusEnum.postRun) {
            var ifCondEvaluation = (0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(inputScopeEnvironment)[0]);
            if (ifCondEvaluation) {
                this.whichBlockChildToEval = 1;
            }
            else {
                this.whichBlockChildToEval = 2;
            }
            var _a = this.children[0].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _a.currentLine, newScopeEnv = _a.scopeEnvironment, newCallStack = _a.callStack, newOutput = _a.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
        else if (this.whichBlockChildToEval === 2 && !this.elseCaseExists) {
            this.status = flSuperModule.GlobalStatusEnum.postRun;
            return ({
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            });
        }
        else if (this.children[this.whichBlockChildToEval].status !== flSuperModule.GlobalStatusEnum.postRun) {
            var _b = this.children[this.whichBlockChildToEval].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _b.currentLine, newScopeEnv = _b.scopeEnvironment, newCallStack = _b.callStack, newOutput = _b.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
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
function findSubstringBetweenTags(text, startTag, endTag) {
    var stringCutStart;
    var stringCutEnd;
    var foundTheFirstTag = false;
    var foundTheSecondTag = false;
    var tagStack = 0;
    var tagsIdentical = startTag === endTag;
    if (tagsIdentical) {
        // console.log("identical tags")
        for (var i = 0; i < text.length; i++) {
            if (foundTheFirstTag && foundTheSecondTag) {
                return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)]);
            }
            if ((!foundTheFirstTag) && text.substring(i, i + startTag.length) === startTag) {
                stringCutStart = i + startTag.length;
                foundTheFirstTag = true;
                continue;
            }
            if (text.substring(i, i + endTag.length) === endTag) {
                stringCutEnd = i + endTag.length;
                foundTheSecondTag = true;
                continue;
            }
        }
        if (foundTheFirstTag && foundTheSecondTag) {
            return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)]);
        }
        else {
            throw "Not possible to find the start or end tags (start tag: ".concat(foundTheFirstTag, ", end tag: ").concat(foundTheSecondTag, ")");
        }
    }
    else {
        for (var i = 0; i < text.length; i++) {
            // console.log(`Symbol ${text[i]}, found first tag = ${foundTheFirstTag}, found second tag = ${foundTheSecondTag}`)
            if (foundTheFirstTag && foundTheSecondTag) {
                return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)]);
            }
            if (text.substring(i, i + startTag.length) === startTag) {
                if (tagStack === 0 && !foundTheFirstTag) {
                    stringCutStart = i + startTag.length;
                    foundTheFirstTag = true;
                }
                if (!tagsIdentical)
                    tagStack++;
                continue;
            }
            if (foundTheFirstTag && text.substring(i, i + endTag.length) === endTag) {
                if (!tagsIdentical)
                    tagStack--;
                if (tagStack === 0) {
                    stringCutEnd = i + endTag.length;
                    ;
                    foundTheSecondTag = true;
                }
                continue;
            }
        }
        if (foundTheFirstTag && foundTheSecondTag) {
            return ([text.substring(stringCutStart, stringCutEnd - 1), text.substring(stringCutEnd - 1, text.length)]);
        }
        else {
            throw "Not possible to find the start or end tags (start tag: ".concat(foundTheFirstTag, ", end tag: ").concat(foundTheSecondTag, ")");
        }
    }
}
exports.findSubstringBetweenTags = findSubstringBetweenTags;
