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
exports.FLNodePrint = void 0;
var flSuperModule = require("./FLNodeSuper");
var flExpModule = require("./FLNodeExpression");
var FLNodePrint = /** @class */ (function (_super) {
    __extends(FLNodePrint, _super);
    function FLNodePrint(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        _this.nodeLine = nodeLine;
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodePrint.prototype.createChildren = function () {
        var childText = this.text.substring(FLNodePrint.syntaxSymbols.printStart.length, this.text.length - FLNodePrint.syntaxSymbols.printEnd.length);
        var child = new flExpModule.FLNodeExpression(flSuperModule.FLNodeTypeEnum.Expression, childText);
        this.children = [child];
        return [child];
    };
    FLNodePrint.prototype.run = function (scopeEnvironment) {
        return [null, this.children[0].run(scopeEnvironment)[0].toString()];
    };
    FLNodePrint.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
            this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;
            return {
                currentLine: inputCurrentLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: this.run(inputScopeEnvironment)[1]
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
    FLNodePrint.syntaxSymbols = {
        printStart: "PRINT(",
        printEnd: ")"
    };
    return FLNodePrint;
}(flSuperModule.FLNode));
exports.FLNodePrint = FLNodePrint;
