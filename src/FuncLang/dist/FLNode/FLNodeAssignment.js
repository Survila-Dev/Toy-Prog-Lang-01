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
exports.FLNodeAssignment = void 0;
var flSuperModule = require("./FLNodeSuper");
var flExpModule = require("./FLNodeExpression");
var FLNodeAssignment = /** @class */ (function (_super) {
    __extends(FLNodeAssignment, _super);
    function FLNodeAssignment(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        if (nodeLine) {
            _this.nodeLine = nodeLine;
        }
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodeAssignment.prototype.createChildren = function () {
        var childText = this.text.split(FLNodeAssignment.syntaxSymbols.assignment, 2)[1];
        var onlyChild = new flExpModule.FLNodeExpression(flSuperModule.FLNodeTypeEnum.Expression, childText);
        return [onlyChild];
    };
    FLNodeAssignment.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
            this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;
            var tempScopeEnv = inputScopeEnvironment;
            this.run(tempScopeEnv);
            return {
                currentLine: this.nodeLine,
                scopeEnvironment: tempScopeEnv,
                callStack: inputCallStack,
                output: null
            };
        }
        var outputCallStack = flSuperModule.genericStateChange(this, inputCallStack);
        return {
            currentLine: this.nodeLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: outputCallStack,
            output: null
        };
    };
    FLNodeAssignment.prototype.run = function (scopeEnvironment) {
        var assignmentVar = this.text.split(FLNodeAssignment.syntaxSymbols.assignment, 2)[0].trim();
        var onlyChildValue = this.children[0].run(scopeEnvironment)[0];
        scopeEnvironment[assignmentVar] = onlyChildValue;
        return ([, ""]);
    };
    FLNodeAssignment.syntaxSymbols = {
        assignment: "="
    };
    return FLNodeAssignment;
}(flSuperModule.FLNode));
exports.FLNodeAssignment = FLNodeAssignment;
