"use strict";
exports.__esModule = true;
exports.mixedInputArgs = exports.functionToTestString = exports.inputFunctionHere = void 0;
var inputFunctionHere = function () {
    return 9;
};
exports.inputFunctionHere = inputFunctionHere;
var functionToTestString = function (inputString, secondInputString) {
    return inputString + "hallo" + secondInputString;
};
exports.functionToTestString = functionToTestString;
var mixedInputArgs = function (inputNum, inputString) {
    if (inputNum === 5 && inputString === "Five") {
        return true;
    }
    else {
        return false;
    }
};
exports.mixedInputArgs = mixedInputArgs;
