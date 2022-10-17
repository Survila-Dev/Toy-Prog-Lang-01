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
exports.convertToBoolean = exports.FLNodeConditional = void 0;
var flSuperModule = require("./FLNodeSuper");
var flExpModule = require("./FLNodeExpression");
var splitString_1 = require("../splitString");
var ConditionalType;
(function (ConditionalType) {
    ConditionalType["equal"] = "equal";
    ConditionalType["larger"] = "larger";
    ConditionalType["lower"] = "lower";
    ConditionalType["largerEqual"] = "largerEqual";
    ConditionalType["lowerEqual"] = "lowerEqual";
    ConditionalType["boolean"] = "boolean";
    ConditionalType["unequal"] = "unequal";
    ConditionalType["not"] = "not";
    ConditionalType["and"] = "and";
    ConditionalType["or"] = "or";
})(ConditionalType || (ConditionalType = {}));
var FLNodeConditional = /** @class */ (function (_super) {
    __extends(FLNodeConditional, _super);
    function FLNodeConditional(type, text, nodeLine) {
        var _this = _super.call(this, type, text) || this;
        if (nodeLine) {
            _this.nodeLine = nodeLine;
        }
        // Remove enclosure if the wrap the whole this.text
        if ((0, splitString_1.stringIgnoringTags)(_this.text, flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart, flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd).length === 0) {
            _this.text = _this.text.substring(1, _this.text.length - 1);
        }
        ;
        _this.createChildren();
        return _this;
    }
    // Create children
    FLNodeConditional.prototype.createChildren = function () {
        // Check the conditional type
        var textExcludingEnclosures = (0, splitString_1.stringIgnoringTags)(this.text, flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart, flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd);
        // add !, and, or
        if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.unequal)) {
            this.conditionalType = ConditionalType.unequal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.unequal;
        }
        else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.not)) {
            this.conditionalType = ConditionalType.not;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.not;
        }
        else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.and)) {
            this.conditionalType = ConditionalType.and;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.and;
        }
        else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.or)) {
            this.conditionalType = ConditionalType.or;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.or;
            // other conditional tokens
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.largerEqual)) {
            this.conditionalType = ConditionalType.largerEqual;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.largerEqual;
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.lowerEqual)) {
            this.conditionalType = ConditionalType.lowerEqual;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.lowerEqual;
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.equal)) {
            this.conditionalType = ConditionalType.equal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.equal;
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.larger)) {
            this.conditionalType = ConditionalType.larger;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.larger;
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.lower)) {
            this.conditionalType = ConditionalType.lower;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.lower;
        }
        else if (this.text.includes(FLNodeConditional.syntaxSymbols.unequal)) {
            this.conditionalType = ConditionalType.unequal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.unequal;
            // defaulting to boolean variable
        }
        else {
            this.conditionalType = ConditionalType.boolean;
            this.conditionalSymbol = null;
        }
        var enclosureStartSymbol = flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart;
        var enclosureEndSymbol = flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd;
        // If only boolean create one child
        if (this.conditionalType === ConditionalType.boolean) {
            var onlyChild = new flExpModule.FLNodeExpression(flSuperModule.FLNodeTypeEnum.Expression, this.text);
            this.children = [onlyChild];
            return this.children;
        }
        else if (this.conditionalType === ConditionalType.not) {
            var childText = (0, splitString_1.stringSplitIgnoringTags)(this.text, this.conditionalSymbol, [[enclosureStartSymbol, enclosureEndSymbol]])[1];
            var onlyChild = new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, childText);
            this.children = [onlyChild];
            return this.children;
        }
        else {
            // Divide to left and right child while ignoring the enclosure symbols
            if (!(this.conditionalSymbol)) {
                throw "No conditional symbol found.";
            }
            var childrenText = (0, splitString_1.stringSplitIgnoringTags)(this.text, this.conditionalSymbol, [[enclosureStartSymbol, enclosureEndSymbol]]);
            this.children = childrenText.map(function (childText) {
                return new FLNodeConditional(flSuperModule.FLNodeTypeEnum.Conditional, childText);
            });
            if (this.children.length !== 2) {
                throw "Not possible to evaluate conditional statement.";
            }
            return this.children;
        }
    };
    FLNodeConditional.prototype.run = function (scopeEnvironment) {
        // Execute the children and give either 1 or 0 for boolean value
        if (this.children.length === 1) {
            switch (this.conditionalType) {
                case ConditionalType.boolean:
                    return (this.children[0].run(scopeEnvironment));
                    break;
                case ConditionalType.not:
                    var outValue = this.children[0].run(scopeEnvironment)[0];
                    if (outValue === "true") {
                        return ([1, ""]);
                    }
                    else if (outValue === "false") {
                        return ([0, ""]);
                    }
                    if (convertToBoolean(outValue)) {
                        return ([0, ""]);
                    }
                    else if (outValue === 0) {
                        return ([1, ""]);
                    }
                    break;
            }
        }
        else {
            var leftChildValue = this.children[0].run(scopeEnvironment)[0];
            var rightChildValue = this.children[1].run(scopeEnvironment)[0];
            var outputValue = void 0;
            switch (this.conditionalType) {
                case ConditionalType.or:
                    outputValue = convertToBoolean(leftChildValue) || convertToBoolean(rightChildValue);
                    break;
                case ConditionalType.and:
                    outputValue = convertToBoolean(leftChildValue) && convertToBoolean(rightChildValue);
                    break;
                case ConditionalType.equal:
                    outputValue = leftChildValue === rightChildValue;
                    break;
                case ConditionalType.unequal:
                    outputValue = leftChildValue !== rightChildValue;
                    break;
                case ConditionalType.largerEqual:
                    outputValue = leftChildValue >= rightChildValue;
                    break;
                case ConditionalType.lowerEqual:
                    outputValue = leftChildValue <= rightChildValue;
                    break;
                case ConditionalType.larger:
                    outputValue = leftChildValue > rightChildValue;
                    break;
                case ConditionalType.lower:
                    outputValue = leftChildValue < rightChildValue;
                    break;
                default:
                    throw "Conditional value could not be evaluated.";
            }
            if (outputValue) {
                return ([1, ""]);
            }
            else {
                return ([0, ""]);
            }
        }
        return ([, ""]);
    };
    FLNodeConditional.prototype.runOneStep = function (inputCurrentLine, inputScopeEnvironment, inputCallStack) {
        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
            this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;
            return {
                currentLine: this.nodeLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null
            };
        }
        var outputCallStack = flSuperModule.genericStateChange(this, inputCallStack);
        return ({
            currentLine: this.nodeLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: outputCallStack,
            output: null
        });
    };
    FLNodeConditional.syntaxSymbols = {
        equal: "==",
        larger: ">",
        lower: "<",
        largerEqual: ">=",
        lowerEqual: "<=",
        unequal: "!=",
        not: "!",
        and: "&",
        or: "|"
    };
    return FLNodeConditional;
}(flSuperModule.FLNode));
exports.FLNodeConditional = FLNodeConditional;
function convertToBoolean(value) {
    if (parseInt(value) === 1) {
        return true;
    }
    else if (parseInt(value) === 0) {
        return false;
    }
    else {
        throw "Not a boolean value to be used for not operator";
    }
}
exports.convertToBoolean = convertToBoolean;
