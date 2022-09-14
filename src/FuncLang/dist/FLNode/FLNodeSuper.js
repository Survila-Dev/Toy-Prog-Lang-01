"use strict";
exports.__esModule = true;
exports.genericStateChange = exports.FLNode = exports.RunCycleStatusEnum = exports.GlobalStatusEnum = exports.FLNodeTypeEnum = void 0;
var FLNodeTypeEnum;
(function (FLNodeTypeEnum) {
    FLNodeTypeEnum["Block"] = "Block";
    FLNodeTypeEnum["Line"] = "Line";
    FLNodeTypeEnum["VariableAssignment"] = "VariableAssignment";
    FLNodeTypeEnum["Expression"] = "Expression";
    FLNodeTypeEnum["Conditional"] = "Conditional";
    FLNodeTypeEnum["PlusExp"] = "PlusExp";
    FLNodeTypeEnum["MinusExp"] = "MinusExp";
    FLNodeTypeEnum["MultipleExp"] = "MultipleExt";
    FLNodeTypeEnum["DivisionExp"] = "DivisionExp";
    FLNodeTypeEnum["IfConditional"] = "IfConditional";
    FLNodeTypeEnum["WhileControl"] = "WhileControl";
    FLNodeTypeEnum["ForControl"] = "ForControl";
    FLNodeTypeEnum["Print"] = "Print";
    FLNodeTypeEnum["Read"] = "Read";
})(FLNodeTypeEnum = exports.FLNodeTypeEnum || (exports.FLNodeTypeEnum = {}));
var GlobalStatusEnum;
(function (GlobalStatusEnum) {
    GlobalStatusEnum["noRun"] = "noRun";
    GlobalStatusEnum["inRun"] = "inRun";
    GlobalStatusEnum["postRun"] = "postRun";
})(GlobalStatusEnum = exports.GlobalStatusEnum || (exports.GlobalStatusEnum = {}));
var RunCycleStatusEnum;
(function (RunCycleStatusEnum) {
    RunCycleStatusEnum["beforeRun"] = "beforeRun";
    RunCycleStatusEnum["selectLine"] = "selectLine";
    RunCycleStatusEnum["pushToStack"] = "pushToStack";
    RunCycleStatusEnum["evaluate"] = "evaluate";
    RunCycleStatusEnum["popOffStack"] = "popOffStack";
    RunCycleStatusEnum["afterRun"] = "afterRun";
})(RunCycleStatusEnum = exports.RunCycleStatusEnum || (exports.RunCycleStatusEnum = {}));
var FLNode = /** @class */ (function () {
    function FLNode(type, text, nodeLine) {
        this.type = type;
        if (!(text)) {
            console.log("Text undefined here is the type:");
            console.log(type);
        }
        this.text = text.trim();
        this.status = GlobalStatusEnum.noRun;
        this.runCycleStatus = RunCycleStatusEnum.beforeRun;
        // this.children = this.createChildren();
    }
    ;
    FLNode.prototype.createChildren = function () {
        // Create children depending on type
        return [];
    };
    ;
    FLNode.prototype.run = function (scopeEnvironment) {
        // Run the FLNode depending on type
        return ["", ""];
    };
    ;
    FLNode.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        // This function should do nothing, because all the logic
        // is handled not at the lowest level of the node tree
        throw "runOneStep not implemented at this node.";
        return {
            currentLine: inputCurrentLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: inputCallStack,
            output: null
        };
    };
    return FLNode;
}());
exports.FLNode = FLNode;
;
function genericStateChange(inputNode, inputCallStack) {
    var outputCycleStatus;
    var outputCallStack = inputCallStack;
    switch (inputNode.runCycleStatus) {
        case RunCycleStatusEnum.beforeRun:
            inputNode.runCycleStatus = RunCycleStatusEnum.pushToStack;
            inputNode.status = GlobalStatusEnum.inRun;
            break;
        // case RunCycleStatusEnum.selectLine:
        //     inputNode.runCycleStatus = RunCycleStatusEnum.pushToStack;
        //     break;
        case RunCycleStatusEnum.pushToStack:
            outputCallStack.push(inputNode.text);
            inputNode.runCycleStatus = RunCycleStatusEnum.evaluate;
            break;
        case RunCycleStatusEnum.popOffStack:
            outputCallStack.pop();
            inputNode.runCycleStatus = RunCycleStatusEnum.afterRun;
            inputNode.status = GlobalStatusEnum.postRun;
            break;
    }
    return outputCallStack;
}
exports.genericStateChange = genericStateChange;
