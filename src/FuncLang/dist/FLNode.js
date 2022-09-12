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
exports.FLNodeExpression = exports.FLNodeAssignment = exports.FLNodePrint = exports.FLNodeFunction = exports.FLNodeFor = exports.FLNodeWhile = exports.FLNodeIf = exports.FLNodeBlock = exports.FLNode = exports.FLNodeTypeEnum = void 0;
var splitString_1 = require("./splitString");
var FLNodeTypeEnum;
(function (FLNodeTypeEnum) {
    FLNodeTypeEnum["Block"] = "Block";
    FLNodeTypeEnum["Line"] = "Line";
    FLNodeTypeEnum["VariableAssignment"] = "VariableAssignment";
    FLNodeTypeEnum["Expression"] = "Expression";
    FLNodeTypeEnum["PlusExp"] = "PlusExp";
    FLNodeTypeEnum["MinusExp"] = "MinusExp";
    FLNodeTypeEnum["MultipleExp"] = "MultipleExt";
    FLNodeTypeEnum["DivisionExp"] = "DivisionExp";
    FLNodeTypeEnum["Condition"] = "Condition";
    FLNodeTypeEnum["IfConditional"] = "IfConditional";
    FLNodeTypeEnum["WhileControl"] = "WhileControl";
    FLNodeTypeEnum["ForControl"] = "ForControl";
    FLNodeTypeEnum["Print"] = "Print";
    FLNodeTypeEnum["Read"] = "Read";
})(FLNodeTypeEnum = exports.FLNodeTypeEnum || (exports.FLNodeTypeEnum = {}));
var FLNode = /** @class */ (function () {
    function FLNode(type, text) {
        this.type = type;
        this.text = text.trim();
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
    return FLNode;
}());
exports.FLNode = FLNode;
;
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
            [FLNodeIf.syntaxSymbols.startTag, FLNodeIf.syntaxSymbols.endTag],
            [FLNodeWhile.syntaxSymbols.startTag, FLNodeWhile.syntaxSymbols.endTag],
            [FLNodeFor.syntaxSymbols.startTag, FLNodeFor.syntaxSymbols.endTag],
            [FLNodeFunction.syntaxSymbols.startTag, FLNodeFunction.syntaxSymbols.endTag],
        ];
        var childrenText = (0, splitString_1.stringSplitIgnoringTags)(this.text, FLNodeBlock.syntaxSymbols.lineBreak, allTagsForBlock);
        this.childrenTextPublic = childrenText;
        var children = childrenText.map(function (childText) {
            if (childText.includes(FLNodeAssignment.syntaxSymbols.assignment)) {
                return new FLNodeAssignment(FLNodeTypeEnum.VariableAssignment, childText);
            }
            else if (childText.includes(FLNodePrint.syntaxSymbols.printStart)) {
                return new FLNodePrint(FLNodeTypeEnum.Print, childText);
            }
        });
        children.pop();
        this.children = children;
        return children;
    };
    FLNodeBlock.prototype.run = function (scopeEnvironment) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].run(scopeEnvironment);
        }
        return [, ""];
    };
    FLNodeBlock.syntaxSymbols = {
        lineBreak: ";"
    };
    return FLNodeBlock;
}(FLNode));
exports.FLNodeBlock = FLNodeBlock;
var FLNodeIf = /** @class */ (function (_super) {
    __extends(FLNodeIf, _super);
    function FLNodeIf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FLNodeIf.syntaxSymbols = {
        startTag: "IF",
        endTag: "END"
    };
    return FLNodeIf;
}(FLNode));
exports.FLNodeIf = FLNodeIf;
var FLNodeWhile = /** @class */ (function (_super) {
    __extends(FLNodeWhile, _super);
    function FLNodeWhile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FLNodeWhile.syntaxSymbols = {
        startTag: "WHILE",
        endTag: "END"
    };
    return FLNodeWhile;
}(FLNode));
exports.FLNodeWhile = FLNodeWhile;
var FLNodeFor = /** @class */ (function (_super) {
    __extends(FLNodeFor, _super);
    function FLNodeFor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FLNodeFor.syntaxSymbols = {
        startTag: "FOR",
        endTag: "END"
    };
    return FLNodeFor;
}(FLNode));
exports.FLNodeFor = FLNodeFor;
var FLNodeFunction = /** @class */ (function (_super) {
    __extends(FLNodeFunction, _super);
    function FLNodeFunction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FLNodeFunction.syntaxSymbols = {
        startTag: "FUNCTION",
        endTag: "END"
    };
    return FLNodeFunction;
}(FLNode));
exports.FLNodeFunction = FLNodeFunction;
var FLNodePrint = /** @class */ (function (_super) {
    __extends(FLNodePrint, _super);
    function FLNodePrint(type, text) {
        var _this = _super.call(this, type, text) || this;
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodePrint.prototype.createChildren = function () {
        var childText = this.text.substring(FLNodePrint.syntaxSymbols.printStart.length, this.text.length - FLNodePrint.syntaxSymbols.printEnd.length);
        var child = new FLNodeExpression(FLNodeTypeEnum.Expression, childText);
        this.children = [child];
        return [child];
    };
    FLNodePrint.prototype.run = function (scopeEnvironment) {
        return [null, this.children[0].run()[0].toString()];
    };
    FLNodePrint.syntaxSymbols = {
        printStart: "PRINT(",
        printEnd: ")"
    };
    return FLNodePrint;
}(FLNode));
exports.FLNodePrint = FLNodePrint;
var FLNodeAssignment = /** @class */ (function (_super) {
    __extends(FLNodeAssignment, _super);
    function FLNodeAssignment(type, text) {
        var _this = _super.call(this, type, text) || this;
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodeAssignment.prototype.createChildren = function () {
        var childText = this.text.split(FLNodeAssignment.syntaxSymbols.assignment, 2)[1];
        var onlyChild = new FLNodeExpression(FLNodeTypeEnum.Expression, childText);
        return [onlyChild];
    };
    FLNodeAssignment.prototype.run = function (scopeEnvironment) {
        var assignmentVar = this.text.split(FLNodeAssignment.syntaxSymbols.assignment, 2)[0].trim();
        var onlyChildValue = this.children[0].run(scopeEnvironment)[0];
        scopeEnvironment[assignmentVar] = onlyChildValue;
        return [, ""];
    };
    FLNodeAssignment.syntaxSymbols = {
        assignment: "="
    };
    return FLNodeAssignment;
}(FLNode));
exports.FLNodeAssignment = FLNodeAssignment;
var FLNodeExpression = /** @class */ (function (_super) {
    __extends(FLNodeExpression, _super);
    function FLNodeExpression(type, text) {
        var _this = _super.call(this, type, text) || this;
        _this.expressionSymbol = "no";
        // Remove enclosure if the wrap the whole this.text
        if ((0, splitString_1.stringIgnoringTags)(_this.text, FLNodeExpression.syntaxSymbols.enclosureStart, FLNodeExpression.syntaxSymbols.enclosureEnd).length === 0) {
            _this.text = _this.text.substring(1, _this.text.length - 1);
        }
        ;
        _this.reCheckType();
        _this.children = _this.createChildren();
        return _this;
    }
    ;
    FLNodeExpression.prototype.reCheckType = function () {
        var textIgnoreEnclosure = (0, splitString_1.stringIgnoringTags)(this.text, FLNodeExpression.syntaxSymbols.enclosureStart, FLNodeExpression.syntaxSymbols.enclosureEnd);
        if (this.type === FLNodeTypeEnum.Expression) {
            if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.plus)) {
                this.type = FLNodeTypeEnum.PlusExp;
                this.expressionSymbol = "+";
            }
            else if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.minus)) {
                this.type = FLNodeTypeEnum.MinusExp;
                this.expressionSymbol = "-";
            }
            else if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.multiplication)) {
                this.type = FLNodeTypeEnum.MinusExp;
                this.expressionSymbol = "*";
            }
            else if ((textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.division))) {
                this.type = FLNodeTypeEnum.DivisionExp;
                this.expressionSymbol = "/";
            }
        }
    };
    FLNodeExpression.prototype.createChildren = function () {
        if (this.expressionSymbol === "no") {
            return [];
        }
        else {
            var childrenText = (0, splitString_1.stringSplitIgnoringTags)(this.text, this.expressionSymbol, [[FLNodeExpression.syntaxSymbols.enclosureStart,
                    FLNodeExpression.syntaxSymbols.enclosureEnd]]);
            var childrenOutput = childrenText.map(function (childText) {
                return new FLNodeExpression(FLNodeTypeEnum.Expression, childText);
            });
            return childrenOutput;
        }
    };
    FLNodeExpression.prototype.run = function (scopeEnvironment) {
        var childrenRunResult;
        if (this.expressionSymbol !== "no") {
            childrenRunResult = this.children.map(function (currentChild) {
                return currentChild.run(scopeEnvironment)[0];
            });
        }
        switch (this.expressionSymbol) {
            case "no":
                if (parseFloat(this.text)) {
                    return [parseFloat(this.text), ""];
                }
                else {
                    return [scopeEnvironment[this.text], ""];
                }
                break;
            case "+":
                return [childrenRunResult.reduce(function (partialRes, a) { return partialRes + a; }), ""];
                break;
            case "-":
                return [childrenRunResult.reduce(function (partialRes, a) { return partialRes - a; }), ""];
                break;
            case "*":
                return [childrenRunResult.reduce(function (partialRes, a) { return partialRes * a; }), ""];
                break;
            case "/":
                return [childrenRunResult.reduce(function (partialRes, a) { return partialRes / a; }), ""];
                break;
        }
    };
    ;
    FLNodeExpression.syntaxSymbols = {
        enclosureStart: "(",
        enclosureEnd: ")",
        plus: "+",
        minus: "-",
        multiplication: "*",
        division: "/"
    };
    return FLNodeExpression;
}(FLNode));
exports.FLNodeExpression = FLNodeExpression;
