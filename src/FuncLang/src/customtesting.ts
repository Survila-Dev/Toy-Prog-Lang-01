/* TDD TESTING SUITE */

/* IMPORTING THE FUNCTIONS TO BE TESTED */

// Simple, custom testing suite for the simple programming language

import { inputFunctionHere, functionToTestString, mixedInputArgs } from "./testFunctions";
import { FLNode, FLNodeTypeEnum } from "./FLNode/FLNodeSuper";
import { FLNodeExpression } from "./FLNode/FLNodeExpression";
import { FLNodePrint } from "./FLNode/FLNodePrint";
import { FLNodeAssignment } from "./FLNode/FLNodeAssignment";
import { FLNodeBlock } from "./FLNode/FLNodeBlock";
import { stringIgnoringTags, stringSplitIgnoringTags } from "./splitString";
import { FLNodeConditional } from "./FLNode/FLNodeConditional";
import { findSubstringBetweenTags, FLNodeIf } from "./FLNode/FLNodeIf";
import { FLNodeWhile } from "./FLNode/FLNodeWhile";
import { FLNodeFor } from "./FLNode/FLNodeFor";

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
    if (Array.isArray(funcOutput) || typeof funcOutput === "string" || funcOutput instanceof String) {
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
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "2 > 1",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "10 <= 1",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "10 >= 1",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "69 == 100",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "100 == 100",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "50 + 50 == 100",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "50 + 50 >= 100",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(50 + 50) >= 10 * (6 + 6)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "120 == 10 * (6 + 6)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "120 != 10 * (6 + 6)",
        1)
        
    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "119 != 10 * (6 + 6)",
        1)
        
    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "10 + 90 == 100",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        " ( 10 + 90 == 100)  ",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {

    const lexEnv = {}
    const testNode = new FLNodeAssignment(
        FLNodeTypeEnum.VariableAssignment,
        "a = ( 10 + 90 == 100)  ",
        1)

    const output = testNode.run(lexEnv)
    return lexEnv["a"];

}, 1, [])

compareFunctionOutput(() => {

    const lexEnv = {}
    const testNode = new FLNodeAssignment(
        FLNodeTypeEnum.VariableAssignment,
        "abc = ( 10 + 90 != 100)  ",
        1)

    const output = testNode.run(lexEnv)
    return lexEnv["abc"];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "!(1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "!(0)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "!(5 > 2)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "!(5 == 5)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(1 & 1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(0 & 1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(0 | 1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(0 | 0)",
        1)

    const output = testNode.run({})
    return output[0];

}, 0, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "((1 | 0) | 0)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "((1 | 0) & 1)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "(1 | 0) & 1",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "((2 < 1) | (!(0))) & (5 > 2)",
        1)

    const output = testNode.run({})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeConditional(
        FLNodeTypeEnum.Conditional,
        "((2 < a) | (!(c))) & (a > 2)",
        1)

    const output = testNode.run({"a": 6, "c": 1})
    return output[0];

}, 1, [])

compareFunctionOutput(() => {
    const testNode = new FLNodeIf(
        FLNodeTypeEnum.IfConditional,
        "IF (1) {\na = 5;\n b=9;\n} ELSE {\na = 6;\n b=12;\n}",
        1)
    // console.log(testNode.text)

    const lexEnv = {"a": 0}
    testNode.run(lexEnv)
    return [lexEnv["a"], lexEnv["b"]];

}, [5, 9], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeIf(
        FLNodeTypeEnum.IfConditional,
        "IF (0) {\na = 5;\n b=9;\n} ELSE {\na = 6;\n b=12;\n}",
        1)

    const lexEnv = {"a": 6}
    testNode.run(lexEnv)
    return [lexEnv["a"], lexEnv["b"]];

}, [6, 12], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "a = 2;\nWHILE (a < 10) {\na = a + 1;\nPRINT(a);\n};\n",
        1)

    const lexEnv = {"a": 6}
    testNode.run(lexEnv)
    return [lexEnv["a"]];

}, [10], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "a = 22;\nWHILE (a < 10) {\na = a + 1;\nPRINT(a);\n};\n",
        1)

    const lexEnv = {"a": 6}
    testNode.run(lexEnv)
    return [lexEnv["a"]];

}, [22], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "a = 3;\nb=22;\nIF (a < 10) {\na = a + 1;\na = a + 2;\nIF (b > 5) {\nb = b + 1;\na = a + 15;\n};\nPRINT(a);\n};\n",
        1)

    // console.log(testNode.children[2]);
    // const firstIfBlockNode = testNode.children[2].children[1] as FLNode;
    // console.log(firstIfBlockNode.childrenTextPublic);
    const lexEnv = {"a": 6}
    testNode.run(lexEnv)
    return [lexEnv["a"], lexEnv["b"]];

}, [21, 23], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "a = 2;\nb=2;\nWHILE (a < 10) {\na = a + 1;\nIF (a > 5){\n b = b + 1;\n};\nPRINT(a);\n};\n",
        1)

    const lexEnv = {"a": 6}
    testNode.run(lexEnv)
    return [lexEnv["a"], lexEnv["b"]];

}, [10, 7], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "c = 0;\na = 0;\nWHILE (a < 10) {\nb = 0;\nWHILE (b < 10) {\nc = c + 1;\n b = b + 1;\n};a = a + 1;\n};",
        1)

    const lexEnv = {}
    testNode.run(lexEnv)
    return [lexEnv["c"]];

}, [100], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeFor(
        FLNodeTypeEnum.ForControl,
        "FOR (i = 0 | i < 20 | i = i + 3) {\nc = i;\n b = 12;\n};",
        1)

    const lexEnv = {}
    testNode.run(lexEnv)
    return [lexEnv["c"], lexEnv["b"]];

}, [18, 12], [])

compareFunctionOutput(() => {
    const testNode = new FLNodeBlock(
        FLNodeTypeEnum.Block,
        "k = 2; \nFOR (i = 0 | i < 20 | i = i + 3) {\nc = i;\n b = 12;\n};\nd = 16;",
        1)

    const lexEnv = {}
    testNode.run(lexEnv)
    return [lexEnv["c"], lexEnv["b"], lexEnv["k"], lexEnv["d"]];

}, [18, 12, 2, 16], [])

summaryOfTestSuite();