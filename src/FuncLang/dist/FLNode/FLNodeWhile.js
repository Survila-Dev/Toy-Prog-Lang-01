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
exports.FLNodeWhile = void 0;
var flSuperModule = require("./FLNodeSuper");
var flNodeIf = require("./FLNodeIf");
var FLNodeConditional_1 = require("./FLNodeConditional");
var FLNodeBlock_1 = require("./FLNodeBlock");
var FLNodeWhile = /** @class */ (function (_super) {
    __extends(FLNodeWhile, _super);
    function FLNodeWhile(type, text, nodeLine, forInitString, forIterString) {
        if (forInitString === void 0) { forInitString = ""; }
        if (forIterString === void 0) { forIterString = ""; }
        var _this = _super.call(this, type, text) || this;
        _this.forInitString = forInitString;
        _this.forIterString = forIterString;
        if (_this.forInitString.length !== 0)
            _this.forInitString += ";";
        if (_this.forIterString.length !== 0)
            _this.forIterString += ";";
        var stringUntilWhile = "";
        var whileTag = FLNodeWhile.syntaxSymbols.whileStart;
        for (var i = 0; i < _this.text.length; i++) {
            if (_this.text.substring(i, i + whileTag.length) === whileTag) {
                var stringUntilWhile_1 = _this.text.substring(0, i + 1);
            }
        }
        _this.nodeLine = nodeLine + stringUntilWhile.split("\n").length - _this.text.split("\n").length;
        _this.shouldConditionalChildBeRun = true;
        _this.children = _this.createChildren();
        return _this;
    }
    FLNodeWhile.prototype.createChildren = function (onlyFirstTwo) {
        if (onlyFirstTwo === void 0) { onlyFirstTwo = false; }
        // Create child for whileCondition, whileCase
        var _a = flNodeIf.findSubstringBetweenTags(this.text, FLNodeWhile.syntaxSymbols.whileStart, FLNodeWhile.syntaxSymbols.enclosureStartTag), whileConditionalText = _a[0], rest1 = _a[1];
        var _b = flNodeIf.findSubstringBetweenTags(rest1, FLNodeWhile.syntaxSymbols.enclosureStartTag, FLNodeWhile.syntaxSymbols.enclosureEndTag), whileCaseText = _b[0], rest2 = _b[1];
        // Calc the nodeLine arguments for the children
        var whileConditionalLine = this.nodeLine;
        if (whileConditionalText.trimStart().split("\n").length
            !== whileConditionalText.split("\n").length) {
            whileConditionalLine += whileConditionalText.split("\n").length
                - whileConditionalText.trimStart().split("\n").length;
        }
        var whileCaseLine = whileConditionalLine + whileConditionalText.split("\n").length - 1;
        if (whileCaseText.trimStart().split("\n").length
            !== whileCaseText.split("\n").length) {
            whileCaseLine += whileCaseText.split("\n").length
                - whileCaseText.trimStart().split("\n").length;
        }
        var children;
        if (this.forInitString.length === 0) {
            children = ([
                new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine)
            ]);
        }
        else {
            if (onlyFirstTwo) {
                children = ([
                    new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                    new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine),
                    this.children[2],
                ]);
            }
            else {
                children = ([
                    new FLNodeConditional_1.FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, whileConditionalText, whileConditionalLine),
                    new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, whileCaseText + this.forIterString, whileCaseLine),
                    new FLNodeBlock_1.FLNodeBlock(flSuperModule.FLNodeTypeEnum.Block, this.forInitString, whileConditionalLine),
                ]);
            }
        }
        this.children = children;
        return children;
    };
    FLNodeWhile.prototype.run = function (scopeEnvironment) {
        var returnVal;
        returnVal = [, []];
        if (this.children.length === 3) { // Running for init command
            var returnValNew = this.children[2].run(scopeEnvironment);
            // console.log("scopeEnvironment");
            // console.log(scopeEnvironment);
            returnVal[1] = returnVal[1].concat([returnValNew[1]]);
        }
        while ((0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(scopeEnvironment)[0])) {
            var returnValNew = this.children[1].run(scopeEnvironment);
            returnVal[1] = returnVal[1].concat([returnValNew[1]]);
            // ! Implement the breaking from the while loop which is triggered by some event from React
        }
        return returnVal;
    };
    FLNodeWhile.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        // console.log(this.shouldConditionalChildBeRun)
        if (this.children.length === 3
            && this.children[2].status !== flSuperModule.GlobalStatusEnum.postRun) { // Run for init
            var _a = this.children[2].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _a.currentLine, newScopeEnv = _a.scopeEnvironment, newCallStack = _a.callStack, newOutput = _a.output;
            return ({
                currentLine: newCurLine,
                scopeEnvironment: newScopeEnv,
                callStack: newCallStack,
                output: newOutput
            });
        }
        // check if conditional node should be run
        if (this.shouldConditionalChildBeRun) {
            // console.log("Conditional child starts running")
            // if conditional child is postrun when let this node execute the block and stop executing
            if (this.children[0].status === flSuperModule.GlobalStatusEnum.postRun) {
                this.shouldConditionalChildBeRun = false;
                var conditionalChildValue = (0, FLNodeConditional_1.convertToBoolean)(this.children[0].run(inputScopeEnvironment)[0]);
                this.executeBlockChild = conditionalChildValue;
                if (!conditionalChildValue) {
                    this.status = flSuperModule.GlobalStatusEnum.postRun;
                }
                return ({
                    currentLine: inputCurrentLine,
                    scopeEnvironment: inputScopeEnvironment,
                    callStack: inputCallStack,
                    output: null
                });
            }
            else { // runs conditional child
                // console.log("Conditional child runs a step")
                // console.log(this.children[0])
                var _b = this.children[0].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _b.currentLine, newScopeEnv = _b.scopeEnvironment, newCallStack = _b.callStack, newOutput = _b.output;
                return ({
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput
                });
            }
        }
        else { // block child will be run, if block child is postrun run the conditional again
            if (this.children[1].status === flSuperModule.GlobalStatusEnum.postRun) {
                // Both childs are redeclared
                this.createChildren(true);
                this.shouldConditionalChildBeRun = true;
                return ({
                    currentLine: inputCurrentLine,
                    scopeEnvironment: inputScopeEnvironment,
                    callStack: inputCallStack,
                    output: null
                });
            }
            else { // Block child is evaluted
                // console.log("Block child with in while is evaluated");
                var _c = this.children[1].runOneStep(inputCurrentLine, inputScopeEnvironment, inputCallStack), newCurLine = _c.currentLine, newScopeEnv = _c.scopeEnvironment, newCallStack = _c.callStack, newOutput = _c.output;
                return ({
                    currentLine: newCurLine,
                    scopeEnvironment: newScopeEnv,
                    callStack: newCallStack,
                    output: newOutput
                });
            }
        }
    };
    FLNodeWhile.syntaxSymbols = {
        whileStart: "WHILE",
        enclosureStartTag: "{",
        enclosureEndTag: "}"
    };
    return FLNodeWhile;
}(flSuperModule.FLNode));
exports.FLNodeWhile = FLNodeWhile;
