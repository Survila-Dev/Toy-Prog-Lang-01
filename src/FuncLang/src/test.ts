/* TDD TESTING SUITE */

/* IMPORTING THE FUNCTIONS TO BE TESTED */

import { inputFunctionHere, functionToTestString, mixedInputArgs } from "./testFunctions";
import { FLNodeTypeEnum } from "./FLNode/FLNodeSuper";
import { FLNodeExpression } from "./FLNode/FLNodeExpression";
import { FLNodePrint } from "./FLNode/FLNodePrint";
import { FLNodeAssignment } from "./FLNode/FLNodeAssignment";
import { FLNodeBlock } from "./FLNode/FLNodeBlock";
import { stringIgnoringTags, stringSplitIgnoringTags } from "./splitString";

/* SETTING UP THE TESTING ENVIRONMENT */

let currentTestNo: number = 1;
let numOfSuccessfullTests: number = 0;
let numOfFailedTests: number = 0;

function compareFunctionOutput<T>(
    inputFunc : Function,
    expectedOutput: T,
    funcArgs : unknown[]
    ): boolean {

    console.log(`\tTest ${currentTestNo}`);
    const funcOutput = inputFunc(...funcArgs);

    let isEqual: boolean = false;

    // Compare arrays because of JS
    if (Array.isArray(funcOutput)) {
        isEqual = true;
        for (let i = 0; i < funcOutput.length; i++) {
            if (funcOutput[i] !== expectedOutput[i]) {
                isEqual = false;
            }
        }
    } else {
        isEqual = funcOutput === expectedOutput;
    }
    
    if (isEqual) {
        numOfSuccessfullTests++;
        console.log(`\t-- Success of test ${currentTestNo}`);
        currentTestNo++;
        return true;
    } else {
        numOfFailedTests++;
        console.log(`\t-- Failure of test ${currentTestNo}`);
        console.log(`\t-- Function output:`);
        console.log(funcOutput);
        currentTestNo++;
        return false;
    }
}

const startOfTestSuite: Function = () => {
    console.log(`\nStart of the test suite\n`)
}

const summaryOfTestSuite: Function = () => {
    currentTestNo--;

    console.log(`\n\tSummary of test suite`)
    console.log(`\t-- Ran ${currentTestNo} tests`)
    
    if (currentTestNo === numOfSuccessfullTests) {
        console.log(`\t-- All tests were successful!`);
    } else {
        console.log(`\t-- ${numOfFailedTests} of the tests failed!`);
    }
}

/* HERE START THE TESTING FUNCTIONS */

startOfTestSuite();

compareFunctionOutput(() => {
    const result = stringSplitIgnoringTags("2+2", "+", [["(", ")"]]);
    return result;
}, ["2","2"], [])

compareFunctionOutput(() => {
    const result = stringSplitIgnoringTags("(5+2)+5-3+2*5+(5/6+2+9)", "+", [["(", ")"]]);
    return result;
}, ["(5+2)", "5-3", "2*5", "(5/6+2+9)"], [])

compareFunctionOutput(stringIgnoringTags, "labas", ["(kei ks)labas", "(", ")"]);
compareFunctionOutput(stringIgnoringTags, "", ["(kei() ks)", "(", ")"]);
compareFunctionOutput(stringIgnoringTags, "kas", ["(kei() ks)kas(nieko)", "(", ")"]);
compareFunctionOutput(stringIgnoringTags, "", ["(kas)", "(", ")"]);

compareFunctionOutput(() => {
    const result = stringSplitIgnoringTags("(5+2)+5-3+2-5+(5/6+2+9)", "-", [["(", ")"]]);
    return result;
}, ["(5+2)+5", "3+2", "5+(5/6+2+9)"], [])



compareFunctionOutput(() => {
    const result = stringSplitIgnoringTags("(5+2)+5-{3+2-5}-{5/6+2+9}", "-",
    [["(", ")"], ["{", "}"]]);
    return result;
}, ["(5+2)+5", "{3+2-5}", "{5/6+2+9}"], [])

