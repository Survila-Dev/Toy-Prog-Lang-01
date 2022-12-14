const { FLCode } = require("../dist/FLCode")

// const curCode = new FLCode(
//     inputText = "a = 6;\nPRINT(a);\nb = 12;\nPRINT(b+a);\nc = a+b;",
//     executionInterval = 1000
// );

// const curCode = new FLCode(
//     inputText = "a = 6;\nb = 12;\nPRINT(b);\nc = a+b;\nPRINT(c*c+b);\nPRINT(c*c+b);\nPRINT(c*c+b);\nPRINT(c*c+b);\nc = a+b;\nc = a+b;\nc = a+b;",
//     executionInterval = 1000
// );

// If test 01
const curCode = new FLCode(
    inputText = 
       "a = 2;\n"
     + "PRINT(2);\n"
     + "IF (a > 8) {\n"
     + "\n\n"
     + "\tb = 206;\n"
     + "\tPRINT(2);\n"
     + "\ta = 201;\n"
     + "} ELSE {\n"
     + "\tb = 4002;\n"
     + "\ta = 3001;\n"
     + "};\n"
     + "c = 45;\n"
     + "PRINT(2);",
    executionInterval = 1000
);

// const curCode = new FLCode(
//     inputText = 
//        "a = 2;\n"
//      + "PRINT(2);\n"
//      + "IF (a > 8) {\n"
//      + "\n\n"
//      + "\tb = 206;\n"
//      + "\tPRINT(2);\n"
//      + "\ta = 201;\n"
//      + "};\n"
//      + "c = 45;\n"
//      + "PRINT(2);",
//     executionInterval = 1000
// );

// // If test 02
// const curCode = new FLCode(
//     inputText = 
//        "a = 2;\n"
//      + "IF (a > 5) {\n"
//      + "\tPRINT(Larger than 5);\n"
//      + "\tb = 206;\n"
//      + "\tPRINT(b)\n"
//      + "}\n",
//     executionInterval = 1000
// );

// // While test 01
// const curCode = new FLCode(
//     inputText = 
//        "a = 6;\n"
//      + "WHILE (a > 2) {\n"
//      + "\ta = a - 1;\n"
//      + "\tPRINT(a);\n"
//      + "}"
//     executionInterval = 1000
// );

// // While test 02
// const curCode = new FLCode(
//     inputText = 
//        "irk = 100;\n"
//      + "WHILE (irk >= 1) {\n"
//      + "\tirk = irk / 2;\n"
//      + "\tPRINT(irk);\n"
//      + "}"
//     executionInterval = 1000
// );

// // For test 01
// const curCode = new FLCode(
//     inputText = 
//        "FOR (it = 1; it < 20; it = it + 1) {\n"
//      + "\tPRINT(For loop)/ 2;\n"
//      + "\tPRINT(it);\n"
//      + "}"
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
