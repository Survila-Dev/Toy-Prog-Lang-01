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
exports.FLNodeExpression = void 0;
var flSuperModule = require("./FLNodeSuper");
var splitString_1 = require("../splitString");
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
        if (this.type === flSuperModule.FLNodeTypeEnum.Expression) {
            if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.plus)) {
                this.type = flSuperModule.FLNodeTypeEnum.PlusExp;
                this.expressionSymbol = "+";
            }
            else if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.minus)) {
                this.type = flSuperModule.FLNodeTypeEnum.MinusExp;
                this.expressionSymbol = "-";
            }
            else if (textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.multiplication)) {
                this.type = flSuperModule.FLNodeTypeEnum.MinusExp;
                this.expressionSymbol = "*";
            }
            else if ((textIgnoreEnclosure.includes(FLNodeExpression.syntaxSymbols.division))) {
                this.type = flSuperModule.FLNodeTypeEnum.DivisionExp;
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
                return new FLNodeExpression(flSuperModule.FLNodeTypeEnum.Expression, childText);
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
                if (parseFloat(this.text) || parseFloat(this.text) === 0) {
                    if (parseFloat(this.text) === 0) {
                        return ([0, ""]);
                    }
                    return ([parseFloat(this.text), ""]);
                }
                else {
                    // Check if it there is a value and if not throw error
                    // if (this.text[0] === "\"" && this.text[this.text.length] === "\"") {
                    //     return ([this.text.substring(1, this.text.length - 1), ""])
                    // } else 
                    if (this.text in scopeEnvironment) {
                        return ([scopeEnvironment[this.text], ""]);
                    }
                    else {
                        return ([this.text, ""]);
                        console.log(this.text);
                        throw "Variable not found.";
                    }
                }
                break;
            case "+":
                // make numbers add before string
                return ([childrenRunResult.reduce(function (partialRes, a) {
                        if (!isNaN(partialRes) && !isNaN(a)) {
                            return (parseFloat(partialRes) + parseFloat(a));
                        }
                        else {
                            return partialRes + a;
                        }
                    }), ""]);
                break;
            case "-":
                return ([childrenRunResult.reduce(function (partialRes, a) { return partialRes - a; }), ""]);
                break;
            case "*":
                return ([childrenRunResult.reduce(function (partialRes, a) { return partialRes * a; }), ""]);
                break;
            case "/":
                return ([childrenRunResult.reduce(function (partialRes, a) { return partialRes / a; }), ""]);
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
}(flSuperModule.FLNode));
exports.FLNodeExpression = FLNodeExpression;