compareFunctionOutput(() => {
    const result = stringSplitIgnoringTags("(5+2)+5-FUNC {3+2-5}-FUNC{5/6+2+9}", "-",
    [["(", ")"], ["FUNC", "}"]]);
    return result;
}, ["(5+2)+5", "FUNC {3+2-5}", "FUNC{5/6+2+9}"], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2");
    return testNode.expressionSymbol;
}, "no", []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2");
    const [comparisonValue, ] = testNode.run({});
    return comparisonValue;
}, 2, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2+2");
    return testNode.expressionSymbol;
}, "+", []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2/2");
    return testNode.expressionSymbol;
}, "/", []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2+2");
    const [comparisonValue, ] = testNode.run({});
    return comparisonValue;
}, 4, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(2+12)");
    const [comparisonValue, ] = testNode.run({});
    return comparisonValue;
}, 14, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(5-2)");
    const [comparisonValue, ] = testNode.run({});
    return comparisonValue;
}, 3, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(2*6)");
    const [comparisonValue, ] = testNode.run({});
    return comparisonValue;
}, 12, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(2+(9-5))");
    return testNode.run({})[0];
}, 6, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2+(9-5)");
    return testNode.run({})[0];
}, 6, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(2.5*5)+(27/6)");
    return testNode.run({})[0];
}, 17, []);

compareFunctionOutput(() => {
    const testNode = new FLNodePrint(FLNodeTypeEnum.Print, "PRINT(6)");
    const [, comparisonValue] = testNode.run({});
    return comparisonValue;
}, "6", []);

compareFunctionOutput(() => {
    const testNode = new FLNodePrint(FLNodeTypeEnum.Print, "PRINT((2.5*5)+(27/6))");
    const [, comparisonValue] = testNode.run({});
    return comparisonValue;
}, "17", []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "a");
    return testNode.run({a: 6.6})[0];
}, 6.6, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "(2.5*a)+(b/6)");
    return testNode.run({a: 5, b: 27})[0];
}, 17, []);



compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2+5+4+7+1+1+1+1");
    return testNode.run({})[0];
}, 22, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "6-2+5+9");
    return testNode.run({})[0];
}, 18, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "6-2+5+9");
    return testNode.run({})[0];
}, 18, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "6*2+5/2");
    return testNode.run({})[0];
}, 14.5, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "6*(2+5)/2");
    return testNode.run({})[0];
}, 21, []);

compareFunctionOutput(() => {
    const testNode = new FLNodeExpression(FLNodeTypeEnum.Expression, "2+2");
    return testNode.run({});
}, [4, ""], []);

compareFunctionOutput(() => {
    let scopeEnv = {
        "a": 20,
        "b": 25,
    }
    const testNode = new FLNodeAssignment(FLNodeTypeEnum.VariableAssignment, "a = 25");
    testNode.run(scopeEnv);
    return scopeEnv.a;

}, 25, []);

compareFunctionOutput(() => {
    let scopeEnv = {
        "a": 20,
        "b": 25,
    }
    const testNode = new FLNodeAssignment(FLNodeTypeEnum.VariableAssignment, "a = 25 + a + b");
    testNode.run(scopeEnv);
    return scopeEnv.a;

}, 70, []);

compareFunctionOutput(() => {
    let scopeEnv = {
        "a": 20,
        "b": 25,
    }
    const testNodeOne = new FLNodeAssignment(FLNodeTypeEnum.VariableAssignment, "a = 25 + a + b");
    testNodeOne.run(scopeEnv);

    const testNodeTwo = new FLNodeAssignment(FLNodeTypeEnum.VariableAssignment, "b = 2 * b");
    testNodeTwo.run(scopeEnv);

    return [scopeEnv.a, scopeEnv.b];

}, [70, 50], []);

compareFunctionOutput(() => {
    let scopeEnv = {
        "a": 20,
        "b": 25,
        "c": 0,
        "d": 0,
    }
    const testNode = new FLNodeBlock(FLNodeTypeEnum.Block,
        "a = 10;" +
        "b = 26;" +
        "c = a + b;" +
        "d = 26;");

    testNode.run(scopeEnv);
    
    return [scopeEnv.a, scopeEnv.b, scopeEnv.c, scopeEnv.d];

}, [10, 26, 36, 26], []);

compareFunctionOutput(() => {
    let scopeEnv = {
        "a": 20,
        "b": 25,
    }
    const testNode = new FLNodeBlock(FLNodeTypeEnum.Block,
        "a = 10;" +
        "b = 26;" +
        "FUNCTION Here I am" +
        "text;" +
        "END;" +
        "WHILE" +
        "text;" +
        "( )" +
        ";" +
        "END"
        );
    
    return testNode.childrenTextPublic.length;

}, 4, []);

summaryOfTestSuite();