"use strict";
exports.__esModule = true;
exports.FLCode = void 0;
var FLNodeBlock_1 = require("./FLNode/FLNodeBlock");
var FLNode = require("./FLNode/FLNodeSuper");
var FLCode = /** @class */ (function () {
    function FLCode(inputText, executionInterval) {
        // Setting the variables
        this.internalText = inputText;
        this.executionInterval = executionInterval;
        this.currentLine = null;
        this.errorLine = null;
        this.breakPoints = [];
        this.currentOutput = null;
        // Parsing the inputText
        this.child = new FLNodeBlock_1.FLNodeBlock(FLNode.FLNodeTypeEnum.Block, inputText);
        // console.log(this.child)
        this.callStack = [];
        this.executionContext = {};
    }
    FLCode.prototype.runOneStep = function (inputCurrentLine, inputExecutionContext, inputCallStack) {
        // Prepare the values for runOneStep
        // const altCallStack = inputCallStack.map((element) => element[0])
        // let altExecutionContext = {}
        // Object.keys(inputExecutionContext).forEach((key) => {
        //     altExecutionContext[key] = inputExecutionContext[key][0]
        // })
        var altInputCurLine = JSON.parse(JSON.stringify(inputCurrentLine));
        var altCallStack = JSON.parse(JSON.stringify(inputCallStack));
        var altExecutionContext = JSON.parse(JSON.stringify(inputExecutionContext));
        var outObj = this.child.runOneStep(altInputCurLine, altExecutionContext, altCallStack);
        this.currentLine = JSON.parse(JSON.stringify(outObj.currentLine));
        this.executionContext = JSON.parse(JSON.stringify(outObj.scopeEnvironment));
        this.callStack = JSON.parse(JSON.stringify(outObj.callStack));
        this.currentOutput = JSON.parse(JSON.stringify(outObj.output));
        return "";
    };
    ;
    return FLCode;
}());
exports.FLCode = FLCode;
