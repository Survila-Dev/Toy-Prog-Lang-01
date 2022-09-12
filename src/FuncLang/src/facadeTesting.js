const { FLCode } = require("../dist/FLCode")

const curCode = new FLCode(
    inputText = "a = 6;\nPRINT(a);\nb = 12;\nPRINT(b+a);\nc = a+b;",
    executionInterval = 1000
);

// const curCode = new FLCode(
//     inputText = "a = 6;\nb = 12;\nPRINT(b);\nc = a+b;\nPRINT(c*c+b);\nPRINT(c*c+b);\nPRINT(c*c+b);\nPRINT(c*c+b);\nc = a+b;\nc = a+b;\nc = a+b;",
//     executionInterval = 1000
// );

// console.log(`STEP 0`)
// console.log("STACK:")
// console.log(curCode.callStack)
// console.log("LEXENC:")
// console.log(curCode.executionContext)
// console.log("OUTPUT:")
// console.log(curCode.currentOutput)
// console.log("CURRENT LINE")
// console.log(curCode.currentLine)
// console.log("ERROR LINE")
// console.log(curCode.errorLine)

for (let i = 0; i < 40; i++) {
    console.log("==================================================")
    console.log(`STEP ${i}`)
    console.log("STACK:")
    console.log(curCode.callStack)
    console.log("LEXENC:")
    console.log(curCode.executionContext)
    console.log("OUTPUT:")
    console.log(curCode.currentOutput)
    console.log("CURRENT LINE")
    console.log(curCode.currentLine)
    console.log("ERROR LINE")
    console.log(curCode.errorLine)
    curCode.runOneStep(curCode.currentLine, curCode.executionContext, curCode.callStack)
}
