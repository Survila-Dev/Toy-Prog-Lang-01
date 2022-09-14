"use strict";
/* TDD TESTING SUITE */
exports.__esModule = true;
var FLNodeSuper_1 = require("./FLNode/FLNodeSuper");
var FLNodeExpression_1 = require("./FLNode/FLNodeExpression");
var FLNodePrint_1 = require("./FLNode/FLNodePrint");
var FLNodeAssignment_1 = require("./FLNode/FLNodeAssignment");
var FLNodeBlock_1 = require("./FLNode/FLNodeBlock");
var splitString_1 = require("./splitString");
var FLNodeConditional_1 = require("./FLNode/FLNodeConditional");
/* SETTING UP THE TESTING ENVIRONMENT */
var currentTestNo = 1;
var numOfSuccessfullTests = 0;
var numOfFailedTests = 0;
function compareFunctionOutput(inputFunc, expectedOutput, funcArgs) {
    console.log("\tTest ".concat(currentTestNo));
    var funcOutput = inputFunc.apply(void 0, funcArgs);
    var isEqual = false;
    // Compare arrays because of JS
    if (Array.isArray(funcOutput)) {
        isEqual = true;
        for (var i = 0; i < funcOutput.length; i++) {
            if (funcOutput[i] !== expectedOutput[i]) {
                isEqual = false;
            }
        }
    }
    else {
        isEqual = funcOutput === expectedOutput;
    }
    if (isEqual) {
        numOfSuccessfullTests++;
        console.log("\t-- Success of test ".concat(currentTestNo));
        currentTestNo++;
        return true;
    }
    else {
        numOfFailedTests++;
        console.log("\t-- Failure of test ".concat(currentTestNo));
        console.log("\t-- Function output:");
        console.log(funcOutput);
        currentTestNo++;
        return false;
    }
}
var startOfTestSuite = function () {
    console.log("\nStart of the test suite\n");
};
var summaryOfTestSuite = function () {
    currentTestNo--;
    console.log("\n\tSummary of test suite");
    console.log("\t-- Ran ".concat(currentTestNo, " tests"));
    if (currentTestNo === numOfSuccessfullTests) {
        console.log("\t-- All tests were successful!");
    }
    else {
        console.log("\t-- ".concat(numOfFailedTests, " of the tests failed!"));
    }
};
/* HERE START THE TESTING FUNCTIONS */
startOfTestSuite();
compareFunctionOutput(function () {
    var result = (0, splitString_1.stringSplitIgnoringTags)("2+2", "+", [["(", ")"]]);
    return result;
}, ["2", "2"], []);
compareFunctionOutput(function () {
    var result = (0, splitString_1.stringSplitIgnoringTags)("(5+2)+5-3+2*5+(5/6+2+9)", "+", [["(", ")"]]);
    return result;
}, ["(5+2)", "5-3", "2*5", "(5/6+2+9)"], []);
compareFunctionOutput(splitString_1.stringIgnoringTags, "labas", ["(kei ks)labas", "(", ")"]);
compareFunctionOutput(splitString_1.stringIgnoringTags, "", ["(kei() ks)", "(", ")"]);
compareFunctionOutput(splitString_1.stringIgnoringTags, "kas", ["(kei() ks)kas(nieko)", "(", ")"]);
compareFunctionOutput(splitString_1.stringIgnoringTags, "", ["(kas)", "(", ")"]);
compareFunctionOutput(function () {
    var result = (0, splitString_1.stringSplitIgnoringTags)("(5+2)+5-3+2-5+(5/6+2+9)", "-", [["(", ")"]]);
    return result;
}, ["(5+2)+5", "3+2", "5+(5/6+2+9)"], []);
compareFunctionOutput(function () {
    var result = (0, splitString_1.stringSplitIgnoringTags)("(5+2)+5-{3+2-5}-{5/6+2+9}", "-", [["(", ")"], ["{", "}"]]);
    return result;
}, ["(5+2)+5", "{3+2-5}", "{5/6+2+9}"], []);
compareFunctionOutput(function () {
    var result = (0, splitString_1.stringSplitIgnoringTags)("(5+2)+5-FUNC {3+2-5}-FUNC{5/6+2+9}", "-", [["(", ")"], ["FUNC", "}"]]);
    return result;
}, ["(5+2)+5", "FUNC {3+2-5}", "FUNC{5/6+2+9}"], []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2");
    return testNode.expressionSymbol;
}, "no", []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2");
    var comparisonValue = testNode.run({})[0];
    return comparisonValue;
}, 2, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2+2");
    return testNode.expressionSymbol;
}, "+", []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2/2");
    return testNode.expressionSymbol;
}, "/", []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2+2");
    var comparisonValue = testNode.run({})[0];
    return comparisonValue;
}, 4, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(2+12)");
    var comparisonValue = testNode.run({})[0];
    return comparisonValue;
}, 14, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(5-2)");
    var comparisonValue = testNode.run({})[0];
    return comparisonValue;
}, 3, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(2*6)");
    var comparisonValue = testNode.run({})[0];
    return comparisonValue;
}, 12, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(2+(9-5))");
    return testNode.run({})[0];
}, 6, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2+(9-5)");
    return testNode.run({})[0];
}, 6, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(2.5*5)+(27/6)");
    return testNode.run({})[0];
}, 17, []);
compareFunctionOutput(function () {
    var testNode = new FLNodePrint_1.FLNodePrint(FLNodeSuper_1.FLNodeTypeEnum.Print, "PRINT(6)");
    var _a = testNode.run({}), comparisonValue = _a[1];
    return comparisonValue;
}, "6", []);
compareFunctionOutput(function () {
    var testNode = new FLNodePrint_1.FLNodePrint(FLNodeSuper_1.FLNodeTypeEnum.Print, "PRINT((2.5*5)+(27/6))");
    var _a = testNode.run({}), comparisonValue = _a[1];
    return comparisonValue;
}, "17", []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "a");
    return testNode.run({ a: 6.6 })[0];
}, 6.6, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "(2.5*a)+(b/6)");
    return testNode.run({ a: 5, b: 27 })[0];
}, 17, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2+5+4+7+1+1+1+1");
    return testNode.run({})[0];
}, 22, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "6-2+5+9");
    return testNode.run({})[0];
}, 18, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "6-2+5+9");
    return testNode.run({})[0];
}, 18, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "6*2+5/2");
    return testNode.run({})[0];
}, 14.5, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "6*(2+5)/2");
    return testNode.run({})[0];
}, 21, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeExpression_1.FLNodeExpression(FLNodeSuper_1.FLNodeTypeEnum.Expression, "2+2");
    return testNode.run({});
}, [4, ""], []);
compareFunctionOutput(function () {
    var scopeEnv = {
        "a": 20,
        "b": 25
    };
    var testNode = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "a = 25");
    testNode.run(scopeEnv);
    return scopeEnv.a;
}, 25, []);
compareFunctionOutput(function () {
    var scopeEnv = {
        "a": 20,
        "b": 25
    };
    var testNode = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "a = 25 + a + b");
    testNode.run(scopeEnv);
    return scopeEnv.a;
}, 70, []);
compareFunctionOutput(function () {
    var scopeEnv = {
        "a": 20,
        "b": 25
    };
    var testNodeOne = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "a = 25 + a + b");
    testNodeOne.run(scopeEnv);
    var testNodeTwo = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "b = 2 * b");
    testNodeTwo.run(scopeEnv);
    return [scopeEnv.a, scopeEnv.b];
}, [70, 50], []);
compareFunctionOutput(function () {
    var scopeEnv = {
        "a": 20,
        "b": 25,
        "c": 0,
        "d": 0
    };
    var testNode = new FLNodeBlock_1.FLNodeBlock(FLNodeSuper_1.FLNodeTypeEnum.Block, "a = 10;" +
        "b = 26;" +
        "c = a + b;" +
        "d = 26;");
    testNode.run(scopeEnv);
    return [scopeEnv.a, scopeEnv.b, scopeEnv.c, scopeEnv.d];
}, [10, 26, 36, 26], []);
compareFunctionOutput(function () {
    var scopeEnv = {
        "a": 20,
        "b": 25
    };
    var testNode = new FLNodeBlock_1.FLNodeBlock(FLNodeSuper_1.FLNodeTypeEnum.Block, "a = 10;" +
        "b = 26;" +
        "FUNCTION Here I am" +
        "text;" +
        "END;" +
        "WHILE" +
        "text;" +
        "( )" +
        ";" +
        "END");
    return testNode.childrenTextPublic.length;
}, 4, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(1)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "2 > 1", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "10 <= 1", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "10 >= 1", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "69 == 100", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "100 == 100", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "50 + 50 == 100", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "50 + 50 >= 100", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(50 + 50) >= 10 * (6 + 6)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "120 == 10 * (6 + 6)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "120 != 10 * (6 + 6)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "119 != 10 * (6 + 6)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "10 + 90 == 100", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, " ( 10 + 90 == 100)  ", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var lexEnv = {};
    var testNode = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "a = ( 10 + 90 == 100)  ", 1);
    var output = testNode.run(lexEnv);
    return lexEnv["a"];
}, 1, []);
compareFunctionOutput(function () {
    var lexEnv = {};
    var testNode = new FLNodeAssignment_1.FLNodeAssignment(FLNodeSuper_1.FLNodeTypeEnum.VariableAssignment, "abc = ( 10 + 90 != 100)  ", 1);
    var output = testNode.run(lexEnv);
    return lexEnv["abc"];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "!(1)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "!(0)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "!(5 > 2)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "!(5 == 5)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(1 & 1)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(0 & 1)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(0 | 1)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "(0 | 0)", 1);
    var output = testNode.run({});
    return output[0];
}, 0, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "((1 | 0) | 0)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
compareFunctionOutput(function () {
    var testNode = new FLNodeConditional_1.FLNodeConditional(FLNodeSuper_1.FLNodeTypeEnum.Conditional, "((1 | 0) & 1)", 1);
    var output = testNode.run({});
    return output[0];
}, 1, []);
summaryOfTestSuite();
