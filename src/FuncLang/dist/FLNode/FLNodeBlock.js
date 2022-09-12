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
exports.FLNodeBlock = void 0;
var flSuperModule = require("./FLNodeSuper");
var flNodePrint = require("./FLNodePrint");
var flNodeAssignment = require("./FLNodeAssignment");
var splitString_1 = require("../splitString");
var flNodeIf = require("./FLNodeIf");
var flNodeFor = require("./FLNodeFor");
var flNodeWhile = require("./FLNodeWhile");
var flNodeFunction = require("./FLNodeFunction");
var FLNodeBlock = /** @class */ (function (_super) {
    __extends(FLNodeBlock, _super);
    function FLNodeBlock(type, text) {
        var _this = _super.call(this, type, text) || this;
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodeBlock.prototype.createChildren = function () {
        var allTagsForBlock = [
            [flNodeIf.FLNodeIf.syntaxSymbols.startTag, flNodeIf.FLNodeIf.syntaxSymbols.endTag],
            [flNodeWhile.FLNodeWhile.syntaxSymbols.startTag, flNodeWhile.FLNodeWhile.syntaxSymbols.endTag],
            [flNodeFor.FLNodeFor.syntaxSymbols.startTag, flNodeFor.FLNodeFor.syntaxSymbols.endTag],
            [flNodeFunction.FLNodeFunction.syntaxSymbols.startTag, flNodeFunction.FLNodeFunction.syntaxSymbols.endTag],
        ];
        var childrenText = (0, splitString_1.stringSplitIgnoringTags)(this.text, FLNodeBlock.syntaxSymbols.lineBreak, allTagsForBlock);
        this.childrenTextPublic = childrenText;
        var children = childrenText.map(function (childText, i) {
            if (childText.includes(flNodeAssignment.FLNodeAssignment.syntaxSymbols.assignment)) {
                return new flNodeAssignment.FLNodeAssignment(flSuperModule.FLNodeTypeEnum.VariableAssignment, childText, i + 1);
            }
            else if (childText.includes(flNodePrint.FLNodePrint.syntaxSymbols.printStart)) {
                return new flNodePrint.FLNodePrint(flSuperModule.FLNodeTypeEnum.Print, childText, i + 1);
            }
        });
        children.pop();
        this.children = children;
        return children;
    };
    FLNodeBlock.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        for (var i = 0; i < this.children.length; i++) {
            if (!(this.children[i].status === flSuperModule.GlobalStatusEnum.postRun)) {
                var _a = this.children[i].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _a.currentLine, newScopeEnv = _a.scopeEnvironment, newCallStack = _a.callStack, newOutput = _a.output;
                return {
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput
                };
            }
        }
        return {
            currentLine: inputCurrentLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: inputCallStack,
            output: null
        };
    };
    FLNodeBlock.prototype.run = function (scopeEnvironment) {
        var _a;
        var consOut;
        var singleConsOut;
        consOut = [];
        for (var i = 0; i < this.children.length; i++) {
            _a = this.children[i].run(scopeEnvironment), singleConsOut = _a[1];
            if (singleConsOut) {
                consOut.push(singleConsOut);
            }
        }
        if (consOut.length > 0) {
            console.log(consOut);
            return ([null, consOut]);
        }
        return ([null, null]);
    };
    FLNodeBlock.syntaxSymbols = {
        lineBreak: ";"
    };
    return FLNodeBlock;
}(flSuperModule.FLNode));
exports.FLNodeBlock = FLNodeBlock;
